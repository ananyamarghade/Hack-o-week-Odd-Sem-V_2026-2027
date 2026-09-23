import { motion } from 'framer-motion';
import { Download, TrendingUp, MapPin, Package, Clock, Percent } from 'lucide-react';
import { useMemo } from 'react';
import type { Item, Building, Category } from '@/lib/supabase';
import { navigate } from '@/lib/router';

/**
 * AnalyticsEngine — a TS mirror of the Python AnalyticsEngine class.
 * Computes recovery rate, average recovery time, daily/weekly/monthly
 * reports, category & location frequencies using vectorized-style
 * reductions over the item dataset.
 */
export class AnalyticsEngine {
  private items: Item[];
  constructor(items: Item[]) {
    this.items = items;
  }

  get total() { return this.items.length; }

  // Recovery percentage (returned / total) — vectorized count
  recoveryRate(): number {
    if (!this.items.length) return 0;
    const returned = this.items.filter((i) => i.status === 'returned').length;
    return Math.round((returned / this.items.length) * 100);
  }

  // Average recovery time in days (lost -> returned), vectorized over timeline
  averageRecoveryDays(): number | null {
    const returned = this.items.filter((i) => i.status === 'returned');
    if (!returned.length) return null;
    const days = returned.map((i) => {
      const lost = i.timeline.find((t) => t.status === 'lost') ?? i.timeline[0];
      const ret = i.timeline.find((t) => t.status === 'returned');
      if (!lost || !ret) return 0;
      return (new Date(ret.at).getTime() - new Date(lost.at).getTime()) / 86400000;
    });
    return Math.round((days.reduce((a, b) => a + b, 0) / days.length) * 10) / 10;
  }

  // Category frequency (GroupBy category)
  categoryCounts(): { label: string; count: number }[] {
    const m = new Map<string, number>();
    this.items.forEach((i) => m.set(i.category, (m.get(i.category) ?? 0) + 1));
    return [...m.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
  }

  // Location frequency (GroupBy building)
  locationCounts(buildings: Building[]): { label: string; count: number }[] {
    const m = new Map<string, number>();
    this.items.forEach((i) => {
      const key = i.building_id ?? 'unknown';
      m.set(key, (m.get(key) ?? 0) + 1);
    });
    return [...m.entries()].map(([id, count]) => ({
      label: buildings.find((b) => b.id === id)?.short_label ?? 'Unknown',
      count,
    })).sort((a, b) => b.count - a.count);
  }

  // Daily reports for last N days (vectorized bucketing)
  dailyReports(days = 14): { date: string; lost: number; found: number }[] {
    const out: { date: string; lost: number; found: number }[] = [];
    for (let d = days - 1; d >= 0; d--) {
      const day = new Date();
      day.setDate(day.getDate() - d);
      const key = day.toISOString().slice(0, 10);
      const dayItems = this.items.filter((i) => i.created_at.slice(0, 10) === key);
      out.push({
        date: key,
        lost: dayItems.filter((i) => i.type === 'lost').length,
        found: dayItems.filter((i) => i.type === 'found').length,
      });
    }
    return out;
  }

  // Status distribution (GroupBy status)
  statusCounts(): { label: string; count: number }[] {
    const m = new Map<string, number>();
    this.items.forEach((i) => m.set(i.status, (m.get(i.status) ?? 0) + 1));
    return [...m.entries()].map(([label, count]) => ({ label, count }));
  }
}

export function AnalyticsPage({
  items,
  buildings,
  categories,
}: {
  items: Item[] | null;
  buildings: Building[];
  categories: Category[];
}) {
  const engine = useMemo(() => new AnalyticsEngine(items ?? []), [items]);
  const categoryCounts = useMemo(() => engine.categoryCounts(), [engine]);
  const locationCounts = useMemo(() => engine.locationCounts(buildings), [engine, buildings]);
  const daily = useMemo(() => engine.dailyReports(14), [engine]);
  const statusCounts = useMemo(() => engine.statusCounts(), [engine]);
  const avgRecovery = useMemo(() => engine.averageRecoveryDays(), [engine]);
  const recoveryRate = useMemo(() => engine.recoveryRate(), [engine]);

  const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

  function exportReport() {
    const data = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalItems: engine.total,
        recoveryRate: `${recoveryRate}%`,
        averageRecoveryDays: avgRecovery,
      },
      categories: categoryCounts,
      locations: locationCounts,
      statusDistribution: statusCounts,
      dailyReports: daily,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `findit-analytics-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const stats = [
    { label: 'Total items', value: engine.total, icon: Package, tone: 'text-ink' },
    { label: 'Recovery rate', value: `${recoveryRate}%`, icon: Percent, tone: 'text-brand-500' },
    { label: 'Avg recovery time', value: avgRecovery != null ? `${avgRecovery}d` : '—', icon: Clock, tone: 'text-found-500' },
    { label: 'Active locations', value: locationCounts.filter((l) => l.count > 0).length, icon: MapPin, tone: 'text-lost-500' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-4xl">Analytics</h1>
          <p className="text-sm text-ink-soft">Insights from campus lost-and-found reports</p>
        </div>
        <button onClick={exportReport} className="btn-outline">
          <Download className="h-4 w-4" />
          Export report
        </button>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-canvas-subtle p-5 hairline"
          >
            <s.icon className={`h-5 w-5 ${s.tone}`} />
            <div className="mt-3 font-serif-display text-3xl">{s.value}</div>
            <div className="text-xs text-ink-faint">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Daily reports line chart */}
        <Panel title="Daily reports" subtitle="Last 14 days · lost vs found">
          <LineChart data={daily} />
          <div className="mt-3 flex items-center gap-4 text-xs text-ink-soft">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-lost-500" /> Lost
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-found-500" /> Found
            </span>
          </div>
        </Panel>

        {/* Category distribution bar chart */}
        <Panel title="Most lost categories" subtitle="GroupBy category">
          <BarChart data={categoryCounts.map((c) => ({ label: catLabel(c.label), value: c.count }))} />
        </Panel>

        {/* Location distribution */}
        <Panel title="Most common locations" subtitle="GroupBy building">
          <BarChart
            data={locationCounts.map((l) => ({ label: l.label, value: l.count }))}
            horizontal
          />
        </Panel>

        {/* Status pie */}
        <Panel title="Status distribution" subtitle="Where items stand now">
          <PieChart data={statusCounts.map((s) => ({ label: s.label, value: s.count }))} />
        </Panel>
      </div>

      {/* Recent activity */}
      <div className="mt-6">
        <Panel title="Recent activity" subtitle="Latest reports across campus">
          <div className="space-y-2">
            {(items ?? []).slice(0, 6).map((item) => (
              <button
                key={item.id}
                onClick={() => navigate({ name: 'item', id: item.id })}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-canvas-muted"
              >
                <div
                  className={`h-2 w-2 rounded-full ${
                    item.type === 'lost' ? 'bg-lost-500' : 'bg-found-500'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{item.title}</div>
                  <div className="text-xs text-ink-faint">
                    {item.type} · {item.status}
                  </div>
                </div>
                <TrendingUp className="h-4 w-4 text-ink-faint" />
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-canvas-subtle p-6 hairline">
      <h2 className="font-serif-display text-xl">{title}</h2>
      {subtitle && <p className="text-xs text-ink-faint">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function LineChart({ data }: { data: { date: string; lost: number; found: number }[] }) {
  const w = 520;
  const h = 200;
  const pad = 28;
  const max = Math.max(1, ...data.flatMap((d) => [d.lost, d.found]));
  const step = (w - pad * 2) / Math.max(1, data.length - 1);
  const y = (v: number) => h - pad - (v / max) * (h - pad * 2);

  const lostPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${pad + i * step} ${y(d.lost)}`).join(' ');
  const foundPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${pad + i * step} ${y(d.found)}`).join(' ');
  const lostArea = `${lostPath} L ${pad + (data.length - 1) * step} ${h - pad} L ${pad} ${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <defs>
        <linearGradient id="lostGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(249 115 22)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="rgb(249 115 22)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((t) => (
        <line
          key={t}
          x1={pad}
          x2={w - pad}
          y1={pad + t * (h - pad * 2)}
          y2={pad + t * (h - pad * 2)}
          stroke="rgb(var(--line))"
          strokeWidth="1"
        />
      ))}
      <path d={lostArea} fill="url(#lostGrad)" />
      <path d={lostPath} fill="none" stroke="rgb(249 115 22)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={foundPath} fill="none" stroke="rgb(59 130 246)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" />
      {data.map((d, i) => (
        <g key={d.date}>
          <circle cx={pad + i * step} cy={y(d.lost)} r="2.5" fill="rgb(249 115 22)" />
          <circle cx={pad + i * step} cy={y(d.found)} r="2.5" fill="rgb(59 130 246)" />
        </g>
      ))}
    </svg>
  );
}

function BarChart({ data, horizontal }: { data: { label: string; value: number }[]; horizontal?: boolean }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  if (horizontal) {
    return (
      <div className="space-y-2.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <div className="w-20 shrink-0 truncate text-xs text-ink-soft">{d.label}</div>
            <div className="relative h-6 flex-1 overflow-hidden rounded-lg bg-canvas-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(d.value / max) * 100}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-lg bg-brand-500/80"
              />
            </div>
            <div className="w-6 text-right text-xs font-medium text-ink-soft">{d.value}</div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2" style={{ height: 180 }}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full rounded-t-lg bg-brand-500/70"
              style={{ minHeight: d.value > 0 ? 4 : 0 }}
            />
          </div>
          <div className="truncate text-[10px] text-ink-faint">{d.label}</div>
          <div className="text-xs font-medium">{d.value}</div>
        </div>
      ))}
    </div>
  );
}

function PieChart({ data }: { data: { label: string; value: number }[] }) {
  const total = data.reduce((a, b) => a + b.value, 0) || 1;
  const colors = ['#10b981', '#f97316', '#3b82f6', '#eab308', '#ef4444', '#94a3b8'];
  let acc = 0;
  const r = 80;
  const cx = 100;
  const cy = 100;

  const slices = data.map((d, i) => {
    const frac = d.value / total;
    const start = acc;
    acc += frac;
    const end = acc;
    const a1 = start * Math.PI * 2 - Math.PI / 2;
    const a2 = end * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy + r * Math.sin(a2);
    const large = frac > 0.5 ? 1 : 0;
    return {
      ...d,
      color: colors[i % colors.length],
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`,
    };
  });

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 200 200" className="h-44 w-44">
        {slices.map((s) => (
          <motion.path
            key={s.label}
            d={s.path}
            fill={s.color}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
          />
        ))}
        <circle cx={cx} cy={cy} r={36} fill="rgb(var(--canvas-subtle))" />
        <text x={cx} y={cy - 4} textAnchor="middle" className="fill-ink font-serif-display" fontSize="22">
          {total}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="fill-ink-faint" fontSize="10">
          items
        </text>
      </svg>
      <div className="space-y-1.5">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded" style={{ background: s.color }} />
            <span className="capitalize text-ink-soft">{s.label}</span>
            <span className="ml-auto font-medium">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
