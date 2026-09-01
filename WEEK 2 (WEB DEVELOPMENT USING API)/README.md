# FindIt@Campus

> Helping students reconnect with their lost belongings.

A production-quality campus lost-and-found platform. Students report lost
or found items, browse a Pinterest-style masonry feed, search by name /
category / location / date / status, explore an interactive campus map,
track an item's journey on a vertical timeline, and view recovery
analytics.

## Tech stack

**Frontend** — React, Vite, Tailwind CSS, Framer Motion, lucide-react
**Backend** — Python, FastAPI
**Data science** — NumPy, Pandas, Matplotlib, Seaborn
**Database** — Supabase (PostgreSQL) with Row Level Security

## Architecture

```
src/
  components/    Reusable UI (Navbar, ItemCard, Modal, Badges, QuickView)
  pages/         Route-level views (Home, Browse, Report, ItemDetail, Map, Analytics)
  lib/           Data layer (supabase client, hooks, router, theme, format)
backend/
  models.py      OOP domain classes (Student, Item, LostReport, FoundReport, ClaimRequest, Location)
  analytics.py   AnalyticsEngine — NumPy vectorized metrics + Pandas DataFrames + Matplotlib/Seaborn charts
  sample_data.py In-memory demo dataset
  main.py        FastAPI app exposing analytics + charts over HTTP
```

## HackoWeek topic coverage

The data-science stack is used where it genuinely fits — computing
recovery statistics over lost/found reports — not bolted on.

### Python essentials
- **Functions** — `backend/analytics.py` is organized into focused methods.
- **OOP** — `backend/models.py` defines `Student`, `Item`, `Location`,
  `LostReport`, `FoundReport`, `ClaimRequest` as dataclasses; `AnalyticsEngine`
  encapsulates all computation.
- **List comprehensions** — `_event_times`, row builders in `_build_lost_df` / `_build_found_df`.
- **Dictionary comprehensions** — `_status_index`, `summary()` assembly.

### NumPy
- `recovery_rate()` — `np.sum` over a status array.
- `average_recovery_days()` — vectorized timedelta → days via `.astype("timedelta64[D]")`.
- `daily_statistics()` — vectorized date bucketing.

### Pandas
- DataFrames built from report lists, with `to_datetime` / `fillna` **cleaning**.
- `_merge_reports()` **merges** lost + found tables via `pd.concat`.
- **GroupBy** aggregations power category, location, daily, weekly and monthly reports.

### Matplotlib & Seaborn
- `plot_daily_trend()` — line chart.
- `plot_category_bar()` — bar chart.
- `plot_status_pie()` — pie chart.
- `plot_location_heatmap()` — Seaborn heatmap of building × category density.

## Running

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

API endpoints:
- `GET /api/summary` — JSON analytics
- `GET /api/charts/daily` — PNG line chart
- `GET /api/charts/category` — PNG bar chart
- `GET /api/charts/status` — PNG pie chart
- `GET /api/charts/heatmap` — PNG Seaborn heatmap

## Features
- Report lost / found items with image, category, location, reward
- Pinterest-style masonry browse with quick-view modal
- Smart search by name, category, location, date, status
- Interactive SVG campus map — click buildings to filter items
- Vertical item timeline (Lost → Reported → Found → Claimed → Returned)
- Analytics dashboard with recovery rate, avg recovery time, daily/weekly/monthly trends
- Dark mode, favorites, QR code for item claims, export analytics report
