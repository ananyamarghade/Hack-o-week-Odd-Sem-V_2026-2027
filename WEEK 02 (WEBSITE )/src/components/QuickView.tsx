import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, User, ArrowUpRight, Heart } from 'lucide-react';
import type { Item, Building, Category } from '@/lib/supabase';
import { StatusBadge, TypeBadge } from './Badges';
import { formatDate, formatTime } from '@/lib/format';
import { navigate } from '@/lib/router';

export function QuickView({
  item,
  building,
  category,
  isFavorite,
  onFavorite,
  onClose,
}: {
  item: Item;
  building?: Building;
  category?: Category;
  isFavorite?: boolean;
  onFavorite?: () => void;
  onClose: () => void;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="relative overflow-hidden rounded-xl">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full min-h-[200px] items-center justify-center bg-canvas-muted text-ink-faint">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="mb-3 flex items-center gap-2">
          <TypeBadge type={item.type} />
          <StatusBadge status={item.status} />
        </div>
        <h3 className="font-serif-display text-2xl text-balance">{item.title}</h3>
        <p className="mt-1.5 text-sm text-ink-soft line-clamp-3">{item.description ?? 'No description'}</p>
        <div className="mt-4 space-y-2 text-sm text-ink-soft">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-ink-faint" />
            {building?.label ?? 'Unknown location'}
            {item.location_detail ? ` · ${item.location_detail}` : ''}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-ink-faint" />
            {formatDate(item.event_date)}
            {item.event_time && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {formatTime(item.event_time)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-ink-faint" />
            {item.reporter_name}
          </div>
        </div>
        {item.reward ? (
          <div className="mt-4 rounded-lg bg-accent-soft px-3 py-2 text-sm font-medium text-accent">
            Reward offered: ₹{item.reward}
          </div>
        ) : null}
        <div className="mt-5 flex gap-2">
          <button
            onClick={() => {
              navigate({ name: 'item', id: item.id });
              onClose();
            }}
            className="btn-primary flex-1"
          >
            View details
            <ArrowUpRight className="h-4 w-4" />
          </button>
          {onFavorite && (
            <button onClick={onFavorite} className="btn-outline">
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-[rgb(var(--accent))] text-[rgb(var(--accent))]' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function QuickViewMotion({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {children}
    </motion.div>
  );
}
