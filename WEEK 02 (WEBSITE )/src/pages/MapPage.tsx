import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, ArrowRight, Package, Building2, LocateFixed } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Item, Building } from '@/lib/supabase';
import { navigate } from '@/lib/router';
import { StatusBadge, TypeBadge } from '@/components/Badges';
import { timeAgo } from '@/lib/format';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/**
 * Real-world location of Symbiosis Institute of Technology (SIT), Nagpur —
 * Wathoda, Nagpur, Maharashtra.
 *
 * Calibrated directly against the real satellite imagery already loaded on
 * this map: the previous center placed the "SIT" pin in the empty field to
 * the southwest of the actual campus buildings. Using that pin's on-screen
 * position relative to the real building rooftops visible in the same
 * satellite tile (per the reference screenshot — SIT is the rightmost
 * building block), this shifts the center ~241m east / ~17m south so the
 * pin lands on the actual rightmost campus building rather than the field
 * next to it. If it still isn't pixel-perfect, right-click the exact roof
 * on Google Maps, copy the lat/lng from the context menu, and drop it in
 * here — everything else (zoom, building layout, "recenter") follows
 * automatically.
 */
const CAMPUS_CENTER: [number, number] = [21.126408, 79.160396];
const CAMPUS_NAME = 'Symbiosis Institute of Technology';
const CAMPUS_ADDRESS = 'Wathoda, Nagpur, Maharashtra 440008';
const CAMPUS_RADIUS_METERS = 140;
const CAMPUS_ZOOM = 18;

const HUE_COLOR: Record<
  string,
  { fill: string; stroke: string; text: string }
> = {
  brand: {
    fill: 'rgb(16 185 129 / 0.14)',
    stroke: 'rgb(16 185 129 / 0.8)',
    text: 'text-brand-600 dark:text-brand-400',
  },
  lost: {
    fill: 'rgb(249 115 22 / 0.14)',
    stroke: 'rgb(249 115 22 / 0.8)',
    text: 'text-lost-600 dark:text-lost-400',
  },
  found: {
    fill: 'rgb(59 130 246 / 0.14)',
    stroke: 'rgb(59 130 246 / 0.8)',
    text: 'text-found-600 dark:text-found-400',
  },
  warn: {
    fill: 'rgb(234 179 8 / 0.14)',
    stroke: 'rgb(234 179 8 / 0.8)',
    text: 'text-warn-600 dark:text-warn-400',
  },
  danger: {
    fill: 'rgb(239 68 68 / 0.14)',
    stroke: 'rgb(239 68 68 / 0.8)',
    text: 'text-danger-600 dark:text-danger-400',
  },
};

/**
 * Known real offsets (in metres from CAMPUS_CENTER) for the handful of
 * buildings this project ships by default. Matched against a building's
 * id / short_label / label / kind (case-insensitive, substring match), so
 * this keeps working even if the Supabase `id` values differ from these
 * keys — e.g. a UUID id but a label of "Central Library" still matches
 * "library".
 */
const KNOWN_BUILDING_OFFSETS: Record<string, { dx: number; dy: number }> = {
  library: { dx: 40, dy: 55 },
  hostel: { dx: 95, dy: -20 },
  labs: { dx: -35, dy: -60 },
  parking: { dx: -90, dy: 55 },
  canteen: { dx: -10, dy: 95 },
  security: { dx: -95, dy: -75 },
};

/** Small stable string hash so fallback placement never shifts on re-render. */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Converts a metre offset from CAMPUS_CENTER into a [lat, lng] pair. */
function offsetToLatLng(dx: number, dy: number): [number, number] {
  const metersPerDegLat = 111320;
  const metersPerDegLng = 111320 * Math.cos((CAMPUS_CENTER[0] * Math.PI) / 180);
  return [CAMPUS_CENTER[0] + dy / metersPerDegLat, CAMPUS_CENTER[1] + dx / metersPerDegLng];
}

/**
 * Resolves a real, stable map position for every building Supabase returns —
 * whatever its `id` turns out to be — so buildings always render as
 * clickable pins on the map, not just as buttons. Buildings that match a
 * known campus facility use a hand-placed spot; anything else is laid out
 * deterministically on a ring around the verified campus center so it never
 * overlaps and never moves between reloads.
 */
function useBuildingPositions(buildings: Building[]) {
  return useMemo(() => {
    const positions = new Map<string, [number, number]>();
    const unmatched: Building[] = [];

    buildings.forEach((building) => {
      const haystacks = [building.id, building.short_label, building.label, building.kind]
        .filter((v): v is string => Boolean(v))
        .map((v) => v.toLowerCase());

      const knownKey = Object.keys(KNOWN_BUILDING_OFFSETS).find((key) =>
        haystacks.some((h) => h.includes(key))
      );

      if (knownKey) {
        const { dx, dy } = KNOWN_BUILDING_OFFSETS[knownKey];
        positions.set(building.id, offsetToLatLng(dx, dy));
      } else {
        unmatched.push(building);
      }
    });

    const ringRadius = 110;
    unmatched.forEach((building, i) => {
      const angle =
        (i / Math.max(unmatched.length, 1)) * Math.PI * 2 +
        (hashString(building.id) % 360) * (Math.PI / 180) * 0.1;
      const jitter = 1 - (hashString(building.id) % 20) / 100;
      const dx = Math.cos(angle) * ringRadius * jitter;
      const dy = Math.sin(angle) * ringRadius * jitter;
      positions.set(building.id, offsetToLatLng(dx, dy));
    });

    return positions;
  }, [buildings]);
}

function createBuildingIcon(hue: string, active: boolean) {
  const color = HUE_COLOR[hue]?.stroke ?? HUE_COLOR.brand.stroke;

  return L.divIcon({
    className: 'custom-building-marker',
    html: `
      <div style="
        width:${active ? 42 : 36}px;
        height:${active ? 42 : 36}px;
        border-radius:12px;
        background:${color};
        border:3px solid white;
        box-shadow:0 4px 14px rgba(0,0,0,.28);
        display:flex;
        align-items:center;
        justify-content:center;
        transition:all .2s ease;
      ">
        <div style="
          width:12px;
          height:12px;
          border-radius:4px;
          background:white;
        "></div>
      </div>
    `,
    iconSize: [active ? 42 : 36, active ? 42 : 36],
    iconAnchor: [active ? 21 : 18, active ? 21 : 18],
    popupAnchor: [0, active ? -22 : -18],
  });
}

const sitIcon = L.divIcon({
  className: 'sit-campus-marker',
  html: `
    <div style="position:relative;width:52px;height:52px;display:flex;align-items:center;justify-content:center;">
      <div class="sit-campus-pulse" style="
        position:absolute;
        width:52px;
        height:52px;
        border-radius:50%;
        background:rgb(16 185 129 / 0.55);
      "></div>
      <div style="
        position:relative;
        width:48px;
        height:48px;
        border-radius:50%;
        background:#171717;
        border:4px solid white;
        box-shadow:0 5px 18px rgba(0,0,0,.35);
        display:flex;
        align-items:center;
        justify-content:center;
        color:white;
        font-weight:800;
        font-size:12px;
        letter-spacing:.3px;
      ">
        SIT
      </div>
    </div>
  `,
  iconSize: [52, 52],
  iconAnchor: [26, 26],
});

function MapController({
  mapRef,
  focusPosition,
  fitBoundsSignal,
}: {
  mapRef: React.MutableRefObject<LeafletMap | null>;
  focusPosition: [number, number] | null;
  fitBoundsSignal: [number, number][];
}) {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);

  useEffect(() => {
    if (focusPosition) {
      map.flyTo(focusPosition, 19, { duration: 0.8 });
    }
  }, [map, focusPosition]);

  useEffect(() => {
    if (!focusPosition && fitBoundsSignal.length > 0) {
      const bounds = L.latLngBounds(fitBoundsSignal);
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: CAMPUS_ZOOM });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, fitBoundsSignal.length]);

  return null;
}

export function MapPage({
  buildings,
  items,
  loading,
}: {
  buildings: Building[];
  items: Item[] | null;
  loading: boolean;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  const allItems = items ?? [];
  const positions = useBuildingPositions(buildings);

  const itemsByBuilding = useMemo(() => {
    const map = new Map<string, Item[]>();

    allItems.forEach((item) => {
      if (!item.building_id) return;

      const existing = map.get(item.building_id) ?? [];
      existing.push(item);
      map.set(item.building_id, existing);
    });

    return map;
  }, [allItems]);

  const active = buildings.find((building) => building.id === activeId);

  const activeItems = activeId ? itemsByBuilding.get(activeId) ?? [] : [];

  const mapTilerKey = import.meta.env.VITE_MAPTILER_API_KEY;

  const focusPosition = activeId ? positions.get(activeId) ?? null : null;

  const fitBoundsSignal = useMemo(() => {
    const pts: [number, number][] = [CAMPUS_CENTER];
    positions.forEach((p) => pts.push(p));
    return pts;
  }, [positions]);

  const selectBuilding = (building: Building) => {
    setActiveId(building.id);
  };

  const recenter = () => {
    setActiveId(null);
    if (mapRef.current) {
      const bounds = L.latLngBounds(fitBoundsSignal);
      mapRef.current.fitBounds(bounds, { padding: [48, 48], maxZoom: CAMPUS_ZOOM });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif-display text-4xl">Campus map</h1>

        <p className="text-sm text-ink-soft">
          Explore {CAMPUS_NAME} in {CAMPUS_ADDRESS.split(',')[0]} and view everything lost or found around campus.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="relative overflow-hidden rounded-2xl bg-canvas-subtle hairline p-4 sm:p-8">
          <div className="relative h-[380px] w-full overflow-hidden rounded-xl sm:h-[500px]">
            <MapContainer
              center={CAMPUS_CENTER}
              zoom={CAMPUS_ZOOM}
              scrollWheelZoom
              className="h-full w-full"
            >
              {mapTilerKey ? (
                <TileLayer
                  url={`https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${mapTilerKey}`}
                  maxZoom={22}
                  attribution='&copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noreferrer">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
                />
              ) : (
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maxZoom={19}
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
                />
              )}

              <MapController mapRef={mapRef} focusPosition={focusPosition} fitBoundsSignal={fitBoundsSignal} />

              <Circle
                center={CAMPUS_CENTER}
                radius={CAMPUS_RADIUS_METERS}
                pathOptions={{
                  color: '#10b981',
                  weight: 2,
                  fillColor: '#10b981',
                  fillOpacity: 0.06,
                  dashArray: '6 8',
                }}
              />

              <Marker position={CAMPUS_CENTER} icon={sitIcon}>
                <Popup>
                  <div className="min-w-[230px]">
                    <div className="text-sm font-semibold">{CAMPUS_NAME}</div>

                    <div className="mt-1 text-xs text-gray-600">{CAMPUS_ADDRESS}</div>

                    <div className="mt-2 text-xs text-gray-500">SIT Nagpur Campus</div>
                  </div>
                </Popup>
              </Marker>

              {buildings.map((building) => {
                const position = positions.get(building.id);
                if (!position) return null;

                const count = itemsByBuilding.get(building.id)?.length ?? 0;
                const isActive = activeId === building.id;

                return (
                  <Marker
                    key={building.id}
                    position={position}
                    icon={createBuildingIcon(building.hue, isActive)}
                    eventHandlers={{
                      click: () => selectBuilding(building),
                    }}
                  >
                    <Popup>
                      <div className="min-w-[190px]">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <strong>{building.label}</strong>
                        </div>

                        <div className="mt-2 text-sm text-gray-600">
                          {count} {count === 1 ? 'item' : 'items'} reported here
                        </div>

                        <button
                          type="button"
                          onClick={() => selectBuilding(building)}
                          className="mt-3 w-full rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white"
                        >
                          View reported items
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            <button
              type="button"
              onClick={recenter}
              className="absolute bottom-3 right-3 z-[1000] flex items-center gap-1.5 rounded-full bg-canvas/95 px-3 py-2 text-xs font-medium text-ink shadow-lift hairline backdrop-blur transition hover:bg-canvas"
            >
              <LocateFixed className="h-3.5 w-3.5" />
              Recenter
            </button>
          </div>

          <div className="mt-5">
            <div className="mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-ink-soft" />
              <span className="text-sm font-medium">Campus locations</span>
            </div>

            {loading ? (
              <div className="flex flex-wrap gap-2.5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton h-9 w-24 rounded-xl" />
                ))}
              </div>
            ) : buildings.length === 0 ? (
              <p className="text-sm text-ink-faint">No campus locations found yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {buildings.map((building) => {
                  const count = itemsByBuilding.get(building.id)?.length ?? 0;
                  const hue = HUE_COLOR[building.hue] ?? HUE_COLOR.brand;
                  const isActive = activeId === building.id;

                  return (
                    <button
                      key={building.id}
                      type="button"
                      onClick={() => selectBuilding(building)}
                      className={`group flex items-center gap-2 rounded-xl px-3 py-2 text-xs hairline transition-all ${
                        isActive
                          ? `${hue.text} bg-canvas-muted shadow-soft`
                          : 'text-ink-soft hover:bg-canvas-muted hover:text-ink'
                      }`}
                    >
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: hue.stroke }} />
                      <span className="font-medium">{building.short_label}</span>
                      <span className="text-ink-faint">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-2xl bg-canvas-subtle p-5 hairline"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          background: HUE_COLOR[active.hue]?.stroke ?? HUE_COLOR.brand.stroke,
                        }}
                      />

                      <h2 className="font-serif-display text-xl">{active.label}</h2>
                    </div>

                    <p className="mt-1 text-sm text-ink-soft capitalize">{active.kind}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveId(null)}
                    className="btn-ghost -mr-2 rounded-full p-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-canvas-muted p-3 text-sm text-ink-soft">
                  <Package className="h-4 w-4" />

                  <span>
                    {activeItems.length} {activeItems.length === 1 ? 'item' : 'items'} reported here
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {activeItems.length === 0 ? (
                    <div className="rounded-2xl bg-canvas-muted p-7 text-center">
                      <Package className="mx-auto h-7 w-7 text-ink-faint" />

                      <p className="mt-3 text-sm font-medium">No reports here yet</p>

                      <p className="mt-1 text-xs text-ink-faint">
                        Lost or found items reported at this location will appear here.
                      </p>
                    </div>
                  ) : (
                    activeItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => navigate({ name: 'item', id: item.id })}
                        className="group flex w-full items-center gap-3 rounded-xl bg-canvas p-3 text-left hairline transition-all hover:shadow-soft"
                      >
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="h-14 w-14 shrink-0 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-canvas-muted text-ink-faint">
                            <Package className="h-5 w-5" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <TypeBadge type={item.type} />
                            <StatusBadge status={item.status} />
                          </div>

                          <div className="mt-1 truncate font-medium">{item.title}</div>

                          <div className="text-xs text-ink-faint">{timeAgo(item.created_at)}</div>
                        </div>

                        <ArrowRight className="h-4 w-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[300px] h-full flex-col items-center justify-center rounded-2xl bg-canvas-subtle p-8 text-center hairline"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-canvas-muted text-ink-faint">
                  <MapPin className="h-7 w-7" />
                </div>

                <h3 className="mt-4 font-serif-display text-lg">Select a campus location</h3>

                <p className="mt-1 max-w-[250px] text-sm text-ink-soft">
                  Select any building on the map to see items reported there, or choose one from the list below.
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {buildings.slice(0, 3).map((building) => (
                    <button
                      key={building.id}
                      type="button"
                      onClick={() => selectBuilding(building)}
                      className="rounded-full bg-canvas-muted px-3 py-1.5 text-xs font-medium text-ink-soft hairline transition hover:text-ink"
                    >
                      {building.short_label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}