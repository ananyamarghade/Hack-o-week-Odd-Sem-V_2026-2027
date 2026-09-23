import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  Heart,
  Share2,
  QrCode,
  HandHeart,
  Check,
  Loader2,
  Phone,
  Mail,
  Package,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { supabase, type Item, type Building, type Category, type TimelineEvent, type ItemStatus } from '@/lib/supabase';
import { useItem, useClaims, useFavorites, useItems, useCategories, useBuildings } from '@/lib/hooks';
import { navigate } from '@/lib/router';
import { StatusBadge, TypeBadge } from '@/components/Badges';
import { formatDate, formatTime, timeAgo } from '@/lib/format';
import { ItemCard } from '@/components/ItemCard';
import { Modal } from '@/components/Modal';

const STATUS_ORDER: ItemStatus[] = ['lost', 'found', 'matched', 'claimed', 'returned', 'closed'];
const STATUS_LABEL: Record<string, string> = {
  lost: 'Reported lost',
  found: 'Reported found',
  matched: 'Match found',
  claimed: 'Claim requested',
  returned: 'Returned',
  closed: 'Closed',
};

export function ItemDetailPage({ id }: { id: string }) {
  const { item, loading } = useItem(id);
  const claims = useClaims(id);
  const { favorites, toggle } = useFavorites();
  const { items: allItems } = useItems();
  const categories = useCategories();
  const buildings = useBuildings();
  const [claimOpen, setClaimOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const building = buildings.find((b) => b.id === item?.building_id);
  const category = categories.find((c) => c.id === item?.category);
  const isFav = item ? favorites.has(item.id) : false;

  const related = useMemo(() => {
    if (!item || !allItems) return [];
    return allItems
      .filter((i) => i.id !== item.id && (i.category === item.category || i.building_id === item.building_id))
      .slice(0, 4);
  }, [item, allItems]);

  const buildingMap = useMemo(() => new Map(buildings.map((b) => [b.id, b])), [buildings]);
  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="skeleton h-8 w-24 rounded-full" />
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          <div className="skeleton h-96 rounded-3xl" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-2/3 rounded" />
            <div className="skeleton h-24 rounded-xl" />
            <div className="skeleton h-40 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <Package className="mx-auto h-12 w-12 text-ink-faint" />
        <h1 className="mt-4 font-serif-display text-2xl">Item not found</h1>
        <p className="mt-2 text-sm text-ink-soft">This report may have been removed.</p>
        <button onClick={() => navigate({ name: 'browse' })} className="btn-primary mt-6">
          Browse items
        </button>
      </div>
    );
  }

  const claimUrl = `${window.location.origin}${window.location.pathname}#/item/${item.id}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(claimUrl)}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <button onClick={() => navigate({ name: 'browse' })} className="btn-ghost -ml-2 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to browse
      </button>

      <div className="grid gap-8 sm:grid-cols-2">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-canvas-subtle hairline"
        >
          {item.image_url ? (
            <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full min-h-[300px] items-center justify-center text-ink-faint">
              <Package className="h-12 w-12" />
            </div>
          )}
          <div className="absolute left-4 top-4 flex gap-2">
            <TypeBadge type={item.type} />
            <StatusBadge status={item.status} />
          </div>
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <h1 className="font-serif-display text-4xl text-balance">{item.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-ink-soft">
            <span>{category?.label ?? 'Other'}</span>
            <span className="text-ink-faint">·</span>
            <span>Reported {timeAgo(item.created_at)}</span>
          </div>

          {item.description && (
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{item.description}</p>
          )}

          {item.reward ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-lost-50 px-3 py-2 text-sm font-semibold text-lost-700 dark:bg-lost-500/10 dark:text-lost-300">
              <Heart className="h-4 w-4 fill-lost-500 text-lost-500" />
              Reward: ₹{item.reward}
            </div>
          ) : null}

          {/* Meta grid */}
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl hairline bg-line">
            <Meta icon={MapPin} label="Location" value={building?.short_label ?? 'Unknown'} />
            <Meta icon={Calendar} label="Date" value={formatDate(item.event_date)} />
            <Meta icon={Clock} label="Time" value={item.event_time ? formatTime(item.event_time) : '—'} />
            <Meta icon={User} label="Reporter" value={item.reporter_name} />
          </div>

          {item.location_detail && (
            <p className="mt-3 text-sm text-ink-soft">
              <MapPin className="mr-1 inline h-3.5 w-3.5 text-ink-faint" />
              {item.location_detail}
            </p>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-2">
            {item.type === 'found' && item.status !== 'returned' && (
              <button onClick={() => setClaimOpen(true)} className="btn-primary">
                <HandHeart className="h-4 w-4" />
                Claim this item
              </button>
            )}
            <button onClick={() => toggle(item.id)} className="btn-outline">
              <Heart className={`h-4 w-4 ${isFav ? 'fill-danger-500 text-danger-500' : ''}`} />
              {isFav ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(claimUrl);
              }}
              className="btn-outline"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button onClick={() => setQrOpen(true)} className="btn-outline">
              <QrCode className="h-4 w-4" />
              QR
            </button>
          </div>

          {item.reporter_contact && (
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-ink-soft">
              {item.reporter_contact.includes('@') ? (
                <a href={`mailto:${item.reporter_contact}`} className="inline-flex items-center gap-1.5 hover:text-ink">
                  <Mail className="h-4 w-4" /> {item.reporter_contact}
                </a>
              ) : (
                <a href={`tel:${item.reporter_contact}`} className="inline-flex items-center gap-1.5 hover:text-ink">
                  <Phone className="h-4 w-4" /> {item.reporter_contact}
                </a>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="mt-12">
        <h2 className="font-serif-display text-2xl">Item timeline</h2>
        <p className="text-sm text-ink-soft">The journey of this item from report to return</p>
        <Timeline events={item.timeline} currentStatus={item.status} />
      </div>

      {/* Claims */}
      {claims.length > 0 && (
        <div className="mt-10">
          <h2 className="font-serif-display text-2xl">Claim requests</h2>
          <div className="mt-4 space-y-3">
            {claims.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-2xl bg-canvas-subtle p-4 hairline">
                <div>
                  <div className="font-medium">{c.claimer_name}</div>
                  {c.claimer_note && <div className="text-sm text-ink-soft">{c.claimer_note}</div>}
                  <div className="text-xs text-ink-faint">{timeAgo(c.created_at)}</div>
                </div>
                <span
                  className={`chip ${
                    c.status === 'approved'
                      ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                      : c.status === 'rejected'
                      ? 'bg-danger-100 text-danger-600 dark:bg-danger-500/15 dark:text-danger-400'
                      : ''
                  }`}
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="font-serif-display text-2xl">Related items</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((r) => (
              <ItemCard
                key={r.id}
                item={r}
                building={buildingMap.get(r.building_id ?? '')}
                category={categoryMap.get(r.category)}
                isFavorite={favorites.has(r.id)}
                onFavorite={() => toggle(r.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Claim modal */}
      <ClaimModal open={claimOpen} onClose={() => setClaimOpen(false)} itemId={item.id} />

      {/* QR modal */}
      <Modal open={qrOpen} onClose={() => setQrOpen(false)} title="Scan to view this item" maxWidth="max-w-sm">
        <div className="flex flex-col items-center">
          <img src={qrSrc} alt="QR code" className="h-48 w-48 rounded-xl" />
          <p className="mt-4 text-center text-sm text-ink-soft">
            Scan with any phone camera to open this item's page.
          </p>
        </div>
      </Modal>
    </div>
  );
}

function Meta({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="bg-canvas-subtle px-4 py-3.5">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-ink-faint">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-ink">{value}</div>
    </div>
  );
}

function Timeline({ events, currentStatus }: { events: TimelineEvent[]; currentStatus: ItemStatus }) {
  const sorted = [...events].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="mt-5 relative">
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-line" />
      <div className="space-y-5">
        {sorted.map((e, i) => {
          const statusIdx = STATUS_ORDER.indexOf(e.status);
          const isPast = statusIdx <= currentIdx;
          const isCurrent = e.status === currentStatus && i === sorted.length - 1;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative flex gap-4"
            >
              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  isCurrent
                    ? 'bg-brand-500 text-white shadow-glow'
                    : isPast
                    ? 'bg-canvas-subtle hairline text-ink-soft'
                    : 'bg-canvas-muted text-ink-faint'
                }`}
              >
                {isCurrent ? <Check className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-current" />}
              </div>
              <div className="pt-1">
                <div className="font-medium text-ink">{STATUS_LABEL[e.status] ?? e.status}</div>
                <div className="text-sm text-ink-soft">{e.note}</div>
                <div className="mt-0.5 text-xs text-ink-faint">
                  {new Date(e.at).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ClaimModal({ open, onClose, itemId }: { open: boolean; onClose: () => void; itemId: string }) {
  const [form, setForm] = useState({ name: '', contact: '', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return;
    setSubmitting(true);
    const { error } = await supabase.from('claims').insert({
      item_id: itemId,
      claimer_name: form.name,
      claimer_contact: form.contact || null,
      claimer_note: form.note || null,
      status: 'pending',
    });
    setSubmitting(false);
    if (error) {
      alert('Could not submit claim.');
      return;
    }
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setForm({ name: '', contact: '', note: '' });
      onClose();
    }, 1200);
  }

  return (
    <Modal open={open} onClose={onClose} title="Claim this item">
      {done ? (
        <div className="flex flex-col items-center py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white">
            <Check className="h-7 w-7" />
          </div>
          <h3 className="mt-3 font-serif-display text-lg">Claim submitted</h3>
          <p className="mt-1 text-sm text-ink-soft">The reporter will review your request.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <p className="text-sm text-ink-soft">
            Provide your details so the reporter can verify ownership and reach out.
          </p>
          <div>
            <label className="label">Your name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="input"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="label">Contact</label>
            <input
              value={form.contact}
              onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
              className="input"
              placeholder="Email or phone"
            />
          </div>
          <div>
            <label className="label">Proof / note</label>
            <textarea
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              rows={3}
              className="input resize-none"
              placeholder="Describe a distinguishing feature only the owner would know."
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <HandHeart className="h-4 w-4" />}
              Submit claim
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
