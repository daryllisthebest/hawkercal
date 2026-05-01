'use client'

export const dynamic = 'force-dynamic'

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

function getMotivationalMessage(consumed, goal) {
  const pct = consumed / goal
  if (pct === 0) return { text: 'Ready to fuel up! Log your first meal 🍜', emoji: '🌅' }
  if (pct < 0.5) return { text: 'Great start! You\'re building momentum 💪', emoji: '🌅' }
  if (pct < 0.8) return { text: 'You\'re on track! Making great progress 🎯', emoji: '☀️' }
  if (pct < 1) return { text: 'Almost there! Just a small snack left ✨', emoji: '🌙' }
  return { text: 'You\'ve had a full, energizing day! 🌟', emoji: '🌙' }
}

function getHiddenCalorieEstimate(entries) {
  const hiddenCalorieMap = {
    'chicken-rice': { min: 50, max: 160, reason: 'Chicken skin, oil in rice, sauce' },
    'nasi-lemak': { min: 80, max: 150, reason: 'Coconut, sambal, fried items' },
    'char-kway-teow': { min: 100, max: 160, reason: 'Lard, dark soy sauce, seafood oil' },
    'laksa': { min: 80, max: 160, reason: 'Coconut cream, tofu puffs absorb oil' },
    'cai-png': { min: 60, max: 120, reason: 'Oil in braised dishes, gravy' },
    'pad-thai': { min: 60, max: 120, reason: 'Peanuts, palm sugar, wok oil' },
    'pho': { min: 40, max: 120, reason: 'Beef fat in broth, hoisin/sriracha' },
    'nasi-goreng': { min: 80, max: 140, reason: 'Kecap manis, fried egg, oil' },
    'bubble-tea': { min: 20, max: 100, reason: 'Tapioca pearls, sugar, condensed milk' },
    'roti-prata': { min: 40, max: 100, reason: 'Ghee/butter, oil for frying' },
    'hokkien-mee': { min: 60, max: 140, reason: 'Lard on top, pork stock oil' },
    'satay': { min: 40, max: 120, reason: 'Peanut sauce, marinades with sugar' },
    'rendang': { min: 80, max: 140, reason: 'Coconut cream, oil absorbed in meat' },
    'mee-goreng': { min: 60, max: 120, reason: 'Oil in frying, ketchup/sauce' },
    'tom-yum': { min: 40, max: 100, reason: 'Coconut milk, shrimp paste oil' },
    'green-curry': { min: 80, max: 140, reason: 'Coconut milk, curry paste oil' },
    'soto-ayam': { min: 60, max: 120, reason: 'Coconut milk, fried shallots' },
    'banh-mi': { min: 60, max: 120, reason: 'Mayo, pâté, butter on bread' },
    'bun-cha': { min: 60, max: 140, reason: 'Pork meatballs fat, peanut sauce' },
    'com-tam': { min: 60, max: 140, reason: 'Grilled pork, fried egg, pâté' },
    'adobo': { min: 80, max: 160, reason: 'Pork fat, coconut milk, oil' },
    'kare-kare': { min: 100, max: 160, reason: 'Peanut butter, oil, meat fat' },
  }

  let totalMin = 0, totalMax = 0
  entries.forEach(e => {
    const hidden = hiddenCalorieMap[e.dishId] || { min: 40, max: 80 }
    totalMin += hidden.min
    totalMax += hidden.max
  })
  return { min: totalMin, max: totalMax }
}

function getBiggestCalorieSource(entries) {
  if (entries.length === 0) return null
  const sorted = [...entries].sort((a, b) => (b.calories || 0) - (a.calories || 0))
  const biggest = sorted[0]
  const total = entries.reduce((s, e) => s + (e.calories || 0), 0)
  const pct = Math.round((biggest.calories / total) * 100)
  return { ...biggest, pct }
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
  const remaining = Math.max(goal - totalCal, 0)
  const pctOfGoal = Math.min(totalCal / goal, 1)

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

  const hiddenCals = getHiddenCalorieEstimate(entries)
  const biggestSource = getBiggestCalorieSource(entries)
  const motivation = getMotivationalMessage(totalCal, goal)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

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
          <Link href="/" className="flex items-center gap-2 hover:opacity-75 transition-opacity">
            <span className="text-xl">🍜</span>
            <span className="font-black text-gray-900">HawkerCal <span className="text-orange-500">AI</span></span>
          </Link>
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

          <button onClick={() => setViewDate(today)} className="flex flex-col items-center">
            <span className="text-base font-black text-gray-900">
              {isToday ? 'Today' : formatDate(viewDate)}
            </span>
            {!isToday && <span className="text-xs text-orange-500 font-semibold">Tap for today</span>}
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

        {isToday && totalCal > 0 && (
          <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-200/40 rounded-2xl p-4 text-center">
            <p className="text-sm font-bold text-gray-900">{greeting}! 👋</p>
            <p className="text-sm text-orange-600 font-semibold mt-1">{motivation.text}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-1">
            <CalorieRing consumed={totalCal} goal={goal} size={140} />

            <div className="flex-1">
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Remaining Today</p>
                <p className="text-4xl font-black text-orange-500 leading-tight tabular-nums">{remaining}</p>
                <p className="text-xs text-gray-500 mt-0.5">out of {goal.toLocaleString()} kcal</p>
              </div>

              <button
                onClick={() => { setGoalInput(String(goal)); setShowGoalEditor(true) }}
                className="text-xs text-orange-500 font-semibold hover:text-orange-600 transition-colors"
              >
                Edit goal ✎
              </button>
            </div>
          </div>
        </div>

        {totalCal > 0 && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Macro Breakdown</p>
            <MacroBar {...totalMacros} />
          </div>
        )}

        {totalCal > 0 && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/40 rounded-3xl p-5 space-y-4">
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">🤖 AI Insights</p>

            {biggestSource && (
              <div className="bg-white/60 rounded-2xl p-3 backdrop-blur-sm">
                <p className="text-xs text-gray-500 mb-1">Biggest calorie source</p>
                <p className="text-sm font-bold text-gray-900">
                  {biggestSource.emoji} {biggestSource.name}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  <span className="font-black text-purple-600">{biggestSource.calories} kcal</span>
                  {' '} ({biggestSource.pct}% of your total)
                </p>
              </div>
            )}

            {hiddenCals.min > 0 && (
              <div className="bg-white/60 rounded-2xl p-3 backdrop-blur-sm border border-amber-200/50">
                <p className="text-xs text-gray-500 mb-1">Possible hidden calories</p>
                <p className="text-sm font-bold text-amber-700">
                  {hiddenCals.min}–{hiddenCals.max} extra kcal
                </p>
                <p className="text-xs text-gray-600 mt-1">From oils, sauces, and cooking methods in your meals</p>
              </div>
            )}
          </div>
        )}

        {byMeal.length > 0 ? (
          byMeal.map(meal => (
            <div key={meal.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{meal.icon}</span>
                  <span className="text-sm font-bold text-gray-800">{meal.label}</span>
                </div>
                <span className="text-sm font-black text-orange-500 tabular-nums">{meal.total} kcal</span>
              </div>

              <div className="divide-y divide-gray-50">
                {meal.items.map(entry => (
                  <div key={entry.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-orange-50/50 transition-colors group">
                    <div className="text-2xl flex-shrink-0">{entry.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-900">{entry.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {entry.modifications?.slice(0, 1).join(', ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-black text-gray-900 tabular-nums">{entry.calories}</div>
                        <div className="text-[10px] text-gray-400">kcal</div>
                      </div>
                      <button
                        onClick={() => setDeleteId(entry.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-3xl p-8 text-center">
            <p className="text-lg font-black text-gray-900 mb-2">No meals logged yet</p>
            <p className="text-sm text-gray-600 mb-5">Start tracking by scanning your first meal!</p>
            <Link
              href="/scan"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold transition-colors"
            >
              📸 Log a Meal
            </Link>
          </div>
        )}

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
