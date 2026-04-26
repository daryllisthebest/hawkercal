'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import CalorieRing from '@/components/CalorieRing'
import MacroBar from '@/components/MacroBar'
import { getLogByDate, removeEntry, getCalorieGoal, setCalorieGoal, seedDemoData, getTodayStr, getDateStr, formatDate } from '@/lib/storage'
import { MEAL_TYPES } from '@/lib/mockData'

function dateOffset(base, days) {
  const d = new Date(base + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return getDateStr(d)
}

export default function LogPage() {
  const [today] = useState(getTodayStr)
  const [viewDate, setViewDate] = useState(getTodayStr)
  const [entries, setEntries] = useState([])
  const [goal, setGoal] = useState(2000)
  const [showGoalEditor, setShowGoalEditor] = useState(false)
  const [goalInput, setGoalInput] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    seedDemoData()
    setGoal(getCalorieGoal())
    setEntries(getLogByDate(getTodayStr()))
  }, [])

  useEffect(() => {
    if (mounted) setEntries(getLogByDate(viewDate))
  }, [viewDate, mounted])

  const refresh = () => setEntries(getLogByDate(viewDate))
  const isToday = viewDate === today

  const totalCal = entries.reduce((s, e) => s + (e.calories || 0), 0)
  const totalMacros = entries.reduce(
    (acc, e) => ({
      protein: acc.protein + (e.macros?.protein || 0),
      carbs: acc.carbs + (e.macros?.carbs || 0),
      fat: acc.fat + (e.macros?.fat || 0),
      fiber: acc.fiber + (e.macros?.fiber || 0),
    }),
    { protein: 0, carbs: 0, fat: 0, fiber: 0 }
  )

  const byMeal = MEAL_TYPES.map(m => ({
    ...m,
    items: entries.filter(e => e.meal === m.id),
    total: entries.filter(e => e.meal === m.id).reduce((s, e) => s + (e.calories || 0), 0),
  })).filter(m => m.items.length > 0)

  const handleDelete = (id) => {
    removeEntry(id)
    setDeleteId(null)
    refresh()
  }

  const saveGoal = () => {
    const val = parseInt(goalInput, 10)
    if (val > 0) { setGoal(val); setCalorieGoal(val) }
    setShowGoalEditor(false)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-28">

      <header className="glass border-b border-orange-100/60 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍜</span>
            <span className="font-black text-gray-900">HawkerCal <span className="text-orange-500">AI</span></span>
          </div>
          <Link href="/pricing" className="w-8 h-8 flex items-center justify-center">
            <span className="text-xs bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-2 py-1 rounded-lg">PRO</span>
          </Link>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-5 space-y-4">

        <div className="flex items-center justify-between">
          <button
            onClick={() => setViewDate(dateOffset(viewDate, -1))}
            className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 text-gray-600 hover:text-gray-900 active:scale-90 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => setViewDate(today)}
            className="flex flex-col items-center"
          >
            <span className="text-base font-black text-gray-900">
              {isToday ? 'Today' : formatDate(viewDate)}
            </span>
            {!isToday && (
              <span className="text-xs text-orange-500 font-semibold">Tap to go to today</span>
            )}
          </button>

          <button
            onClick={() => setViewDate(dateOffset(viewDate, 1))}
            disabled={viewDate >= today}
            className={`w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 transition-all active:scale-90 ${
              viewDate >= today ? 'opacity-30 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-bold text-gray-700">Daily Calories</h2>
            <button
              onClick={() => { setGoalInput(String(goal)); setShowGoalEditor(true) }}
              className="text-xs text-orange-500 font-semibold hover:text-orange-600"
            >
              Goal: {goal.toLocaleString()} kcal ✎
            </button>
          </div>

          <div className="flex items-center justify-between">
            <CalorieRing consumed={totalCal} goal={goal} size={160} />

            <div className="flex-1 pl-5 space-y-1">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Macros Today</div>
              {[
                { label: 'Protein', val: totalMacros.protein, unit: 'g', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Carbs', val: totalMacros.carbs, unit: 'g', color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'Fat', val: totalMacros.fat, unit: 'g', color: 'text-yellow-600', bg: 'bg-yellow-50' },
                { label: 'Fibre', val: totalMacros.fiber, unit: 'g', color: 'text-green-600', bg: 'bg-green-50' },
              ].map(m => (
                <div key={m.label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{m.label}</span>
                  <span className={`text-xs font-black tabular-nums ${m.color}`}>{m.val}g</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <MacroBar {...totalMacros} compact />
          </div>

          {totalCal === 0 ? (
            <div className="mt-4 bg-orange-50 rounded-xl p-3 text-center">
              <p className="text-sm text-orange-600 font-semibold">No meals logged yet{isToday ? ' today' : ' on this day'}</p>
            </div>
          ) : null}
        </div>

        {byMeal.length > 0 ? (
          byMeal.map(meal => (
            <div key={meal.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-base">{meal.icon}</span>
                  <span className="text-sm font-bold text-gray-800">{meal.label}</span>
                </div>
                <span className="text-sm font-black text-orange-500 tabular-nums">{meal.total} kcal</span>
              </div>

              <div className="divide-y divide-gray-50">
                {meal.items.map(entry => (
                  <div key={entry.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors group">
                    <div className="text-2xl">{entry.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-900 truncate">{entry.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-gray-900 tabular-nums">{entry.calories}</div>
                      <div className="text-[10px] text-gray-400">kcal</div>
                    </div>
                    <button
                      onClick={() => setDeleteId(entry.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : null}

      </div>

      {showGoalEditor && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowGoalEditor(false)} />
          <div className="relative bg-white w-full max-w-md mx-auto rounded-t-3xl p-6 pb-10">
            <h3 className="text-xl font-black text-gray-900 mb-1">Daily Calorie Goal</h3>
            <div className="flex gap-3 mb-4">
              {[1500, 1800, 2000, 2200, 2500].map(v => (
                <button
                  key={v}
                  onClick={() => setGoalInput(String(v))}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                    goalInput === String(v) ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-100 text-gray-600'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                type="number"
                value={goalInput}
                onChange={e => setGoalInput(e.target.value)}
                className="flex-1 border-2 border-gray-200 focus:border-orange-400 rounded-xl px-4 py-3 text-sm font-semibold outline-none transition-colors"
              />
              <button
                onClick={saveGoal}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-xs text-center shadow-xl">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-lg font-black text-gray-900 mb-2">Remove this entry?</h3>
            <p className="text-sm text-gray-500 mb-5">This can't be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-2xl border-2 border-gray-200 font-bold text-gray-600">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-bold">Remove</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
