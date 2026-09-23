import { motion } from 'framer-motion';
import { MapPin, Heart, Clock } from 'lucide-react';
import type { Item, Building, Category } from '@/lib/supabase';
import { StatusBadge, TypeBadge } from './Badges';
import { timeAgo } from '@/lib/format';
import { navigate } from '@/lib/router';

export function ItemCard({
  item,
  building,
  category,
  isFavorite,
  onFavorite,
  onQuickView,
}: {
  item: Item;
  building?: Building;
  category?: Category;
  isFavorite?: boolean;
  onFavorite?: () => void;
  onQuickView?: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group masonry-col mb-4 cursor-pointer"
      onClick={() => navigate({ name: 'item', id: item.id })}
    >
      <div className="overflow-hidden rounded-xl bg-canvas-subtle hairline transition-all duration-300 group-hover:shadow-lift">
        <div className="relative overflow-hidden">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title}
              loading="lazy"
              className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              style={{ aspectRatio: '4 / 5' }}
            />
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center bg-canvas-muted text-ink-faint">
              No image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex gap-1.5">
            <TypeBadge type={item.type} />
            <StatusBadge status={item.status} />
          </div>
          {onFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
              className="absolute right-3 top-3 rounded-full p-2 glass hairline transition-colors hover:bg-white/20"
              aria-label="Favorite"
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? 'fill-[rgb(var(--accent))] text-[rgb(var(--accent))]' : 'text-white'}`}
              />
            </button>
          )}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-serif-display text-lg text-white text-balance">
                {item.title}
              </h3>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-white/80">
                <MapPin className="h-3 w-3" />
                {building?.short_label ?? 'Unknown location'}
              </p>
            </div>
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView();
                }}
                className="shrink-0 rounded-md bg-white/90 px-2.5 py-1.5 text-xs font-medium text-ink opacity-0 transition-opacity group-hover:opacity-100"
              >
                Quick view
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between px-3.5 py-2.5">
          <span className="truncate text-xs text-ink-soft">
            {category?.label ?? 'Other'}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-ink-faint">
            <Clock className="h-3 w-3" />
            {timeAgo(item.created_at)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
