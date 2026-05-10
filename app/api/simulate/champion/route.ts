export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'
import { runChampionSimulation } from '@/lib/simulation'

export async function POST(req: NextRequest) {
  try {
    const { leagueSlug, iterations = 1000, injuredPlayerIds = [] } = await req.json()

    const db = createServerSupabase()
    const { data: league } = await db
      .from('leagues')
      .select('id, name, season')
      .eq('slug', leagueSlug)
      .single()

    if (!league) {
      return NextResponse.json({ error: 'League not found' }, { status: 404 })
    }

    const { results, narrative, simulationId } = await runChampionSimulation(
      league.id,
      league.name,
      league.season,
      iterations,
      injuredPlayerIds
    )

    return NextResponse.json({ results, narrative, simulationId, leagueName: league.name })
  } catch (err) {
    console.error('Champion simulation error:', err)
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 })
  }
}
