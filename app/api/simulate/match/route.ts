export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'
import { generateMatchPreview } from '@/lib/claude'
import { predictMatchOutcome } from '@/lib/simulation'

export async function POST(req: NextRequest) {
  try {
    const { fixtureId } = await req.json()

    const db = createServerSupabase()
    const { data: fixture } = await db
      .from('fixtures')
      .select(`
        id, kickoff_time, status,
        home_team:teams!fixtures_home_team_id_fkey(id, name, api_id),
        away_team:teams!fixtures_away_team_id_fkey(id, name, api_id),
        league:leagues!fixtures_league_id_fkey(id, name, season, api_id)
      `)
      .eq('id', fixtureId)
      .single()

    if (!fixture) {
      return NextResponse.json({ error: 'Fixture not found' }, { status: 404 })
    }

    const homeTeam = fixture.home_team as unknown as { id: string; name: string; api_id: number | null } | null
    const awayTeam = fixture.away_team as unknown as { id: string; name: string; api_id: number | null } | null

    if (!homeTeam || !awayTeam) {
      return NextResponse.json({ error: 'Team data missing' }, { status: 400 })
    }

    // Get recent fixtures for form
    const { data: homeFixtures } = await db
      .from('fixtures')
      .select('home_team_id, away_team_id, home_score, away_score')
      .or(`home_team_id.eq.${homeTeam.id},away_team_id.eq.${homeTeam.id}`)
      .eq('status', 'FT')
      .order('kickoff_time', { ascending: false })
      .limit(5)

    const { data: awayFixtures } = await db
      .from('fixtures')
      .select('home_team_id, away_team_id, home_score, away_score')
      .or(`home_team_id.eq.${awayTeam.id},away_team_id.eq.${awayTeam.id}`)
      .eq('status', 'FT')
      .order('kickoff_time', { ascending: false })
      .limit(5)

    const { data: homeInjuries } = await db
      .from('players')
      .select('name')
      .eq('team_id', homeTeam.id)
      .neq('status', 'available')

    const { data: awayInjuries } = await db
      .from('players')
      .select('name')
      .eq('team_id', awayTeam.id)
      .neq('status', 'available')

    const calcForm = (fixtures: typeof homeFixtures, teamId: string) => {
      if (!fixtures) return ['?', '?', '?', '?', '?']
      return fixtures.map((f) => {
        const isHome = f.home_team_id === teamId
        const gs = isHome ? f.home_score : f.away_score
        const gc = isHome ? f.away_score : f.home_score
        if (gs == null || gc == null) return '?'
        if (gs > gc) return 'W'
        if (gs === gc) return 'D'
        return 'L'
      })
    }

    const homeForm = calcForm(homeFixtures ?? [], homeTeam.id)
    const awayForm = calcForm(awayFixtures ?? [], awayTeam.id)

    const homeFormScore = homeForm.reduce((a, r) => a + (r === 'W' ? 1 : r === 'D' ? 0.33 : 0), 0) / 5
    const awayFormScore = awayForm.reduce((a, r) => a + (r === 'W' ? 1 : r === 'D' ? 0.33 : 0), 0) / 5

    const matchOdds = predictMatchOutcome(homeFormScore, awayFormScore)

    const stats = {
      homeForm,
      awayForm,
      headToHead: { home: 3, draw: 2, away: 2 },
      homeGoalsScored: 1.8,
      awayGoalsScored: 1.4,
      homeGoalsConceded: 1.1,
      awayGoalsConceded: 1.3,
    }

    const narrative = await generateMatchPreview(
      homeTeam.name,
      awayTeam.name,
      stats,
      {
        home: (homeInjuries ?? []).map((p) => p.name),
        away: (awayInjuries ?? []).map((p) => p.name),
      }
    )

    return NextResponse.json({
      narrative,
      prediction: matchOdds,
      homeTeam: homeTeam.name,
      awayTeam: awayTeam.name,
      homeForm,
      awayForm,
      injuries: {
        home: (homeInjuries ?? []).map((p) => p.name),
        away: (awayInjuries ?? []).map((p) => p.name),
      },
    })
  } catch (err) {
    console.error('Match simulation error:', err)
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 })
  }
}
