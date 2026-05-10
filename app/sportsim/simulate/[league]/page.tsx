'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import AdSlot from '@/components/sportsim/AdSlot'
import FormBadge from '@/components/sportsim/FormBadge'
import { CardSkeleton, NarrativeSkeleton, TableSkeleton } from '@/components/sportsim/LoadingSkeleton'

type Fixture = {
  id: string
  kickoff_time: string
  status: string
  home_score: number | null
  away_score: number | null
  home_team: { id: string; name: string; short_name: string | null; logo_url: string | null }
  away_team: { id: string; name: string; short_name: string | null; logo_url: string | null }
}

type SimResult = {
  team: string
  probability: number
}

type LeagueData = {
  league: { id: string; name: string; slug: string; season: string }
  teams: Array<{ id: string; name: string }>
  fixtures: Fixture[]
  latestSim: { result_json: SimResult[]; narrative: string; created_at: string } | null
}

function formatKickoff(dt: string) {
  const d = new Date(dt)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function SimulatePage() {
  const { league: leagueSlug } = useParams<{ league: string }>()
  const [data, setData] = useState<LeagueData | null>(null)
  const [loading, setLoading] = useState(true)
  const [simulating, setSimulating] = useState(false)
  const [simResult, setSimResult] = useState<{ results: SimResult[]; narrative: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadLeague = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/leagues/${leagueSlug}`)
      if (!res.ok) throw new Error('League not found')
      const json = await res.json()
      setData(json)
      if (json.latestSim) {
        setSimResult({
          results: json.latestSim.result_json,
          narrative: json.latestSim.narrative,
        })
      }
    } catch {
      setError('Failed to load league data. Make sure your Supabase database is configured.')
    } finally {
      setLoading(false)
    }
  }, [leagueSlug])

  useEffect(() => {
    loadLeague()
  }, [loadLeague])

  const runSim = async () => {
    setSimulating(true)
    try {
      const res = await fetch('/api/simulate/league', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leagueSlug }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setSimResult({ results: json.results, narrative: json.narrative })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Simulation failed')
    } finally {
      setSimulating(false)
    }
  }

  const upcoming = data?.fixtures.filter((f) => f.status === 'NS') ?? []
  const completed = data?.fixtures.filter((f) => f.status === 'FT').slice(0, 5) ?? []

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* League Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          {loading ? (
            <div className="h-8 w-64 bg-gray-800 rounded animate-pulse" />
          ) : (
            <>
              <h1 className="text-3xl font-black text-white">{data?.league.name ?? leagueSlug}</h1>
              <p className="text-gray-500 mt-1">Season {data?.league.season}</p>
            </>
          )}
        </div>
        <Link
          href={`/sportsim/champion/${leagueSlug}`}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-colors text-sm font-medium"
        >
          Championship Odds →
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-8 items-start">
        <div className="flex-1 space-y-8">
          {/* Fixtures */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-5">Upcoming Fixtures</h2>
            {loading ? (
              <TableSkeleton rows={5} />
            ) : upcoming.length === 0 ? (
              <p className="text-gray-500 text-sm">No upcoming fixtures. Add fixtures via Supabase.</p>
            ) : (
              <div className="space-y-2">
                {upcoming.slice(0, 8).map((f) => (
                  <Link
                    key={f.id}
                    href={`/sportsim/match/${f.id}`}
                    className="flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-medium text-white">{f.home_team.name}</span>
                      <span className="text-gray-600 text-xs">vs</span>
                      <span className="text-sm font-medium text-white">{f.away_team.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 text-xs">{formatKickoff(f.kickoff_time)}</span>
                      <span className="text-blue-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        Preview →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Results */}
          {completed.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-5">Recent Results</h2>
              <div className="space-y-2">
                {completed.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                    <span className="text-sm text-white w-1/3 text-right">{f.home_team.name}</span>
                    <div className="flex items-center gap-2 px-4">
                      <span className="text-xl font-black text-white">{f.home_score}</span>
                      <span className="text-gray-600">—</span>
                      <span className="text-xl font-black text-white">{f.away_score}</span>
                    </div>
                    <span className="text-sm text-white w-1/3">{f.away_team.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ad slot */}
          <div className="flex justify-center">
            <AdSlot size="medium-rectangle" />
          </div>

          {/* Simulation Panel */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">AI Simulation</h2>
                <p className="text-gray-500 text-sm mt-0.5">Top 4 predicted finishers</p>
              </div>
              <button
                onClick={runSim}
                disabled={simulating}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
              >
                {simulating ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Simulating…
                  </>
                ) : (
                  'Run Simulation'
                )}
              </button>
            </div>

            {simulating ? (
              <div className="space-y-5">
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-4 animate-pulse">
                      <div className="w-8 h-8 bg-gray-800 rounded-full" />
                      <div className="flex-1">
                        <div className="h-3 bg-gray-800 rounded w-1/3 mb-2" />
                        <div className="h-2 bg-gray-800 rounded" style={{ width: `${85 - i * 15}%` }} />
                      </div>
                      <div className="h-4 bg-gray-800 rounded w-12" />
                    </div>
                  ))}
                </div>
                <NarrativeSkeleton />
              </div>
            ) : simResult ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  {simResult.results.slice(0, 4).map((r, i) => (
                    <div key={r.team} className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                          i === 0 ? 'bg-yellow-500 text-black' :
                          i === 1 ? 'bg-gray-400 text-black' :
                          i === 2 ? 'bg-amber-700 text-white' :
                          'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-white">{r.team}</span>
                          <span className="text-sm text-blue-400 font-mono">
                            {(r.probability * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              i === 0 ? 'bg-blue-500' : 'bg-blue-500/50'
                            }`}
                            style={{ width: `${r.probability * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-800 pt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-xs">AI</div>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Claude Analyst</span>
                  </div>
                  <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                    {simResult.narrative}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-600">
                <p>Click "Run Simulation" to generate AI predictions</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:flex flex-col gap-6 w-72 shrink-0">
          <AdSlot size="sidebar" />

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href={`/sportsim/champion/${leagueSlug}`}
                className="flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors text-sm text-white"
              >
                <span>Championship Simulation</span>
                <span className="text-gray-500">→</span>
              </Link>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">How It Works</h3>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="flex gap-2"><span className="text-blue-500">40%</span> Recent form (last 5)</li>
              <li className="flex gap-2"><span className="text-blue-500">20%</span> Head-to-head record</li>
              <li className="flex gap-2"><span className="text-blue-500">15%</span> Home advantage</li>
              <li className="flex gap-2"><span className="text-blue-500">25%</span> Squad fitness</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
