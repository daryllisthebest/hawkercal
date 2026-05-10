export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'
import { runSimulation, saveSimulation } from '@/lib/simulation'
import { generateLeagueNarrative } from '@/lib/claude'

export async function POST(req: NextRequest) {
  try {
    const { leagueSlug } = await req.json()

    const db = createServerSupabase()
    const { data: league } = await db
      .from('leagues')
      .select('id, name, season')
      .eq('slug', leagueSlug)
      .single()

    if (!league) {
      return NextResponse.json({ error: 'League not found' }, { status: 404 })
    }

    const results = await runSimulation(league.id, 1000)

    // Build a mock standings array for narrative generation
    const standings = results.slice(0, 6).map((r, i) => ({
      team: r.team,
      points: Math.max(0, 68 - i * 7 + Math.floor(Math.random() * 5)),
      played: 30,
      gd: Math.max(-10, 25 - i * 8),
    }))

    const narrative = await generateLeagueNarrative(league.name, league.season, standings, results)
    const simulationId = await saveSimulation(league.id, 'league', results, narrative, 1000)

    return NextResponse.json({
      results: results.slice(0, 4),
      narrative,
      simulationId,
      leagueName: league.name,
      season: league.season,
    })
  } catch (err) {
    console.error('League simulation error:', err)
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 })
  }
}
