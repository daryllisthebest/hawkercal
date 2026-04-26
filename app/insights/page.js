'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { getWeeklyData, getWeeklyAverage, getCalorieGoal, getStreak, getTopDishes, seedDemoData } from '@/lib/storage'

const TIPS = [
  { icon: '💧', title: 'Watch the broth', body: 'Laksa and prawn mee broths can add 100–200 kcal.' },
  { icon: '🍚', title: 'Rice is the big variable', body: 'One extra scoop of rice is ~130 kcal.' },
  { icon: '🥥', title: 'Coconut is calorie-dense', body: 'Coconut milk in Nasi Lemak and curries adds up fast.' },
  { icon: '🌶️', title: 'Sambal is your friend', body: 'Sambal chilli is naturally low in calories and high in flavour.' },
  { icon: '🍳', title: 'Fried vs steamed', body: 'Choosing steamed chicken over fried can save 100–200 kcal.' },
  { icon: '🧋', title: 'Rethink the bubble tea', body: 'A regular bubble tea can be 400–500 kcal.' },
]

export default function InsightsPage() {
  const [mounted, setMounted] = useState(false)
  const [weeklyData, setWeeklyData] = useState([])
  const [avg, setAvg] = useState(0)
  const [goal, setGoal] = useState(2000)
  const [streak, setStreak] = useState(0)
  const [topDishes, setTopDishes] = useState([])

  useEffect(() => {
    setMounted(true)
    seedDemoData()
    const data = getWeeklyData()
    setWeeklyData(data)
    setAvg(getWeeklyAverage())
    setGoal(getCalorieGoal())
    setStreak(getStreak())
    setTopDishes(getTopDishes())
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
  const totalWeekCal = weeklyData.reduce((s, d) => s + d.calories, 0)
  const goalDays = weeklyData.filter(d => d.calories > 0 && d.calories <= goal).length

  const tip = TIPS[Math.floor(Date.now() / 86400000) % TIPS.length]

  return (
    <div className="min-h-screen bg-orange-50 pb-28">

      <header className="glass border-b border-orange-100/60 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h1 className="font-bold text-gray-900">Weekly Insights</h1>
          </div>
          <Link href="/pricing" className="text-xs bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm">
            Upgrade ✨
          </Link>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-5 space-y-4">

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-black text-orange-500">{streak}</div>
            <div className="text-[11px] text-gray-500 mt-0.5 font-medium">Day streak 🔥</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-black text-gray-900">{daysLogged}</div>
            <div className="text-[11px] text-gray-500 mt-0.5 font-medium">Days logged</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <div className={`text-3xl font-black ${goalDays >= 5 ? 'text-green-500' : goalDays >= 3 ? 'text-amber-500' : 'text-red-500'}`}>
              {goalDays}
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5 font-medium">In-goal days</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-gray-900">7-Day Calorie Chart</h2>
              <p className="text-xs text-gray-400 mt-0.5">Bars show daily intake vs your goal</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-gray-900 tabular-nums">{avg > 0 ? avg.toLocaleString() : '—'}</div>
              <div className="text-xs text-gray-400">avg kcal/day</div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-0.5 bg-orange-300 border-t-2 border-dashed border-orange-300" />
            <span className="text-[10px] text-orange-500 font-semibold">Goal: {goal.toLocaleString()} kcal</span>
          </div>

          <div className="flex items-end gap-2.5 h-36 relative">
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-orange-200 pointer-events-none z-10"
              style={{ bottom: `${(goal / maxCal) * 100}%` }}
            />

            {weeklyData.map(day => {
              const heightPct = day.calories > 0 ? Math.max((day.calories / maxCal) * 100, 4) : 0
              const isOver = day.calories > goal
              const barColor = isOver ? '#EF4444' : day.isToday ? '#F97316' : '#FED7AA'

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                  <div className="w-full relative" style={{ height: `${heightPct}%` }}>
                    <div
                      className="w-full h-full rounded-t-lg transition-all duration-700"
                      style={{ backgroundColor: barColor, minHeight: day.calories > 0 ? 6 : 0 }}
                    />
                  </div>
                  <span className={`text-[10px] font-bold ${day.isToday ? 'text-orange-600' : 'text-gray-500'}`}>{day.shortLabel}</span>
                </div>
              )
            })}
          </div>
        </div>

        {topDishes.length > 0 && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-4">Your Most Logged Dishes</h2>
            <div className="space-y-3">
              {topDishes.map((d, i) => (
                <div key={d.dishId || d.name} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-xs font-black text-orange-600">
                    {i + 1}
                  </div>
                  <span className="text-xl">{d.emoji}</span>
                  <span className="flex-1 text-sm font-semibold text-gray-800">{d.name}</span>
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    {d.count}× logged
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-5 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
              {tip.icon}
            </div>
            <div>
              <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">Tip of the Day</div>
              <h3 className="text-base font-bold text-white mb-1.5">{tip.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{tip.body}</p>
            </div>
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  )
}
