import type { ItemStatus, ItemType } from './supabase';

export const STATUS_META: Record<
  ItemStatus,
  { label: string; tone: 'lost' | 'found' | 'matched' | 'claimed' | 'returned' | 'closed' }
> = {
  lost: { label: 'Lost', tone: 'lost' },
  found: { label: 'Found', tone: 'found' },
  matched: { label: 'Matched', tone: 'matched' },
  claimed: { label: 'Claimed', tone: 'claimed' },
  returned: { label: 'Returned', tone: 'returned' },
  closed: { label: 'Closed', tone: 'closed' },
};

export const TYPE_META: Record<ItemType, { label: string; tone: 'lost' | 'found' }> = {
  lost: { label: 'Lost', tone: 'lost' },
  found: { label: 'Found', tone: 'found' },
};

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${w}w ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatDate(iso: string | null): string {
  if (!iso) return 'Unknown date';
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(iso: string | null): string {
  if (!iso) return '';
  return new Date(`1970-01-01T${iso}`).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}
