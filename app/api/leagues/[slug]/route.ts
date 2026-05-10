export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const db = createServerSupabase()

  const { data: league } = await db
    .from('leagues')
    .select('id, name, slug, season, api_id')
    .eq('slug', params.slug)
    .single()

  if (!league) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: teams } = await db
    .from('teams')
    .select('id, name, short_name, logo_url')
    .eq('league_id', league.id)

  const { data: fixtures } = await db
    .from('fixtures')
    .select(`
      id, kickoff_time, status, home_score, away_score,
      home_team:teams!fixtures_home_team_id_fkey(id, name, short_name, logo_url),
      away_team:teams!fixtures_away_team_id_fkey(id, name, short_name, logo_url)
    `)
    .eq('league_id', league.id)
    .order('kickoff_time', { ascending: true })
    .limit(20)

  const { data: latestSim } = await db
    .from('simulations')
    .select('id, result_json, narrative, created_at')
    .eq('league_id', league.id)
    .eq('type', 'league')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return NextResponse.json({ league, teams: teams ?? [], fixtures: fixtures ?? [], latestSim })
}
