'use client'

import { useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import AdSlot from '@/components/sportsim/AdSlot'
import { ProbabilityBarSkeleton, NarrativeSkeleton } from '@/components/sportsim/LoadingSkeleton'

type SimResult = {
  team: string
  teamId: string
  probability: number
}

type SimResponse = {
  results: SimResult[]
  narrative: string
  leagueName: string
}

const LEAGUE_DISPLAY: Record<string, { name: string; badge: string }> = {
  'world-cup-2026': { name: 'FIFA World Cup 2026', badge: '🌍' },
  'premier-league': { name: 'Premier League 2024/25', badge: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  'champions-league': { name: 'UEFA Champions League 2024/25', badge: '⭐' },
  'nba': { name: 'NBA 2024/25', badge: '🏀' },
  'nfl': { name: 'NFL 2024/25', badge: '🏈' },
  'nhl': { name: 'NHL 2024/25', badge: '🏒' },
  'icc-cricket-world-cup': { name: 'ICC Cricket World Cup 2025', badge: '🏏' },
}

export default function ChampionPage() {
  const { league: leagueSlug } = useParams<{ league: string }>()
  const display = LEAGUE_DISPLAY[leagueSlug] ?? { name: leagueSlug, badge: '🏆' }

  const [simulating, setSimulating] = useState(false)
  const [result, setResult] = useState<SimResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // What-If state
  const [whatIfMode, setWhatIfMode] = useState(false)
  const [injuredPlayerInput, setInjuredPlayerInput] = useState('')
  const [injuredTeam, setInjuredTeam] = useState('')
  const [injuredPosition, setInjuredPosition] = useState('Forward')
  const [whatIfResult, setWhatIfResult] = useState<{ narrative: string; results: SimResult[] } | null>(null)
  const [whatIfLoading, setWhatIfLoading] = useState(false)

  const runSim = useCallback(async (injuredPlayerIds: string[] = []) => {
    setSimulating(true)
    setError(null)
    try {
      const res = await fetch('/api/simulate/champion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leagueSlug, iterations: 1000, injuredPlayerIds }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setResult(json)
      setWhatIfResult(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Simulation failed')
    } finally {
      setSimulating(false)
    }
  }, [leagueSlug])

  const runWhatIf = async () => {
    if (!result || !injuredPlayerInput) return
    setWhatIfLoading(true)
    try {
      const res = await fetch('/api/simulate/champion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leagueSlug, iterations: 1000, injuredPlayerIds: [] }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)

      // Generate what-if narrative via separate call
      const narRes = await fetch('/api/simulate/whatif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leagueName: display.name,
          injuredPlayer: { name: injuredPlayerInput, team: injuredTeam, position: injuredPosition },
          originalResults: result.results,
          newResults: json.results,
        }),
      })
      const narJson = await narRes.json()
      setWhatIfResult({ narrative: narJson.narrative ?? json.narrative, results: json.results })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'What-If failed')
    } finally {
      setWhatIfLoading(false)
    }
  }

  const displayResults = whatIfResult?.results ?? result?.results ?? []
  const displayNarrative = whatIfResult?.narrative ?? result?.narrative ?? ''

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link href={`/sportsim/simulate/${leagueSlug}`} className="text-gray-500 text-sm hover:text-gray-300 mb-4 inline-block">
          ← Back to {display.name}
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-5xl">{display.badge}</div>
          <div>
            <h1 className="text-3xl font-black text-white">{display.name}</h1>
            <p className="text-gray-500 mt-1">Championship Probability Simulation</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-8 items-start">
        <div className="flex-1 space-y-6">
          {/* Run button */}
          {!result && !simulating && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h2 className="text-xl font-bold text-white mb-2">Ready to Simulate</h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">
                Run 1,000 iterations of Monte Carlo simulation to calculate each team's championship probability.
              </p>
              <button
                onClick={() => runSim()}
                className="px-8 py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-colors text-lg"
              >
                Simulate Champion
              </button>
            </div>
          )}

          {/* Simulating skeleton */}
          {simulating && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-500 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span className="text-white font-semibold">Running 1,000-iteration simulation…</span>
              </div>
              <ProbabilityBarSkeleton count={10} />
              <NarrativeSkeleton />
            </div>
          )}

          {/* Results */}
          {result && !simulating && (
            <>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">Championship Probabilities</h2>
                    <p className="text-gray-500 text-sm">
                      Based on 1,000 simulations · {whatIfResult ? 'What-If scenario' : 'Current form'}
                    </p>
                  </div>
                  <button
                    onClick={() => runSim()}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    Re-run
                  </button>
                </div>

                <div className="space-y-3">
                  {displayResults.map((r, i) => (
                    <div key={r.team} className="flex items-center gap-4">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          i === 0 ? 'bg-yellow-500 text-black' :
                          i === 1 ? 'bg-gray-300 text-black' :
                          i === 2 ? 'bg-amber-700 text-white' :
                          'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-semibold ${i === 0 ? 'text-white' : 'text-gray-300'}`}>
                            {r.team}
                          </span>
                          <span className="text-sm font-mono text-blue-400">
                            {(r.probability * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              i === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                              i < 3 ? 'bg-blue-500/60' :
                              'bg-blue-500/30'
                            }`}
                            style={{ width: `${Math.max(r.probability * 100, 0.5)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Narrative */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-xs font-bold">AI</div>
                  <span className="text-sm font-semibold text-gray-300">Claude Analyst</span>
                  {whatIfResult && (
                    <span className="ml-2 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      What-If Scenario
                    </span>
                  )}
                </div>
                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {displayNarrative}
                </div>
              </div>

              {/* What-If toggle */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white">What If? Scenario</h3>
                    <p className="text-gray-500 text-sm mt-0.5">Mark a key player as injured and re-run</p>
                  </div>
                  <button
                    onClick={() => setWhatIfMode(!whatIfMode)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      whatIfMode ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    {whatIfMode ? 'Hide' : 'Enable What-If'}
                  </button>
                </div>

                {whatIfMode && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Player Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Mbappé"
                          value={injuredPlayerInput}
                          onChange={(e) => setInjuredPlayerInput(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Team</label>
                        <input
                          type="text"
                          placeholder="e.g. France"
                          value={injuredTeam}
                          onChange={(e) => setInjuredTeam(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Position</label>
                        <select
                          value={injuredPosition}
                          onChange={(e) => setInjuredPosition(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        >
                          <option>Forward</option>
                          <option>Midfielder</option>
                          <option>Defender</option>
                          <option>Goalkeeper</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={runWhatIf}
                      disabled={whatIfLoading || !injuredPlayerInput || !injuredTeam}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/40 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-colors text-sm"
                    >
                      {whatIfLoading ? 'Re-simulating…' : 'Re-run Without This Player'}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex justify-center">
            <AdSlot size="medium-rectangle" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:flex flex-col gap-6 w-72 shrink-0">
          <AdSlot size="sidebar" />
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Simulation Method</h3>
            <div className="space-y-3 text-xs text-gray-500">
              <div>
                <div className="text-white font-medium mb-0.5">Monte Carlo</div>
                1,000 independent season simulations run simultaneously
              </div>
              <div>
                <div className="text-white font-medium mb-0.5">Weighted Factors</div>
                Form (40%), H2H (20%), Home (15%), Fitness (25%)
              </div>
              <div>
                <div className="text-white font-medium mb-0.5">AI Narrative</div>
                Claude AI generates expert analyst commentary on results
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
