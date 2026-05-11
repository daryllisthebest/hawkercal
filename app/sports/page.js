'use client'
import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'

const TEAMS = [
  { id: 0, name: 'Lion City FC',      flag: '🇸🇬', attack: 4, defense: 4 },
  { id: 1, name: 'KL United',         flag: '🇲🇾', attack: 4, defense: 3 },
  { id: 2, name: 'Bangkok Warriors',  flag: '🇹🇭', attack: 3, defense: 4 },
  { id: 3, name: 'Jakarta Stars',     flag: '🇮🇩', attack: 3, defense: 3 },
  { id: 4, name: 'Hanoi Thunder',     flag: '🇻🇳', attack: 5, defense: 2 },
  { id: 5, name: 'Manila Eagles',     flag: '🇵🇭', attack: 2, defense: 4 },
  { id: 6, name: 'Yangon Rangers',    flag: '🇲🇲', attack: 3, defense: 3 },
  { id: 7, name: 'Saigon FC',         flag: '🇻🇳', attack: 4, defense: 2 },
]

// Round-robin scheduling (circle method)
function buildSchedule(teamIds) {
  const n = teamIds.length
  const fixed = teamIds[0]
  const rotating = teamIds.slice(1)
  const firstHalf = []

  for (let r = 0; r < n - 1; r++) {
    const round = [[fixed, rotating[0]]]
    for (let i = 1; i < n / 2; i++) {
      round.push([rotating[i], rotating[n - 1 - i]])
    }
    rotating.unshift(rotating.pop())
    firstHalf.push(round)
  }

  // Second half: flip home/away
  const secondHalf = firstHalf.map(round => round.map(([h, a]) => [a, h]))
  return [...firstHalf, ...secondHalf]
}

// Knuth-style Poisson sampler
function poisson(lambda) {
  const L = Math.exp(-Math.max(0.15, lambda))
  let k = 0
  let p = 1
  do { k++; p *= Math.random() } while (p > L)
  return k - 1
}

function simulateMatch(home, away) {
  const homeLambda = (home.attack / 5) * 1.6 + 0.35 - (away.defense / 5) * 0.5
  const awayLambda = (away.attack / 5) * 1.3 + 0.10 - (home.defense / 5) * 0.5
  return { hg: poisson(homeLambda), ag: poisson(awayLambda) }
}

function blankStandings() {
  return TEAMS.map(t => ({ id: t.id, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, Pts: 0, form: [] }))
}

function applyResult(standings, hId, aId, hg, ag) {
  return standings.map(s => {
    if (s.id !== hId && s.id !== aId) return s
    const isHome = s.id === hId
    const scored = isHome ? hg : ag
    const conceded = isHome ? ag : hg
    const res = scored > conceded ? 'W' : scored < conceded ? 'L' : 'D'
    return {
      ...s,
      P:   s.P + 1,
      W:   s.W + (res === 'W' ? 1 : 0),
      D:   s.D + (res === 'D' ? 1 : 0),
      L:   s.L + (res === 'L' ? 1 : 0),
      GF:  s.GF + scored,
      GA:  s.GA + conceded,
      Pts: s.Pts + (res === 'W' ? 3 : res === 'D' ? 1 : 0),
      form: [...s.form.slice(-4), res],
    }
  })
}

function rankTable(standings) {
  return [...standings].sort((a, b) => {
    if (b.Pts !== a.Pts) return b.Pts - a.Pts
    const gdA = a.GF - a.GA, gdB = b.GF - b.GA
    if (gdB !== gdA) return gdB - gdA
    return b.GF - a.GF
  })
}

const SCHEDULE = buildSchedule(TEAMS.map(t => t.id))
const TOTAL_ROUNDS = SCHEDULE.length
const teamById = Object.fromEntries(TEAMS.map(t => [t.id, t]))

const formBg  = r => r === 'W' ? 'bg-green-500' : r === 'D' ? 'bg-yellow-400' : 'bg-red-500'
const rankColor = i => i === 0 ? 'text-yellow-400' : i < 3 ? 'text-blue-400' : i >= TEAMS.length - 1 ? 'text-red-400' : 'text-gray-500'
const gdColor   = n => n > 0 ? 'text-green-400' : n < 0 ? 'text-red-400' : 'text-gray-500'

export default function SportsSimPage() {
  const [round, setRound]       = useState(0)
  const [table, setTable]       = useState(blankStandings)
  const [history, setHistory]   = useState([])
  const [busy, setBusy]         = useState(false)
  const [latest, setLatest]     = useState(null)

  const done = round >= TOTAL_ROUNDS

  // Simulate one round (with brief animation delay)
  const simRound = useCallback(() => {
    if (round >= TOTAL_ROUNDS) return
    setBusy(true)
    setTimeout(() => {
      const fixtures = SCHEDULE[round]
      const results = fixtures.map(([hId, aId]) => {
        const { hg, ag } = simulateMatch(teamById[hId], teamById[aId])
        return { hId, aId, hg, ag }
      })
      setTable(prev => {
        let t = prev
        results.forEach(r => { t = applyResult(t, r.hId, r.aId, r.hg, r.ag) })
        return t
      })
      const entry = { round: round + 1, results }
      setHistory(prev => [...prev, entry])
      setLatest(entry)
      setRound(r => r + 1)
      setBusy(false)
    }, 500)
  }, [round])

  // Simulate all remaining rounds synchronously
  const simAll = useCallback(() => {
    if (round >= TOTAL_ROUNDS) return
    let t = table
    let r = round
    const newHistory = []
    let last = null
    while (r < TOTAL_ROUNDS) {
      const fixtures = SCHEDULE[r]
      const results = fixtures.map(([hId, aId]) => {
        const { hg, ag } = simulateMatch(teamById[hId], teamById[aId])
        return { hId, aId, hg, ag }
      })
      results.forEach(res => { t = applyResult(t, res.hId, res.aId, res.hg, res.ag) })
      last = { round: r + 1, results }
      newHistory.push(last)
      r++
    }
    setTable(t)
    setHistory(prev => [...prev, ...newHistory])
    setLatest(last)
    setRound(TOTAL_ROUNDS)
  }, [round, table])

  const reset = useCallback(() => {
    setRound(0)
    setTable(blankStandings())
    setHistory([])
    setLatest(null)
  }, [])

  const ranked = useMemo(() => rankTable(table), [table])
  const champion = done ? teamById[ranked[0].id] : null

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-xl shadow-lg">
              ⚽
            </div>
            <div>
              <span className="font-black text-white tracking-tight">SEA Football League</span>
              <span className="hidden sm:inline text-gray-500 text-xs ml-2">Southeast Asia Championship</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block">Round</span>
            <span className="text-lg font-black tabular-nums">
              <span className={done ? 'text-yellow-400' : 'text-green-400'}>{round}</span>
              <span className="text-gray-700 text-sm">/{TOTAL_ROUNDS}</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">

        {/* ── CHAMPION BANNER ── */}
        {done && champion && (
          <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border border-yellow-500/40 rounded-2xl p-5 flex items-center gap-4">
            <div className="text-5xl">{champion.flag}</div>
            <div>
              <div className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1">🏆 Champions</div>
              <div className="text-2xl font-black text-white">{champion.name}</div>
              <div className="text-gray-400 text-sm">{ranked[0].Pts} pts · {ranked[0].W}W {ranked[0].D}D {ranked[0].L}L</div>
            </div>
          </div>
        )}

        {/* ── CONTROLS ── */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white">
                {done ? 'Season complete' : `Round ${round + 1} of ${TOTAL_ROUNDS}`}
              </p>
              <p className="text-gray-500 text-sm">
                {done
                  ? 'Start a new season to play again'
                  : `${TOTAL_ROUNDS - round} rounds remaining · ${(SCHEDULE[round] ?? []).length} matches`}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {!done && (
                <>
                  <button
                    onClick={simRound}
                    disabled={busy}
                    className="bg-green-600 hover:bg-green-500 disabled:opacity-40 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95"
                  >
                    {busy ? '⏳ Simulating…' : '▶ Sim Round'}
                  </button>
                  <button
                    onClick={simAll}
                    disabled={busy}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95"
                  >
                    ⏩ Sim Season
                  </button>
                </>
              )}
              <button
                onClick={reset}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95"
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(round / TOTAL_ROUNDS) * 100}%` }}
            />
          </div>
        </div>

        {/* ── LATEST ROUND RESULTS ── */}
        {latest && (
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <h2 className="font-bold text-white mb-4 text-sm uppercase tracking-wider text-gray-400">
              Round {latest.round} Results
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {latest.results.map((r, i) => {
                const home = teamById[r.hId], away = teamById[r.aId]
                const hw = r.hg > r.ag, aw = r.ag > r.hg
                return (
                  <div key={i} className="bg-gray-800/70 rounded-xl px-4 py-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <div className={`text-right text-sm ${hw ? 'text-white font-bold' : 'text-gray-400'}`}>
                      <span className="mr-1">{home.flag}</span>{home.name}
                    </div>
                    <div className="bg-gray-900 rounded-lg px-3 py-1.5 flex items-center gap-1.5 font-black tabular-nums">
                      <span className={hw ? 'text-green-400' : 'text-white'}>{r.hg}</span>
                      <span className="text-gray-700 text-xs">—</span>
                      <span className={aw ? 'text-green-400' : 'text-white'}>{r.ag}</span>
                    </div>
                    <div className={`text-sm ${aw ? 'text-white font-bold' : 'text-gray-400'}`}>
                      {away.name}<span className="ml-1">{away.flag}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── LEAGUE TABLE ── */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="font-bold text-white flex items-center gap-2">
              <span>🏆</span> League Table
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-gray-600 border-b border-gray-800">
                  <th className="px-4 py-2.5 text-left">#</th>
                  <th className="px-4 py-2.5 text-left">Club</th>
                  <th className="px-3 py-2.5 text-center">P</th>
                  <th className="px-3 py-2.5 text-center text-green-600">W</th>
                  <th className="px-3 py-2.5 text-center text-yellow-600">D</th>
                  <th className="px-3 py-2.5 text-center text-red-600">L</th>
                  <th className="px-3 py-2.5 text-center">GF</th>
                  <th className="px-3 py-2.5 text-center">GA</th>
                  <th className="px-3 py-2.5 text-center">GD</th>
                  <th className="px-3 py-2.5 text-center font-bold text-white">Pts</th>
                  <th className="px-4 py-2.5 text-center">Form</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((s, i) => {
                  const team = teamById[s.id]
                  const gd = s.GF - s.GA
                  const isChamp = done && i === 0
                  return (
                    <tr
                      key={s.id}
                      className={`border-b border-gray-800/40 transition-colors ${
                        isChamp ? 'bg-yellow-500/5' : 'hover:bg-gray-800/30'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className={`font-black text-xs ${rankColor(i)}`}>
                          {isChamp ? '🏆' : i + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{team.flag}</span>
                          <span className="font-semibold text-white leading-none">{team.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center text-gray-500">{s.P}</td>
                      <td className="px-3 py-3 text-center text-green-400 font-medium">{s.W}</td>
                      <td className="px-3 py-3 text-center text-yellow-400 font-medium">{s.D}</td>
                      <td className="px-3 py-3 text-center text-red-400 font-medium">{s.L}</td>
                      <td className="px-3 py-3 text-center text-gray-300">{s.GF}</td>
                      <td className="px-3 py-3 text-center text-gray-300">{s.GA}</td>
                      <td className={`px-3 py-3 text-center font-medium ${gdColor(gd)}`}>
                        {gd > 0 ? '+' : ''}{gd}
                      </td>
                      <td className="px-3 py-3 text-center font-black text-white">{s.Pts}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-center">
                          {s.form.slice(-5).map((r, ri) => (
                            <span
                              key={ri}
                              title={r === 'W' ? 'Win' : r === 'D' ? 'Draw' : 'Loss'}
                              className={`w-5 h-5 rounded-full ${formBg(r)} flex items-center justify-center text-white font-bold`}
                              style={{ fontSize: '9px' }}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-800 flex flex-wrap gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1.5"><span className="text-yellow-400">🏆</span> Champions</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Top 3 · Continental Spots</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Relegation Zone</span>
          </div>
        </div>

        {/* ── TEAMS ── */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <span>👥</span> Club Ratings
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TEAMS.map(t => (
              <div key={t.id} className="bg-gray-800 rounded-xl p-3 space-y-2">
                <div className="text-2xl">{t.flag}</div>
                <div className="text-xs font-bold text-white leading-tight">{t.name}</div>
                <div className="space-y-1.5">
                  {[['ATK', t.attack, 'bg-orange-500'], ['DEF', t.defense, 'bg-blue-500']].map(([lbl, val, cls]) => (
                    <div key={lbl} className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 w-6">{lbl}</span>
                      <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                        <div className={`${cls} h-1.5 rounded-full`} style={{ width: `${(val / 5) * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-500 tabular-nums">{val}/5</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MATCH HISTORY ── */}
        {history.length > 1 && (
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <h2 className="font-bold text-white mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><span>📋</span> All Results</span>
              <span className="text-xs text-gray-500 font-normal">{history.length} rounds</span>
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {[...history].reverse().map(h => (
                <div key={h.round}>
                  <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">Round {h.round}</div>
                  <div className="grid sm:grid-cols-2 gap-1.5">
                    {h.results.map((r, i) => {
                      const home = teamById[r.hId], away = teamById[r.aId]
                      return (
                        <div key={i} className="bg-gray-800/60 rounded-lg px-3 py-1.5 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-xs">
                          <span className="text-right text-gray-300 truncate"><span className="mr-1">{home.flag}</span>{home.name}</span>
                          <span className="font-black text-white tabular-nums">{r.hg}–{r.ag}</span>
                          <span className="text-gray-300 truncate">{away.name}<span className="ml-1">{away.flag}</span></span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
