'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import AdSlot from '@/components/sportsim/AdSlot'
import FormBadge from '@/components/sportsim/FormBadge'
import { NarrativeSkeleton } from '@/components/sportsim/LoadingSkeleton'

type MatchData = {
  narrative: string
  prediction: {
    homeWin: number
    draw: number
    awayWin: number
    predictedHomeGoals: number
    predictedAwayGoals: number
  }
  homeTeam: string
  awayTeam: string
  homeForm: string[]
  awayForm: string[]
  injuries: { home: string[]; away: string[] }
}

function PctBar({ label, value, highlight }: { label: string; value: number; highlight: boolean }) {
  return (
    <div className="flex-1 text-center">
      <div className={`text-2xl font-black ${highlight ? 'text-blue-400' : 'text-white'}`}>
        {(value * 100).toFixed(0)}%
      </div>
      <div className="text-gray-500 text-xs mt-0.5">{label}</div>
    </div>
  )
}

export default function MatchPage() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<MatchData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fixtureInfo, setFixtureInfo] = useState<{
    homeTeam: string; awayTeam: string; kickoff: string; status: string
  } | null>(null)

  const loadFixture = useCallback(async () => {
    try {
      const res = await fetch(`/api/fixtures/${id}`)
      if (!res.ok) return
      const json = await res.json()
      setFixtureInfo(json)
    } catch {
      // silently fail; fixture header optional
    }
  }, [id])

  useEffect(() => {
    loadFixture()
  }, [loadFixture])

  const runPreview = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/simulate/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fixtureId: id }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Preview generation failed')
    } finally {
      setLoading(false)
    }
  }

  const homeTeam = data?.homeTeam ?? fixtureInfo?.homeTeam ?? 'Home Team'
  const awayTeam = data?.awayTeam ?? fixtureInfo?.awayTeam ?? 'Away Team'

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link href="/sportsim" className="text-gray-500 text-sm hover:text-gray-300 mb-4 inline-block">
          ← All Leagues
        </Link>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="text-2xl font-black text-white">{homeTeam}</div>
              <div className="text-gray-500 text-sm mt-1">Home</div>
            </div>
            <div className="text-center px-6">
              <div className="text-4xl font-black text-gray-700">vs</div>
              {fixtureInfo?.kickoff && (
                <div className="text-gray-500 text-xs mt-2">
                  {new Date(fixtureInfo.kickoff).toLocaleDateString('en-GB', {
                    weekday: 'short', day: 'numeric', month: 'short',
                  })}
                </div>
              )}
            </div>
            <div className="text-center flex-1">
              <div className="text-2xl font-black text-white">{awayTeam}</div>
              <div className="text-gray-500 text-sm mt-1">Away</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Form */}
        {data && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-5">Recent Form</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-sm text-gray-500 mb-3">{homeTeam}</div>
                <div className="flex gap-1.5">
                  {data.homeForm.map((r, i) => <FormBadge key={i} result={r} />)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-3">{awayTeam}</div>
                <div className="flex gap-1.5">
                  {data.awayForm.map((r, i) => <FormBadge key={i} result={r} />)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Injuries */}
        {data && (data.injuries.home.length > 0 || data.injuries.away.length > 0) && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-5">Injury & Suspension List</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-sm text-gray-500 mb-3">{homeTeam}</div>
                {data.injuries.home.length === 0 ? (
                  <span className="text-gray-600 text-sm">None reported</span>
                ) : (
                  <ul className="space-y-1">
                    {data.injuries.home.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        <span className="text-gray-300">{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-3">{awayTeam}</div>
                {data.injuries.away.length === 0 ? (
                  <span className="text-gray-600 text-sm">None reported</span>
                ) : (
                  <ul className="space-y-1">
                    {data.injuries.away.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        <span className="text-gray-300">{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Prediction Panel */}
        {!data && !loading && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
            <div className="text-4xl mb-4">⚽</div>
            <h2 className="text-xl font-bold text-white mb-2">AI Match Preview</h2>
            <p className="text-gray-500 mb-6 text-sm max-w-md mx-auto">
              Generate a Claude AI-powered match preview with outcome probabilities and analyst commentary.
            </p>
            <button
              onClick={runPreview}
              className="px-8 py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-colors"
            >
              Generate Preview
            </button>
          </div>
        )}

        {loading && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-blue-500 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-white font-semibold">Generating AI preview…</span>
            </div>
            <NarrativeSkeleton />
          </div>
        )}

        {data && !loading && (
          <>
            {/* Outcome probabilities */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-5">Predicted Outcome</h2>
              <div className="flex items-center divide-x divide-gray-800 mb-6">
                <PctBar label={`${homeTeam} Win`} value={data.prediction.homeWin} highlight={data.prediction.homeWin > data.prediction.awayWin && data.prediction.homeWin > data.prediction.draw} />
                <PctBar label="Draw" value={data.prediction.draw} highlight={data.prediction.draw > data.prediction.homeWin && data.prediction.draw > data.prediction.awayWin} />
                <PctBar label={`${awayTeam} Win`} value={data.prediction.awayWin} highlight={data.prediction.awayWin > data.prediction.homeWin && data.prediction.awayWin > data.prediction.draw} />
              </div>

              <div className="bg-gray-800 rounded-xl p-4 flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-white">{data.prediction.predictedHomeGoals}</div>
                  <div className="text-gray-500 text-xs mt-1">{homeTeam}</div>
                </div>
                <div className="text-gray-600 font-medium">Predicted Score</div>
                <div className="text-center">
                  <div className="text-3xl font-black text-white">{data.prediction.predictedAwayGoals}</div>
                  <div className="text-gray-500 text-xs mt-1">{awayTeam}</div>
                </div>
              </div>
            </div>

            {/* Ad slot */}
            <div className="flex justify-center">
              <AdSlot size="medium-rectangle" />
            </div>

            {/* AI narrative */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-xs font-bold">AI</div>
                <span className="text-sm font-semibold text-gray-300">Claude Match Preview</span>
              </div>
              <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {data.narrative}
              </div>
              <button
                onClick={runPreview}
                className="mt-5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Regenerate preview ↺
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
