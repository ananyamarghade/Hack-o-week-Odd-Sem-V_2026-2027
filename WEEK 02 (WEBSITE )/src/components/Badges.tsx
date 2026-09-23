import { motion } from 'framer-motion';
import type { ItemStatus, ItemType } from '@/lib/supabase';
import { STATUS_META, TYPE_META } from '@/lib/format';

const TONE: Record<string, string> = {
  lost: 'bg-[rgb(var(--accent))]/12 text-[rgb(var(--accent))]',
  found: 'bg-found-500/12 text-found-600 dark:text-found-400',
  matched: 'bg-brand-500/12 text-brand-600 dark:text-brand-400',
  claimed: 'bg-warn-500/15 text-warn-600 dark:text-warn-400',
  returned: 'bg-brand-500 text-white',
  closed: 'bg-canvas-muted text-ink-faint',
};

export function StatusBadge({ status }: { status: ItemStatus }) {
  const m = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${TONE[m.tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {m.label}
    </span>
  );
}

export function TypeBadge({ type }: { type: ItemType }) {
  const m = TYPE_META[type];
  return (
    <motion.span
      whileHover={{ scale: 1.03 }}
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${TONE[m.tone]}`}
    >
      {m.label}
    </motion.span>
  );
}
