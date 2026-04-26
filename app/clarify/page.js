'use client'
import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import MacroBar from '@/components/MacroBar'
import { DISHES, getMealForTime, MEAL_TYPES } from '@/lib/mockData'
import { addEntry, getTodayStr } from '@/lib/storage'

function ClarifyContent() {
  const params = useSearchParams()
  const router = useRouter()
  const dishId = params.get('dish') || 'chicken-rice'
  const baseCalories = parseInt(params.get('cal') || '480', 10)
  const dish = DISHES[dishId] || DISHES['chicken-rice']

  const [step, setStep] = useState(0)
  const [totalModifier, setTotalModifier] = useState(0)
  const [meal, setMeal] = useState(getMealForTime())
  const [phase, setPhase] = useState('questions')
  const [logged, setLogged] = useState(false)

  const finalCalories = Math.max(baseCalories + totalModifier, 80)

  const logIt = () => {
    const scaleFactor = finalCalories / baseCalories
    const scaledMacros = {
      protein: Math.round(dish.macros.protein * scaleFactor),
      carbs: Math.round(dish.macros.carbs * scaleFactor),
      fat: Math.round(dish.macros.fat * scaleFactor),
      fiber: Math.round(dish.macros.fiber * scaleFactor),
    }
    addEntry({
      date: getTodayStr(),
      dishId: dish.id,
      name: dish.name,
      emoji: dish.emoji,
      calories: finalCalories,
      macros: scaledMacros,
      meal,
      modifications: ['Refined portion'],
    })
    setLogged(true)
    setTimeout(() => router.push('/log'), 1200)
  }

  if (logged) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 animate-bounce">✅</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Logged!</h2>
          <p className="text-gray-500">Adding {finalCalories} kcal to your log…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-28">
      <header className="glass border-b border-orange-100/60 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/log" className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-bold text-gray-900 text-sm">Refine Estimate</h1>
          <div className="w-9 flex items-center justify-center">
            <span className="text-xl">{dish.emoji}</span>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        <div className="bg-white rounded-2xl px-5 py-3 flex items-center justify-between shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-base">{dish.emoji}</span>
            <span>{dish.name}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-orange-500 tabular-nums">
              {Math.max(baseCalories + totalModifier, 80)}
            </span>
            <span className="text-xs text-gray-400">kcal</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl mx-auto mb-4 shadow-sm" style={{ backgroundColor: dish.bgColor }}>
            {dish.emoji}
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">{dish.name}</h2>

          <div className="flex items-baseline justify-center gap-2 my-4">
            <span className="text-6xl font-black text-orange-500 tabular-nums">{finalCalories}</span>
            <span className="text-xl text-gray-400">kcal</span>
          </div>

          <div className="text-left">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Estimated macros</p>
            <MacroBar
              protein={Math.round(dish.macros.protein * (finalCalories / baseCalories))}
              carbs={Math.round(dish.macros.carbs * (finalCalories / baseCalories))}
              fat={Math.round(dish.macros.fat * (finalCalories / baseCalories))}
              fiber={Math.round(dish.macros.fiber * (finalCalories / baseCalories))}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Log as</p>
          <div className="grid grid-cols-4 gap-2">
            {MEAL_TYPES.map(m => (
              <button
                key={m.id}
                onClick={() => setMeal(m.id)}
                className={`rounded-xl py-2.5 text-center transition-all ${
                  meal === m.id
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-orange-50'
                }`}
              >
                <div className="text-base">{m.icon}</div>
                <div className="text-[10px] font-bold mt-0.5">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={logIt}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
        >
          ✅ Log {finalCalories} kcal
        </button>
      </div>

      <BottomNav />
    </div>
  )
}

export default function ClarifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    }>
      <ClarifyContent />
    </Suspense>
  )
}
