import { motion } from 'framer-motion';
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  PackageOpen,
  HandHeart,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Item, Building, Category } from '@/lib/supabase';
import { useCategories, useFavorites } from '@/lib/hooks';
import { navigate } from '@/lib/router';
import { ItemCard } from '@/components/ItemCard';
import { QuickView } from '@/components/QuickView';
import { Modal } from '@/components/Modal';
import { timeAgo } from '@/lib/format';

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

export function HomePage({
  items,
  buildings,
  loading,
}: {
  items: Item[] | null;
  buildings: Building[];
  loading: boolean;
}) {
  const [query, setQuery] = useState('');
  const [quickView, setQuickView] = useState<Item | null>(null);
  const cats = useCategories();
  const categories = cats.length ? cats : CAT_FALLBACK;
  const { favorites, toggle } = useFavorites();

  const buildingMap = useMemo(() => new Map(buildings.map((b) => [b.id, b])), [buildings]);
  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const recent = useMemo(() => (items ?? []).slice(0, 7), [items]);

  const stats = useMemo(() => {
    const all = items ?? [];
    const lost = all.filter((i) => i.type === 'lost').length;
    const found = all.filter((i) => i.type === 'found').length;
    const returned = all.filter((i) => i.status === 'returned').length;
    const rate = all.length ? Math.round((returned / all.length) * 100) : 0;
    return { total: all.length, lost, found, rate };
  }, [items]);

  const trending = useMemo(() => {
    const counts = new Map<string, number>();
    (items ?? []).forEach((i) => counts.set(i.category, (counts.get(i.category) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [items]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ name: 'browse', query: query.trim() || undefined });
  }

  return (
    <div>
      {/* Hero — asymmetric editorial layout */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 pt-14 pb-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pt-24">
          {/* Left: headline + search */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-6 flex items-center gap-2 text-xs font-medium text-ink-faint">
              <span className="flex h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="uppercase tracking-[0.14em]">Live across campus</span>
              <span className="text-ink-faint/60">·</span>
              <span>{stats.total} items tracked</span>
            </div>

            <h1 className="font-serif-display text-[3.4rem] leading-[0.98] tracking-tight text-balance sm:text-[4.5rem]">
              Lost something?
              <br />
              <span className="text-accent italic">Let's find it</span>{' '}
              <span className="text-ink-faint">together.</span>
            </h1>

            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft text-pretty">
              A campus-wide lost &amp; found built for students. Report what you lost or found,
              search across every building, and track items back to their owners.
            </p>

            <form onSubmit={onSearch} className="mt-8 max-w-lg">
              <div className="group flex items-center gap-2 rounded-xl bg-canvas-subtle p-1.5 hairline transition-all focus-within:border-accent/50 focus-within:shadow-soft">
                <Search className="ml-2.5 h-4.5 w-4.5 text-ink-faint" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 'wallet', 'library', 'AirPods'..."
                  className="flex-1 bg-transparent py-2 text-[15px] outline-none placeholder:text-ink-faint"
                />
                <button type="submit" className="btn-primary rounded-lg px-4 py-2 text-sm">
                  Search
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs text-ink-faint">or</span>
              <button
                onClick={() => navigate({ name: 'report', mode: 'lost' })}
                className="chip hover:border-accent hover:text-accent transition-colors"
              >
                <PackageOpen className="h-3.5 w-3.5" />
                Report lost
              </button>
              <button
                onClick={() => navigate({ name: 'report', mode: 'found' })}
                className="chip hover:border-accent hover:text-accent transition-colors"
              >
                <HandHeart className="h-3.5 w-3.5" />
                Report found
              </button>
            </div>
          </motion.div>

          {/* Right: featured item card — not a stat grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:pt-4"
          >
            {recent[0] ? (
              <FeaturedItem
                item={recent[0]}
                building={buildingMap.get(recent[0].building_id ?? '')}
                onOpen={() => setQuickView(recent[0])}
              />
            ) : (
              <div className="aspect-[4/5] skeleton rounded-2xl" />
            )}
            {/* secondary stat — single, not a grid of four */}
            <div className="mt-4 flex items-baseline gap-3 px-1">
              <span className="font-serif-display text-5xl text-accent">{stats.rate}%</span>
              <span className="text-sm text-ink-soft leading-tight">
                recovery rate
                <br />
                <span className="text-xs text-ink-faint">across {stats.total} reports</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider with section label */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex items-center gap-4 hairline-t pt-10">
          <span className="-mt-[22px] bg-canvas px-3 text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
            Recently found
          </span>
        </div>
      </div>

      {/* Masonry feed — full width, no card grid */}
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [column-fill:_balance]">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="masonry-col mb-4">
                  <div className="skeleton h-72 rounded-xl" />
                </div>
              ))
            : recent.slice(1).map((item) => (
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
        <div className="mt-8">
          <button onClick={() => navigate({ name: 'browse' })} className="btn-outline group">
            Browse all items
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      {/* Categories — inline list, not card grid */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex items-center gap-4 hairline-t pt-10">
          <span className="-mt-[22px] bg-canvas px-3 text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
            What students lose most
          </span>
        </div>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {trending.map(([catId, count], i) => {
            const cat = categoryMap.get(catId) ?? CAT_FALLBACK.find((c) => c.id === catId);
            return (
              <motion.button
                key={catId}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate({ name: 'browse', category: catId })}
                className="group inline-flex items-center gap-2.5 rounded-full bg-canvas-subtle py-2 pl-4 pr-3 hairline transition-all hover:border-accent/40 hover:shadow-soft"
              >
                <span className="text-sm font-medium">{cat?.label ?? 'Other'}</span>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-canvas-muted px-1.5 text-[11px] font-semibold text-ink-soft">
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Campus map — editorial split, not a CTA banner */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-8 rounded-2xl bg-canvas-subtle p-8 hairline lg:grid-cols-[1fr_1.3fr] lg:gap-12 lg:p-12">
          <div className="flex flex-col justify-center">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
              Interactive map
            </span>
            <h2 className="mt-3 font-serif-display text-4xl leading-[1.05] text-balance">
              See exactly where items are reported.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft text-pretty">
              Tap any building — library, hostel, labs, parking, canteen, security —
              to view everything lost or found there. No more wandering.
            </p>
            <button
              onClick={() => navigate({ name: 'map' })}
              className="btn-primary mt-6 w-fit group"
            >
              Open campus map
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
          {/* Mini map preview */}
          <button
            onClick={() => navigate({ name: 'map' })}
            className="relative overflow-hidden rounded-xl bg-canvas-muted hairline p-6 text-left"
          >
            <svg viewBox="0 0 400 260" className="w-full h-auto opacity-90">
              <g stroke="rgb(var(--line-strong))" strokeWidth="2" strokeDasharray="6 6" fill="none" opacity="0.5">
                <path d="M 90 110 Q 170 95 250 80" />
                <path d="M 90 110 Q 95 175 100 210" />
                <path d="M 250 80 Q 280 150 290 200" />
              </g>
              {[
                { x: 50, y: 70, w: 90, h: 70, l: 'Library' },
                { x: 200, y: 45, w: 100, h: 70, l: 'Hostel' },
                { x: 140, y: 170, w: 90, h: 60, l: 'Canteen' },
                { x: 260, y: 160, w: 100, h: 70, l: 'Security' },
              ].map((b) => (
                <g key={b.l}>
                  <rect
                    x={b.x} y={b.y} width={b.w} height={b.h}
                    rx="8"
                    fill="rgb(var(--canvas))"
                    stroke="rgb(var(--accent))" strokeOpacity="0.4" strokeWidth="1.5"
                  />
                  <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 4} textAnchor="middle" fontSize="11" className="fill-ink-soft" fontWeight="500">
                    {b.l}
                  </text>
                </g>
              ))}
            </svg>
            <span className="absolute bottom-4 right-4 chip">
              <MapPin className="h-3 w-3" />
              6 buildings
            </span>
          </button>
        </div>
      </section>

      {/* Three steps — inline, not equal cards */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex items-center gap-4 hairline-t pt-10">
          <span className="-mt-[22px] bg-canvas px-3 text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
            How it works
          </span>
        </div>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {[
            {
              n: '01',
              icon: PackageOpen,
              title: 'Report in seconds',
              desc: 'Snap a photo, pick a building, set a reward. Your report is live instantly.',
            },
            {
              n: '02',
              icon: Search,
              title: 'Search smart',
              desc: 'Filter by name, category, location, date, or status. Find matches fast.',
            },
            {
              n: '03',
              icon: ShieldCheck,
              title: 'Claim & return',
              desc: 'Send a claim request, verify ownership, and get your item back safely.',
            },
          ].map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative"
            >
              <span className="font-serif-display text-3xl text-accent/40">{s.n}</span>
              <div className="mt-2 flex items-center gap-2">
                <s.icon className="h-4 w-4 text-ink-soft" strokeWidth={1.8} />
                <h3 className="font-serif-display text-xl">{s.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft text-pretty">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-3 hairline-t pt-8 text-sm text-ink-faint sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            FindIt@SIT · Helping students reconnect with their lost belongings
          </div>
          <div>Built for HackoWeek</div>
        </div>
      </footer>

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

function FeaturedItem({
  item,
  building,
  onOpen,
}: {
  item: Item;
  building?: Building;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="group relative block w-full overflow-hidden rounded-2xl bg-canvas-subtle hairline text-left transition-all hover:shadow-lift"
    >
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.title}
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="aspect-[4/5] w-full bg-canvas-muted" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute left-4 top-4">
        <span className="chip bg-white/90 text-ink border-transparent">
          <Sparkles className="h-3 w-3 text-accent" />
          Latest report
        </span>
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center gap-2 text-xs text-white/80">
          <MapPin className="h-3 w-3" />
          {building?.short_label ?? 'Unknown'}
          <span>·</span>
          <Clock className="h-3 w-3" />
          {timeAgo(item.created_at)}
        </div>
        <h3 className="mt-1.5 font-serif-display text-2xl text-white text-balance">
          {item.title}
        </h3>
      </div>
      <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity group-hover:opacity-100">
        <ArrowUpRight className="h-4 w-4" />
      </div>
    </button>
  );
}
