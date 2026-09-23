import { motion } from 'framer-motion';
import { PackageOpen, HandHeart, ImagePlus, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { supabase, type Building, type Category, type TimelineEvent } from '@/lib/supabase';
import { navigate, type Route } from '@/lib/router';

const CAT_FALLBACK: Category[] = [
  { id: 'electronics', label: 'Electronics', icon: 'Laptop' },
  { id: 'cards', label: 'ID & Cards', icon: 'CreditCard' },
  { id: 'accessories', label: 'Accessories', icon: 'Glasses' },
  { id: 'keys', label: 'Keys', icon: 'Key' },
  { id: 'bags', label: 'Bags', icon: 'Briefcase' },
  { id: 'books', label: 'Books & Notes', icon: 'BookOpen' },
  { id: 'apparel', label: 'Apparel', icon: 'Shirt' },
  { id: 'containers', label: 'Containers', icon: 'CupSoda' },
  { id: 'other', label: 'Other', icon: 'Package' },
];

export function ReportPage({ route, buildings, categories: cats }: { route: Extract<Route, { name: 'report' }>; buildings: Building[]; categories: Category[] }) {
  const mode = route.mode;
  const categories = cats.length ? cats : CAT_FALLBACK;
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'other',
    description: '',
    image_url: '',
    building_id: '',
    location_detail: '',
    reward: '',
    reporter_name: '',
    reporter_contact: '',
    event_date: '',
    event_time: '',
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.building_id || !form.reporter_name) return;
    setSubmitting(true);

    const nowIso = new Date().toISOString();
    const initialEvent: TimelineEvent = {
      at: nowIso,
      status: mode === 'lost' ? 'lost' : 'found',
      note: mode === 'lost' ? 'Reported as lost' : 'Reported as found',
    };

    const payload = {
      type: mode,
      status: mode === 'lost' ? 'lost' : 'found',
      title: form.title,
      category: form.category,
      description: form.description || null,
      image_url: form.image_url || null,
      building_id: form.building_id,
      location_detail: form.location_detail || null,
      reward: form.reward ? parseFloat(form.reward) : null,
      reporter_name: form.reporter_name,
      reporter_contact: form.reporter_contact || null,
      event_date: form.event_date || null,
      event_time: form.event_time || null,
      timeline: [initialEvent],
    };

    const { data, error } = await supabase.from('items').insert(payload).select().maybeSingle();
    setSubmitting(false);
    if (error || !data) {
      alert('Could not submit report. Please try again.');
      return;
    }
    setDone(true);
    setTimeout(() => navigate({ name: 'item', id: data.id }), 900);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            mode === 'lost'
              ? 'bg-lost-100 text-lost-600 dark:bg-lost-500/15 dark:text-lost-400'
              : 'bg-found-100 text-found-600 dark:bg-found-500/15 dark:text-found-400'
          }`}
        >
          {mode === 'lost' ? <PackageOpen className="h-6 w-6" /> : <HandHeart className="h-6 w-6" />}
        </div>
        <div>
          <h1 className="font-serif-display text-4xl">
            Report {mode === 'lost' ? 'a lost item' : 'a found item'}
          </h1>
          <p className="text-sm text-ink-soft">
            {mode === 'lost'
              ? 'Tell us what you lost — the more detail, the better the match.'
              : 'Found something? List it so the owner can find you.'}
          </p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="mt-6 inline-flex rounded-full bg-canvas-muted p-1 hairline">
        <button
          onClick={() => navigate({ name: 'report', mode: 'lost' })}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
            mode === 'lost' ? 'bg-canvas text-ink shadow-soft' : 'text-ink-soft'
          }`}
        >
          Lost
        </button>
        <button
          onClick={() => navigate({ name: 'report', mode: 'found' })}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
            mode === 'found' ? 'bg-canvas text-ink shadow-soft' : 'text-ink-soft'
          }`}
        >
          Found
        </button>
      </div>

      {done ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 flex flex-col items-center rounded-3xl bg-canvas-subtle p-12 text-center hairline"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-white">
            <Check className="h-8 w-8" />
          </div>
          <h2 className="mt-4 font-serif-display text-xl">Report submitted</h2>
          <p className="mt-1 text-sm text-ink-soft">Taking you to your item page...</p>
          <Loader2 className="mt-4 h-5 w-5 animate-spin text-ink-faint" />
        </motion.div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-6">
          {/* Image */}
          <div>
            <label className="label">Image URL</label>
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-canvas-muted hairline">
                {form.image_url ? (
                  <img src={form.image_url} alt="preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink-faint">
                    <ImagePlus className="h-6 w-6" />
                  </div>
                )}
              </div>
              <input
                value={form.image_url}
                onChange={(e) => set('image_url', e.target.value)}
                placeholder="https://images.pexels.com/..."
                className="input"
              />
            </div>
            <p className="mt-1.5 text-xs text-ink-faint">
              Paste a photo URL. Tip: use a clear, well-lit image of the item.
            </p>
          </div>

          {/* Title + category */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Item name *</label>
              <input
                required
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Blue student ID card"
                className="input"
              />
            </div>
            <div>
              <label className="label">Category</label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="input"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Distinguishing features, color, brand, contents..."
              rows={3}
              className="input resize-none"
            />
          </div>

          {/* Location */}
          <div className="grid gap-4 sm:grid-cols-2">
          <div>
              <label className="label">Building *</label>
              <select
                required
                value={form.building_id}
                onChange={(e) => set('building_id', e.target.value)}
                className="input"
              >
                <option value="">Select a building</option>
                <option value="library">Library</option>
                <option value="mess">Mess</option>
                <option value="sit-first-floor">SIT First Floor</option>
                <option value="sit-ground-floor">SIT Ground Floor</option>
                <option value="sit-second-floor">SIT Second Floor</option>
                <option value="sit-basement">SIT Basement</option>
                <option value="parking">Parking</option>
                <option value="dsrw">DSRW</option>
              </select>
              <label className="label">Location detail</label>
              <input
                value={form.location_detail}
                onChange={(e) => set('location_detail', e.target.value)}
                placeholder="e.g. Near the south entrance"
                className="input"
              />
            </div>
          </div>

          {/* Date + time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">
                {mode === 'lost' ? 'Date lost' : 'Date found'}
              </label>
              <input
                type="date"
                value={form.event_date}
                onChange={(e) => set('event_date', e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">
                {mode === 'lost' ? 'Time lost' : 'Time found'}
              </label>
              <input
                type="time"
                value={form.event_time}
                onChange={(e) => set('event_time', e.target.value)}
                className="input"
              />
            </div>
          </div>

          {/* Reporter */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">
                {mode === 'lost' ? 'Your name *' : 'Current holder name *'}
              </label>
              <input
                required
                value={form.reporter_name}
                onChange={(e) => set('reporter_name', e.target.value)}
                placeholder="Your name"
                className="input"
              />
            </div>
            <div>
              <label className="label">Contact (email or phone)</label>
              <input
                value={form.reporter_contact}
                onChange={(e) => set('reporter_contact', e.target.value)}
                placeholder="How should the owner reach you?"
                className="input"
              />
            </div>
          </div>

          {/* Reward (lost only) */}
          {mode === 'lost' && (
            <div>
              <label className="label">Reward (optional)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint">₹</span>
                <input
                  type="number"
                  min="0"
                  value={form.reward}
                  onChange={(e) => set('reward', e.target.value)}
                  placeholder="0"
                  className="input pl-8"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-line pt-6">
            <button type="button" onClick={() => navigate({ name: 'home' })} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  {mode === 'lost' ? 'Report lost item' : 'Report found item'}
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
