export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'

export async function GET() {
  const db = createServerSupabase()
  const { data: leagues } = await db
    .from('leagues')
    .select('id, name, slug, season, sport_id')
    .order('name')

  return NextResponse.json(leagues ?? [])
}
