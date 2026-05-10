import { createClient } from '@supabase/supabase-js'

let _supabase: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _supabase
}

// Keep backward compat — lazily resolved
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return getSupabase()[prop as keyof ReturnType<typeof createClient>]
  },
})

export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder',
    { auth: { persistSession: false } }
  )
}

export type Sport = {
  id: string
  name: string
  slug: string
  icon_url: string | null
  active: boolean
}

export type League = {
  id: string
  sport_id: string
  name: string
  slug: string
  season: string
  api_id: number | null
}

export type Team = {
  id: string
  league_id: string
  name: string
  short_name: string | null
  logo_url: string | null
  api_id: number | null
}

export type Fixture = {
  id: string
  league_id: string
  home_team_id: string
  away_team_id: string
  kickoff_time: string
  status: string
  home_score: number | null
  away_score: number | null
  api_fixture_id: number | null
  home_team?: Team
  away_team?: Team
}

export type Simulation = {
  id: string
  league_id: string
  type: 'champion' | 'match' | 'league'
  result_json: Record<string, unknown>
  narrative: string
  created_at: string
}

export type SimulationRun = {
  id: string
  simulation_id: string
  iterations: number
  champion_probabilities_json: ChampionProbability[]
}

export type ChampionProbability = {
  team: string
  team_id?: string
  probability: number
}

export type Player = {
  id: string
  team_id: string
  name: string
  position: string | null
  status: string
  injury_detail: string | null
}
