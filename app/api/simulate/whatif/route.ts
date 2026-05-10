export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { generateWhatIfAnalysis } from '@/lib/claude'

export async function POST(req: NextRequest) {
  try {
    const { leagueName, injuredPlayer, originalResults, newResults } = await req.json()
    const narrative = await generateWhatIfAnalysis(leagueName, injuredPlayer, originalResults, newResults)
    return NextResponse.json({ narrative })
  } catch (err) {
    console.error('What-if error:', err)
    return NextResponse.json({ error: 'What-if analysis failed' }, { status: 500 })
  }
}
