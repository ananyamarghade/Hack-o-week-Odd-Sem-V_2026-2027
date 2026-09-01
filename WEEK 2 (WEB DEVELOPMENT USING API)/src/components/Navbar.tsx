import { motion } from 'framer-motion';
import { Home, LayoutGrid, Map, Moon, Plus, Search, Sun, BarChart3 } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { navigate, type Route } from '@/lib/router';
import { useState } from 'react';

const NAV: { label: string; route: Route; icon: typeof Home }[] = [
  { label: 'Home', route: { name: 'home' }, icon: Home },
  { label: 'Browse', route: { name: 'browse' }, icon: LayoutGrid },
  { label: 'Campus Map', route: { name: 'map' }, icon: Map },
  { label: 'Analytics', route: { name: 'analytics' }, icon: BarChart3 },
];

export function Navbar({ route }: { route: Route }) {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const isActive = (r: Route) =>
    (r.name === 'home' && route.name === 'home') ||
    (r.name === 'browse' && route.name === 'browse') ||
    (r.name === 'map' && route.name === 'map') ||
    (r.name === 'analytics' && route.name === 'analytics');

  return (
    <header className="sticky top-0 z-40 hairline-b glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <button
          onClick={() => navigate({ name: 'home' })}
          className="flex items-center gap-2.5 focus-ring rounded-lg"
        >
          <img src="/logo.png" alt="FindIt@SIT" className="h-8 w-8 rounded-md object-cover" />
          <span className="font-serif-display text-[19px] leading-none">
            FindIt<span className="text-accent">@SIT</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active = isActive(n.route);
            return (
              <button
                key={n.label}
                onClick={() => navigate(n.route)}
                className={`relative px-3.5 py-2 text-[13px] font-medium transition-colors ${
                  active ? 'text-ink' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {n.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-px left-3 right-3 h-px bg-[rgb(var(--accent))]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate({ name: 'browse' })}
            className="btn-ghost rounded-lg p-2"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            onClick={toggle}
            className="btn-ghost rounded-lg p-2"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button
            onClick={() => navigate({ name: 'report', mode: 'lost' })}
            className="btn-accent hidden sm:inline-flex"
          >
            <Plus className="h-4 w-4" strokeWidth={2.2} />
            Report
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="btn-ghost rounded-lg p-2 md:hidden"
            aria-label="Menu"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {open && (
        <motion.nav
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="hairline-t md:hidden"
        >
          <div className="flex flex-col gap-1 p-3">
            {NAV.map((n) => (
              <button
                key={n.label}
                onClick={() => {
                  navigate(n.route);
                  setOpen(false);
                }}
                className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-canvas-muted"
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </button>
            ))}
            <button
              onClick={() => {
                navigate({ name: 'report', mode: 'lost' });
                setOpen(false);
              }}
              className="btn-accent mt-2"
            >
              <Plus className="h-4 w-4" />
              Report an item
            </button>
          </div>
        </motion.nav>
      )}
    </header>
  );
}
