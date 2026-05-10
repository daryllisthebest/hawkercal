import { createServerSupabase } from './supabase'

const API_FOOTBALL_BASE = 'https://v3.football.api-sports.io'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

async function cachedFetch<T>(cacheKey: string, fetcher: () => Promise<T>): Promise<T> {
  const db = createServerSupabase()

  const { data: cached } = await db
    .from('api_cache')
    .select('data, expires_at')
    .eq('cache_key', cacheKey)
    .single()

  if (cached && new Date(cached.expires_at) > new Date()) {
    return cached.data as T
  }

  const fresh = await fetcher()
  const expiresAt = new Date(Date.now() + CACHE_TTL_MS).toISOString()

  await db.from('api_cache').upsert({
    cache_key: cacheKey,
    data: fresh as Record<string, unknown>,
    expires_at: expiresAt,
  })

  return fresh
}

function apiHeaders() {
  return {
    'x-rapidapi-key': process.env.API_FOOTBALL_KEY!,
    'x-rapidapi-host': 'v3.football.api-sports.io',
  }
}

export async function fetchFixtures(leagueId: number, season: number) {
  return cachedFetch(`fixtures:${leagueId}:${season}`, async () => {
    const res = await fetch(
      `${API_FOOTBALL_BASE}/fixtures?league=${leagueId}&season=${season}`,
      { headers: apiHeaders() }
    )
    const json = await res.json()
    return json.response ?? []
  })
}

export async function fetchStandings(leagueId: number, season: number) {
  return cachedFetch(`standings:${leagueId}:${season}`, async () => {
    const res = await fetch(
      `${API_FOOTBALL_BASE}/standings?league=${leagueId}&season=${season}`,
      { headers: apiHeaders() }
    )
    const json = await res.json()
    return json.response?.[0]?.league?.standings?.[0] ?? []
  })
}

export async function fetchInjuries(leagueId: number, season: number) {
  return cachedFetch(`injuries:${leagueId}:${season}`, async () => {
    const res = await fetch(
      `${API_FOOTBALL_BASE}/injuries?league=${leagueId}&season=${season}`,
      { headers: apiHeaders() }
    )
    const json = await res.json()
    return json.response ?? []
  })
}

export async function fetchHeadToHead(team1Id: number, team2Id: number) {
  return cachedFetch(`h2h:${team1Id}:${team2Id}`, async () => {
    const res = await fetch(
      `${API_FOOTBALL_BASE}/fixtures/headtohead?h2h=${team1Id}-${team2Id}&last=10`,
      { headers: apiHeaders() }
    )
    const json = await res.json()
    return json.response ?? []
  })
}

export async function fetchTeamStatistics(teamId: number, leagueId: number, season: number) {
  return cachedFetch(`team-stats:${teamId}:${leagueId}:${season}`, async () => {
    const res = await fetch(
      `${API_FOOTBALL_BASE}/teams/statistics?team=${teamId}&league=${leagueId}&season=${season}`,
      { headers: apiHeaders() }
    )
    const json = await res.json()
    return json.response ?? {}
  })
}

// Compute head-to-head record summary from raw fixtures
export function summariseH2H(
  fixtures: Array<{
    teams: { home: { id: number; winner: boolean }; away: { id: number; winner: boolean } }
  }>,
  team1Id: number
) {
  let wins = 0, draws = 0, losses = 0
  for (const f of fixtures) {
    const isHome = f.teams.home.id === team1Id
    const homeWon = f.teams.home.winner
    const awayWon = f.teams.away.winner
    if (!homeWon && !awayWon) { draws++; continue }
    if ((isHome && homeWon) || (!isHome && awayWon)) wins++
    else losses++
  }
  return { home: wins, draw: draws, away: losses }
}
