export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = createServerSupabase()
  const { data: fixture } = await db
    .from('fixtures')
    .select(`
      id, kickoff_time, status, home_score, away_score,
      home_team:teams!fixtures_home_team_id_fkey(name),
      away_team:teams!fixtures_away_team_id_fkey(name)
    `)
    .eq('id', params.id)
    .single()

  if (!fixture) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    homeTeam: (fixture.home_team as unknown as { name: string } | null)?.name ?? 'Home',
    awayTeam: (fixture.away_team as unknown as { name: string } | null)?.name ?? 'Away',
    kickoff: fixture.kickoff_time,
    status: fixture.status,
  })
}
