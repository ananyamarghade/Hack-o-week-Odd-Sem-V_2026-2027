/*
# FindIt@Campus — Core Schema

## Overview
Creates the data model for a campus lost-and-found platform. Students report
lost or found items, browse a masonry feed, claim items, and view analytics.
The app has no sign-in screen, so all tables are single-tenant and public
(anon + authenticated can CRUD their own shared data).

## New Tables

### categories
- Lookup table for item categories (Electronics, Cards, Accessories, etc.)
- Seeded with the common lost-item types.

### buildings
- Campus map buildings (Library, Hostel, Labs, Parking, Canteen, Security Office).
- Stores SVG polygon coordinates so the interactive map can render shapes.

### items
- The core table. One row per lost OR found report (unified).
- `type` is 'lost' or 'found'.
- `status` tracks the lifecycle: lost|found|matched|claimed|returned|closed.
- `timeline` is a jsonb array of {at, status, note} events for the vertical timeline.
- `image_url` is a remote URL (Pexels stock photos used for demo data).
- `reward` optional numeric reward for lost items.
- `reporter_name`, `reporter_contact` for the current holder / owner.
- `event_date` / `event_time` when the loss/find actually happened.
- `building_id` links to buildings for the campus map.

### claims
- Claim requests on items. A found item can be claimed by someone who lost it.
- `status`: pending|approved|rejected.
- `claimer_name`, `claimer_contact`, `claimer_note`.

### favorites
- Lightweight favorite/bookmark of items. Uses a client-side generated
  visitor id stored in localStorage so the same browser persists favorites
  without auth.

## Security
- RLS enabled on every table.
- All policies use `TO anon, authenticated` because this is a no-auth,
  intentionally public app (documented).
- CRUD is open (USING (true) / WITH CHECK (true)) — data is shared by design.

## Notes
1. `items.timeline` defaults to an empty array and is appended to on status
   changes from the frontend.
2. Indexes added for common query paths (type, status, category, building).
*/

CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  label text NOT NULL,
  icon text NOT NULL DEFAULT 'Package'
);

CREATE TABLE IF NOT EXISTS buildings (
  id text PRIMARY KEY,
  label text NOT NULL,
  short_label text NOT NULL,
  kind text NOT NULL DEFAULT 'academic',
  polygon text,
  cx real,
  cy real,
  hue text NOT NULL DEFAULT 'brand'
);

CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('lost','found')),
  status text NOT NULL DEFAULT 'lost' CHECK (status IN ('lost','found','matched','claimed','returned','closed')),
  title text NOT NULL,
  category text REFERENCES categories(id) DEFAULT 'other',
  description text,
  image_url text,
  building_id text REFERENCES buildings(id),
  location_detail text,
  reward numeric(10,2),
  reporter_name text NOT NULL DEFAULT 'Anonymous',
  reporter_contact text,
  event_date date,
  event_time time,
  timeline jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  claimer_name text NOT NULL,
  claimer_contact text,
  claimer_note text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  visitor_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (item_id, visitor_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_building ON items(building_id);
CREATE INDEX IF NOT EXISTS idx_items_created ON items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_claims_item ON claims(item_id);
CREATE INDEX IF NOT EXISTS idx_favorites_visitor ON favorites(visitor_id);

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- categories (read-only lookup, open read)
DROP POLICY IF EXISTS "anon_read_categories" ON categories;
CREATE POLICY "anon_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- buildings (read + write for admin/seed)
DROP POLICY IF EXISTS "anon_read_buildings" ON buildings;
CREATE POLICY "anon_read_buildings" ON buildings FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_write_buildings" ON buildings;
CREATE POLICY "anon_write_buildings" ON buildings FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_buildings" ON buildings;
CREATE POLICY "anon_update_buildings" ON buildings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- items (full open CRUD)
DROP POLICY IF EXISTS "anon_select_items" ON items;
CREATE POLICY "anon_select_items" ON items FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_items" ON items;
CREATE POLICY "anon_insert_items" ON items FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_items" ON items;
CREATE POLICY "anon_update_items" ON items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_items" ON items;
CREATE POLICY "anon_delete_items" ON items FOR DELETE
  TO anon, authenticated USING (true);

-- claims (full open CRUD)
DROP POLICY IF EXISTS "anon_select_claims" ON claims;
CREATE POLICY "anon_select_claims" ON claims FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_claims" ON claims;
CREATE POLICY "anon_insert_claims" ON claims FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_claims" ON claims;
CREATE POLICY "anon_update_claims" ON claims FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_claims" ON claims;
CREATE POLICY "anon_delete_claims" ON claims FOR DELETE
  TO anon, authenticated USING (true);

-- favorites (full open CRUD)
DROP POLICY IF EXISTS "anon_select_favorites" ON favorites;
CREATE POLICY "anon_select_favorites" ON favorites FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_favorites" ON favorites;
CREATE POLICY "anon_insert_favorites" ON favorites FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_favorites" ON favorites;
CREATE POLICY "anon_delete_favorites" ON favorites FOR DELETE
  TO anon, authenticated USING (true);
