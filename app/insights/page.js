'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { getWeeklyData, getWeeklyAverage, getCalorieGoal, getStreak, getTopDishes, getWeeklyInsights, seedDemoData } from '@/lib/storage'

function MiniBar({ value, max, color = 'bg-orange-400' }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function SuggestionCard({ suggestion }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-3">
      <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
        {suggestion.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-sm font-bold text-gray-900">{suggestion.title}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${suggestion.tagColor}`}>
            {suggestion.tag}
          </span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{suggestion.body}</p>
        {suggestion.impact > 0 && (
          <p className="text-xs font-black text-green-600 mt-1.5">
            💚 Saves ~{suggestion.impact} kcal/week
          </p>
        )}
      </div>
    </div>
  )
}

export default function InsightsPage() {
  const [mounted, setMounted] = useState(false)
  const [weeklyData, setWeeklyData] = useState([])
  const [goal, setGoal] = useState(2000)
  const [streak, setStreak] = useState(0)
  const [topDishes, setTopDishes] = useState([])
  const [insights, setInsights] = useState(null)

  useEffect(() => {
    setMounted(true)
    seedDemoData()
    setWeeklyData(getWeeklyData())
    setGoal(getCalorieGoal())
    setStreak(getStreak())
    setTopDishes(getTopDishes())
    setInsights(getWeeklyInsights())
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    )
  }

  const maxCal = Math.max(...weeklyData.map(d => d.calories), goal, 500)
  const daysLogged = weeklyData.filter(d => d.calories > 0).length
  const goalDays = weeklyData.filter(d => d.calories > 0 && d.calories <= goal).length
  const highestDay = insights?.highestDay

  return (
    <div className="min-h-screen bg-orange-50 pb-28">

      <header className="glass border-b border-orange-100/60 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-75 transition-opacity">
            <span className="text-xl">📊</span>
            <h1 className="font-bold text-gray-900">Weekly Insights</h1>
          </Link>
          <Link href="/pricing" className="text-xs bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm">
            Upgrade ✨
          </Link>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-5 space-y-4">

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-black text-orange-500 tabular-nums">{streak}</div>
            <div className="text-[10px] text-gray-500 mt-0.5 font-semibold leading-tight">Day streak 🔥</div>
          </div>
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-black text-gray-900 tabular-nums">{daysLogged}</div>
            <div className="text-[10px] text-gray-500 mt-0.5 font-semibold leading-tight">Days logged</div>
          </div>
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 text-center">
            <div className={`text-3xl font-black tabular-nums ${goalDays >= 5 ? 'text-green-500' : goalDays >= 3 ? 'text-amber-500' : 'text-orange-500'}`}>
              {goalDays}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5 font-semibold leading-tight">Under goal</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-gray-900">7-Day Overview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Your calorie intake this week</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-orange-500 tabular-nums">
                {insights?.avgCal > 0 ? insights.avgCal.toLocaleString() : '—'}
              </div>
              <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">avg kcal / day</div>
            </div>
          </div>

          <div className="flex items-end gap-1.5 h-32 relative mb-2">
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-orange-200 pointer-events-none z-10"
              style={{ bottom: `${(goal / maxCal) * 100}%` }}
            />
            {weeklyData.map(day => {
              const heightPct = day.calories > 0 ? Math.max((day.calories / maxCal) * 100, 3) : 0
              const isOver = day.calories > goal
              const barColor = day.isToday
                ? (isOver ? '#EF4444' : '#F97316')
                : (isOver ? '#FCA5A5' : '#FED7AA')

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                  <div
                    className={`text-[9px] font-black tabular-nums ${day.calories > 0 ? 'text-gray-600' : 'text-transparent'}`}
                  >
                    {day.calories > 0 ? (day.calories >= 1000 ? `${(day.calories / 1000).toFixed(1)}k` : day.calories) : '·'}
                  </div>
                  <div className="w-full relative" style={{ height: `${heightPct}%`, minHeight: day.calories > 0 ? 6 : 0 }}>
                    <div
                      className="w-full h-full rounded-t-lg transition-all duration-700"
                      style={{ backgroundColor: barColor }}
                    />
                  </div>
                  <span className={`text-[10px] font-bold ${day.isToday ? 'text-orange-600' : 'text-gray-400'}`}>
                    {day.shortLabel}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-4 h-0.5 border-t-2 border-dashed border-orange-300" />
            <span className="text-[10px] text-orange-500 font-semibold">Goal: {goal.toLocaleString()} kcal/day</span>
          </div>

          {highestDay?.calories > 0 && (
            <div className="mt-4 bg-orange-50 rounded-2xl p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Highest calorie day</p>
                <p className="text-sm font-bold text-gray-900">{highestDay.label}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-orange-500 tabular-nums">{highestDay.calories.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">kcal</p>
              </div>
            </div>
          )}
        </div>

        {topDishes.length > 0 && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-1">Most Logged This Week</h2>
            <p className="text-xs text-gray-400 mb-4">Your go-to hawker dishes</p>
            <div className="space-y-3">
              {topDishes.map((d, i) => (
                <div key={d.dishId || d.name} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${
                    i === 0 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {i + 1}
                  </div>
                  <span className="text-xl flex-shrink-0">{d.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-800">{d.name}</div>
                    <MiniBar value={d.count} max={topDishes[0].count + 1} color={i === 0 ? 'bg-orange-400' : 'bg-gray-300'} />
                  </div>
                  <span className="text-xs font-black text-gray-500 flex-shrink-0 tabular-nums">
                    {d.count}×
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {insights && insights.drinkCal > 0 && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-gray-900">Drink Calories</h2>
              <span className="text-xs font-black text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                {insights.drinkPct}% of week
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Your drinks contributed{' '}
              <strong className="text-gray-700">{insights.drinkPct}% of your weekly calories</strong>
              {insights.drinkPct >= 20 ? ' — more than you might think!' : '.'}
            </p>

            <div className="flex items-center gap-5 mb-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#F3F4F6" strokeWidth="10" />
                  <circle
                    cx="40" cy="40" r="30"
                    fill="none" stroke="#A855F7" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 30}`}
                    strokeDashoffset={`${2 * Math.PI * 30 * (1 - insights.drinkPct / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-black text-purple-600">{insights.drinkPct}%</span>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                {insights.drinkBreakdown.map(d => (
                  <div key={d.name}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-gray-600">{d.emoji} {d.name}</span>
                      <span className="text-xs font-black text-gray-900 tabular-nums">{d.cal} kcal</span>
                    </div>
                    <MiniBar value={d.cal} max={insights.drinkCal} color="bg-purple-400" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-3 border border-purple-100">
              <p className="text-xs text-purple-700 font-semibold">
                💡 Total drink calories this week: <span className="font-black">{insights.drinkCal} kcal</span>
              </p>
            </div>
          </div>
        )}

        {insights?.hiddenSource && (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{insights.hiddenSource.icon}</span>
              <h2 className="text-base font-bold text-amber-900">Biggest Hidden Calorie Source</h2>
            </div>
            <p className="text-sm text-amber-800 leading-relaxed mb-3">
              Your biggest hidden calorie source was{' '}
              <strong>{insights.hiddenSource.label.toLowerCase()}</strong> — adding an estimated{' '}
              <strong>{insights.hiddenSource.kcal}+ hidden kcal</strong> through cooking oils, sauces, and methods.
            </p>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs font-semibold text-amber-700 mb-1">
                  <span>Logged calories</span>
                  <span>{insights.totalWeekCal.toLocaleString()} kcal</span>
                </div>
                <div className="h-3 bg-amber-200 rounded-full">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-amber-700 mb-1">
                  <span>+ Estimated hidden</span>
                  <span>~{Math.round(insights.totalWeekCal * 0.12)}–{Math.round(insights.totalWeekCal * 0.18)} kcal</span>
                </div>
                <div className="h-3 bg-amber-200 rounded-full">
                  <div className="h-full bg-amber-300 rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {insights?.suggestions?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">🤖</span>
              <h2 className="text-base font-bold text-gray-900">Smart Suggestions</h2>
            </div>
            <div className="space-y-3">
              {insights.suggestions.map((s, i) => (
                <SuggestionCard key={i} suggestion={s} />
              ))}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-gray-950 to-gray-900 rounded-3xl p-5 text-white text-center shadow-lg">
          <p className="text-2xl mb-3">📸</p>
          <h3 className="text-base font-black text-white mb-1.5">Keep tracking to unlock more insights</h3>
          <p className="text-xs text-gray-400 mb-4">The more you log, the smarter your weekly report gets.</p>
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
          >
            Log a Meal →
          </Link>
        </div>

      </div>

      <BottomNav />
    </div>
  )
}
