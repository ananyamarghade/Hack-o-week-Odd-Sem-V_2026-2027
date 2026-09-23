import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'browse'; query?: string; category?: string; type?: string }
  | { name: 'report'; mode: 'lost' | 'found' }
  | { name: 'item'; id: string }
  | { name: 'map' }
  | { name: 'analytics' };

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [path, search] = hash.split('?');
  const parts = path.split('/').filter(Boolean);
  const params = new URLSearchParams(search ?? '');
  const q = (k: string) => (params.has(k) ? params.get(k) ?? undefined : undefined);

  if (parts.length === 0) return { name: 'home' };
  switch (parts[0]) {
    case 'browse':
      return { name: 'browse', query: q('q'), category: q('category'), type: q('type') };
    case 'report':
      return { name: 'report', mode: parts[1] === 'found' ? 'found' : 'lost' };
    case 'item':
      return { name: 'item', id: parts[1] ?? '' };
    case 'map':
      return { name: 'map' };
    case 'analytics':
      return { name: 'analytics' };
    default:
      return { name: 'home' };
  }
}

export function routeToHash(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/';
    case 'browse': {
      const p = new URLSearchParams();
      if (route.query) p.set('q', route.query);
      if (route.category) p.set('category', route.category);
      if (route.type) p.set('type', route.type);
      const s = p.toString();
      return `#/browse${s ? `?${s}` : ''}`;
    }
    case 'report':
      return `#/report/${route.mode}`;
    case 'item':
      return `#/item/${route.id}`;
    case 'map':
      return '#/map';
    case 'analytics':
      return '#/analytics';
  }
}

export function navigate(route: Route) {
  window.location.hash = routeToHash(route);
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parseHash());
  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}
