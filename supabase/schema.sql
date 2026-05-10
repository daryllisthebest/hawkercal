-- SportSim AI Database Schema

create table if not exists sports (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  icon_url text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists leagues (
  id uuid primary key default gen_random_uuid(),
  sport_id uuid references sports(id) on delete cascade,
  name text not null,
  slug text unique not null,
  season text not null,
  api_id integer,
  created_at timestamptz default now()
);

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  league_id uuid references leagues(id) on delete cascade,
  name text not null,
  short_name text,
  logo_url text,
  api_id integer,
  created_at timestamptz default now()
);

create table if not exists fixtures (
  id uuid primary key default gen_random_uuid(),
  league_id uuid references leagues(id) on delete cascade,
  home_team_id uuid references teams(id),
  away_team_id uuid references teams(id),
  kickoff_time timestamptz,
  status text default 'NS',
  home_score integer,
  away_score integer,
  api_fixture_id integer unique,
  created_at timestamptz default now()
);

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  name text not null,
  position text,
  status text default 'available',
  injury_detail text,
  created_at timestamptz default now()
);

create table if not exists simulations (
  id uuid primary key default gen_random_uuid(),
  league_id uuid references leagues(id) on delete cascade,
  type text not null check (type in ('champion', 'match', 'league')),
  result_json jsonb,
  narrative text,
  created_at timestamptz default now()
);

create table if not exists simulation_runs (
  id uuid primary key default gen_random_uuid(),
  simulation_id uuid references simulations(id) on delete cascade,
  iterations integer default 1000,
  champion_probabilities_json jsonb,
  created_at timestamptz default now()
);

-- Cache table for API-Football responses
create table if not exists api_cache (
  id uuid primary key default gen_random_uuid(),
  cache_key text unique not null,
  data jsonb not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Seed sports
insert into sports (name, slug, icon_url) values
  ('Football', 'football', null),
  ('Basketball', 'basketball', null),
  ('American Football', 'american-football', null),
  ('Ice Hockey', 'ice-hockey', null),
  ('Cricket', 'cricket', null)
on conflict (slug) do nothing;

-- Seed leagues (sport_id filled via subquery)
insert into leagues (sport_id, name, slug, season, api_id) values
  ((select id from sports where slug = 'football'), 'World Cup 2026', 'world-cup-2026', '2026', 1),
  ((select id from sports where slug = 'football'), 'Premier League', 'premier-league', '2024/25', 39),
  ((select id from sports where slug = 'football'), 'UEFA Champions League', 'champions-league', '2024/25', 2),
  ((select id from sports where slug = 'basketball'), 'NBA', 'nba', '2024/25', null),
  ((select id from sports where slug = 'american-football'), 'NFL', 'nfl', '2024/25', null),
  ((select id from sports where slug = 'ice-hockey'), 'NHL', 'nhl', '2024/25', null),
  ((select id from sports where slug = 'cricket'), 'ICC Cricket World Cup', 'icc-cricket-world-cup', '2025', null)
on conflict (slug) do nothing;
