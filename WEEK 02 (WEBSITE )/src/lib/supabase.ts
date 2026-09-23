import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anon, {
  auth: { persistSession: false },
});

export type ItemType = 'lost' | 'found';
export type ItemStatus = 'lost' | 'found' | 'matched' | 'claimed' | 'returned' | 'closed';
export type ClaimStatus = 'pending' | 'approved' | 'rejected';

export interface TimelineEvent {
  at: string;
  status: ItemStatus;
  note: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface Building {
  id: string;
  label: string;
  short_label: string;
  kind: string;
  polygon: string | null;
  cx: number | null;
  cy: number | null;
  hue: string;
}

export interface Item {
  id: string;
  type: ItemType;
  status: ItemStatus;
  title: string;
  category: string;
  description: string | null;
  image_url: string | null;
  building_id: string | null;
  location_detail: string | null;
  reward: number | null;
  reporter_name: string;
  reporter_contact: string | null;
  event_date: string | null;
  event_time: string | null;
  timeline: TimelineEvent[];
  created_at: string;
  updated_at: string;
}

export interface Claim {
  id: string;
  item_id: string;
  claimer_name: string;
  claimer_contact: string | null;
  claimer_note: string | null;
  status: ClaimStatus;
  created_at: string;
}

export interface Favorite {
  id: string;
  item_id: string;
  visitor_id: string;
  created_at: string;
}
