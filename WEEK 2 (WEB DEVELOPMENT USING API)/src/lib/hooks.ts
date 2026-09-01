import { useEffect, useState } from 'react';
import { supabase, type Item, type Category, type Building, type Claim } from './supabase';

export function useItems() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return { items, loading, reload: load };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    supabase.from('categories').select('*').order('label').then(({ data }) => {
      setCategories(data ?? []);
    });
  }, []);
  return categories;
}

export function useBuildings() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  useEffect(() => {
    supabase.from('buildings').select('*').order('label').then(({ data }) => {
      setBuildings(data ?? []);
    });
  }, []);
  return buildings;
}

export function useItem(id: string | null) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setItem(null);
      return;
    }
    setLoading(true);
    supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error(error);
        setItem(data);
        setLoading(false);
      });
  }, [id]);

  return { item, loading };
}

export function useClaims(itemId: string | null) {
  const [claims, setClaims] = useState<Claim[]>([]);
  useEffect(() => {
    if (!itemId) return;
    supabase
      .from('claims')
      .select('*')
      .eq('item_id', itemId)
      .order('created_at', { ascending: false })
      .then(({ data }) => setClaims(data ?? []));
  }, [itemId]);
  return claims;
}

const VISITOR_KEY = 'findit_visitor_id';

export function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const visitorId = getVisitorId();

  async function load() {
    const { data } = await supabase
      .from('favorites')
      .select('item_id')
      .eq('visitor_id', visitorId);
    setFavorites(new Set((data ?? []).map((f) => f.item_id)));
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(itemId: string) {
    const next = new Set(favorites);
    if (next.has(itemId)) {
      next.delete(itemId);
      await supabase.from('favorites').delete().eq('item_id', itemId).eq('visitor_id', visitorId);
    } else {
      next.add(itemId);
      await supabase.from('favorites').insert({ item_id: itemId, visitor_id: visitorId });
    }
    setFavorites(next);
  }

  return { favorites, toggle };
}
