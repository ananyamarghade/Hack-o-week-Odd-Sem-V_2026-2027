import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, MapPin, Frown } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Item, Building, Category } from '@/lib/supabase';
import { useCategories, useFavorites } from '@/lib/hooks';
import { navigate, type Route } from '@/lib/router';
import { ItemCard } from '@/components/ItemCard';
import { QuickView } from '@/components/QuickView';
import { Modal } from '@/components/Modal';

const CAT_FALLBACK: Category[] = [
  { id: 'electronics', label: 'Electronics', icon: 'Laptop' },
  { id: 'cards', label: 'ID & Cards', icon: 'CreditCard' },
  { id: 'accessories', label: 'Accessories', icon: 'Glasses' },
  { id: 'keys', label: 'Keys', icon: 'Key' },
  { id: 'bags', label: 'Bags', icon: 'Briefcase' },
  { id: 'books', label: 'Books & Notes', icon: 'BookOpen' },
  { id: 'apparel', label: 'Apparel', icon: 'Shirt' },
  { id: 'containers', label: 'Containers', icon: 'CupSoda' },
];

export function BrowsePage({
  items,
  buildings,
  route,
}: {
  items: Item[] | null;
  buildings: Building[];
  route: Extract<Route, { name: 'browse' }>;
}) {
  const [query, setQuery] = useState(route.query ?? '');
  const [category, setCategory] = useState<string | null>(route.category ?? null);
  const [type, setType] = useState<string | null>(route.type ?? null);
  const [status, setStatus] = useState<string | null>(null);
  const [buildingId, setBuildingId] = useState<string | null>(null);
  const [quickView, setQuickView] = useState<Item | null>(null);
  const cats = useCategories();
  const categories = cats.length ? cats : CAT_FALLBACK;
  const { favorites, toggle } = useFavorites();

  const buildingMap = useMemo(() => new Map(buildings.map((b) => [b.id, b])), [buildings]);
  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const filtered = useMemo(() => {
    let list = items ?? [];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          (i.description ?? '').toLowerCase().includes(q) ||
          (buildingMap.get(i.building_id ?? '')?.label ?? '').toLowerCase().includes(q)
      );
    }
    if (category) list = list.filter((i) => i.category === category);
    if (type) list = list.filter((i) => i.type === type);
    if (status) list = list.filter((i) => i.status === status);
    if (buildingId) list = list.filter((i) => i.building_id === buildingId);
    return list;
  }, [items, query, category, type, status, buildingId, buildingMap]);

  const activeFilters = [category, type, status, buildingId].filter(Boolean).length;

  function clearAll() {
    setQuery('');
    setCategory(null);
    setType(null);
    setStatus(null);
    setBuildingId(null);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif-display text-4xl">Browse items</h1>
        <p className="text-sm text-ink-soft">
          {filtered.length} {filtered.length === 1 ? 'item' : 'items'} found across campus
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="sticky top-16 z-30 -mx-4 mt-6 px-4 py-3 glass sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-canvas-subtle px-3 py-2.5 hairline min-w-[220px]">
            <Search className="h-4 w-4 text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, description, location..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-faint"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-ink-faint hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <FilterPill
            label="Type"
            value={type}
            options={[
              { value: 'lost', label: 'Lost' },
              { value: 'found', label: 'Found' },
            ]}
            onChange={setType}
          />
          <FilterPill
            label="Category"
            value={category}
            options={categories.map((c) => ({ value: c.id, label: c.label }))}
            onChange={setCategory}
          />
          <FilterPill
            label="Status"
            value={status}
            options={[
              { value: 'lost', label: 'Lost' },
              { value: 'found', label: 'Found' },
              { value: 'matched', label: 'Matched' },
              { value: 'claimed', label: 'Claimed' },
              { value: 'returned', label: 'Returned' },
            ]}
            onChange={setStatus}
          />
          <FilterPill
            label="Location"
            value={buildingId}
            options={buildings.map((b) => ({ value: b.id, label: b.short_label }))}
            onChange={setBuildingId}
          />
          {activeFilters > 0 && (
            <button onClick={clearAll} className="btn-ghost text-xs">
              <X className="h-3.5 w-3.5" />
              Clear ({activeFilters})
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="mt-20 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-canvas-muted text-ink-faint">
            <Frown className="h-8 w-8" />
          </div>
          <h3 className="mt-4 font-serif-display text-xl">No items match your search</h3>
          <p className="mt-1 text-sm text-ink-soft">Try clearing filters or searching differently.</p>
          <button onClick={clearAll} className="btn-outline mt-4">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="mt-6 columns-2 gap-4 md:columns-3 lg:columns-4 [column-fill:_balance]">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              building={buildingMap.get(item.building_id ?? '')}
              category={categoryMap.get(item.category)}
              isFavorite={favorites.has(item.id)}
              onFavorite={() => toggle(item.id)}
              onQuickView={() => setQuickView(item)}
            />
          ))}
        </div>
      )}

      <Modal open={!!quickView} onClose={() => setQuickView(null)} maxWidth="max-w-2xl">
        {quickView && (
          <QuickView
            item={quickView}
            building={buildingMap.get(quickView.building_id ?? '')}
            category={categoryMap.get(quickView.category)}
            isFavorite={favorites.has(quickView.id)}
            onFavorite={() => toggle(quickView.id)}
            onClose={() => setQuickView(null)}
          />
        )}
      </Modal>
    </div>
  );
}

function FilterPill({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | null;
  options: { value: string; label: string }[];
  onChange: (v: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`btn hairline gap-1.5 rounded-lg px-3.5 py-2.5 text-sm ${
          current ? 'bg-ink text-ink-inverse border-ink' : 'bg-canvas-subtle text-ink-soft hover:text-ink'
        }`}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        {current ? current.label : label}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-0 top-full z-50 mt-2 min-w-[180px] rounded-xl bg-canvas-subtle p-1.5 hairline shadow-lift"
          >
            <button
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-ink-faint hover:bg-canvas-muted"
            >
              Any {label.toLowerCase()}
            </button>
            {options.map((o) => (
              <button
                key={o.value}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-canvas-muted ${
                  value === o.value ? 'font-semibold text-ink' : 'text-ink-soft'
                }`}
              >
                {o.label}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}
