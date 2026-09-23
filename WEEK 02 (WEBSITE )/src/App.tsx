import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { ThemeProvider } from '@/lib/theme';
import { useRoute } from '@/lib/router';
import { useItems, useBuildings, useCategories } from '@/lib/hooks';
import { HomePage } from '@/pages/HomePage';
import { BrowsePage } from '@/pages/BrowsePage';
import { ReportPage } from '@/pages/ReportPage';
import { ItemDetailPage } from '@/pages/ItemDetailPage';
import { MapPage } from '@/pages/MapPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';

function Routed() {
  const route = useRoute();
  const { items, loading } = useItems();
  const buildings = useBuildings();
  const categories = useCategories();

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar route={route} />
      <AnimatePresence mode="wait">
        <motion.main
          key={route.name + ('id' in route ? route.id : '') + ('mode' in route ? route.mode : '')}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {route.name === 'home' && (
            <HomePage items={items} buildings={buildings} loading={loading} />
          )}
          {route.name === 'browse' && <BrowsePage items={items} buildings={buildings} route={route} />}
          {route.name === 'report' && (
            <ReportPage route={route} buildings={buildings} categories={categories} />
          )}
          {route.name === 'item' && <ItemDetailPage id={route.id} />}
          {route.name === 'map' && (
            <MapPage buildings={buildings} items={items} loading={loading} />
          )}
          {route.name === 'analytics' && (
            <AnalyticsPage items={items} buildings={buildings} categories={categories} />
          )}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Routed />
    </ThemeProvider>
  );
}
