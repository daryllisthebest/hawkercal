# SportSim AI — AI-Powered Sports Simulation Engine

Simulate league seasons, championship outcomes, and individual match previews using Monte Carlo simulation and Claude AI-generated analyst narratives.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Supabase** (Postgres + Auth)
- **Anthropic Claude API** (`claude-sonnet-4-20250514`)
- **API-Football** (free tier for live fixtures and results)

## Routes

| Route | Description |
|-------|-------------|
| `/sportsim` | Home: hero, featured World Cup 2026 card, all leagues grid |
| `/sportsim/simulate/[league]` | League view: fixtures, recent results, run AI simulation |
| `/sportsim/champion/[league]` | Championship probabilities with Monte Carlo + What-If mode |
| `/sportsim/match/[id]` | Match preview: form, injuries, AI prediction, outcome %s |

## Setup

### 1. Clone & install

```bash
git clone <repo>
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Where to get it |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |
| `API_FOOTBALL_KEY` | rapidapi.com → API-Football → Subscribe (free tier) |

### 3. Set up Supabase database

Run the schema file in Supabase SQL editor:

```
supabase/schema.sql
```

This creates all tables and seeds the sports + leagues data.

### 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000/sportsim`

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables in Vercel Dashboard → Project → Settings → Environment Variables
4. Deploy

The `vercel.json` file is already configured. Ensure the Vercel environment variable names match:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
API_FOOTBALL_KEY
```

## Adding PropellerAds / Monetag Ads

Ad slots are pre-placed as `<div class="ad-slot">` elements. To activate:

1. Create an account at [PropellerAds](https://propellerads.com) or [Monetag](https://monetag.com)
2. Generate ad codes for the following sizes:
   - **728×90 leaderboard** — top of home page
   - **300×250 medium rectangle** — between fixtures and simulation panel
   - **300×250 sidebar** — right sidebar on desktop
3. Open `components/sportsim/AdSlot.tsx`
4. Replace the comment `{/* PropellerAds / Monetag ad code goes here */}` with your ad script/iframe

## Simulation Logic

The Monte Carlo simulation in `lib/simulation.ts` uses four weighted factors:

| Factor | Weight | Source |
|--------|--------|--------|
| Recent form (last 5 games) | 40% | Fixtures table |
| Head-to-head record | 20% | Fixtures table |
| Home advantage | 15% | Fixtures table |
| Squad fitness / injuries | 25% | Players table |

After simulation, Claude AI generates a 3-paragraph analyst-style narrative explaining the results.

## Populating Data

The schema seeds sports and leagues. To add teams and fixtures:

**Option A: Supabase Table Editor** — manually insert teams and fixtures rows.

**Option B: API-Football sync** — use `lib/sports-api.ts` functions to fetch and store:

```ts
// Example: sync EPL fixtures
import { fetchFixtures } from '@/lib/sports-api'
const fixtures = await fetchFixtures(39, 2024) // EPL league ID, season year
```

API responses are cached in the `api_cache` table for 1 hour to minimise API calls.

## What-If Scenarios

On the `/sportsim/champion/[league]` page:

1. Click **Enable What-If**
2. Enter a player name, team, and position
3. Click **Re-run Without This Player**
4. Claude AI generates a narrative explaining how the title race shifts

## Database Schema

See `supabase/schema.sql` for the full schema. Key tables:

- `sports` — Football, Basketball, etc.
- `leagues` — PL, CL, NBA, etc.
- `teams` — team records per league
- `fixtures` — match schedule + results
- `players` — player availability and injuries
- `simulations` — saved AI simulation outputs
- `simulation_runs` — Monte Carlo iteration data
- `api_cache` — API-Football response cache
