'use client'
import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import MacroBar from '@/components/MacroBar'
import { DISHES, getMealForTime, MEAL_TYPES } from '@/lib/mockData'
import { addEntry, getTodayStr } from '@/lib/storage'

function ResultContent() {
  const params = useSearchParams()
  const router = useRouter()
  const dishId = params.get('dish') || 'chicken-rice'
  const confidence = parseInt(params.get('confidence') || '87', 10)
  const dish = DISHES[dishId] || DISHES['chicken-rice']

  const [showMealPicker, setShowMealPicker] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState(getMealForTime())
  const [showAltPicker, setShowAltPicker] = useState(false)
  const [logged, setLogged] = useState(false)

  const confColor = confidence >= 85 ? 'text-green-600 bg-green-50' : confidence >= 65 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50'
  const confLabel = confidence >= 85 ? '✓ High confidence' : confidence >= 65 ? '~ Moderate confidence' : '? Low confidence'

  const logIt = () => {
    addEntry({
      date: getTodayStr(),
      dishId: dish.id,
      name: dish.name,
      emoji: dish.emoji,
      calories: dish.baseCalories,
      macros: { ...dish.macros },
      meal: selectedMeal,
      modifications: ['Standard portion'],
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
          <p className="text-gray-500">Adding {dish.name} to your log…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-28">
      <header className="glass border-b border-orange-100/60 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/scan" className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-bold text-gray-900">AI Result</h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 rounded-lg px-3 py-1.5">
              <span>🤖</span> AI Detected
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${confColor}`}>
              {confLabel} · {confidence}%
            </div>
          </div>

          <div className="flex items-center gap-5 mb-5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0 shadow-sm" style={{ backgroundColor: dish.bgColor }}>
              {dish.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{dish.flag}</span>
                <span className="text-xs text-gray-400">{dish.origin}</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">{dish.name}</h2>
            </div>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-4">{dish.description}</p>

          <div className="flex flex-wrap gap-2">
            {dish.tags.map(tag => (
              <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm font-semibold text-gray-500">Estimated Calories</span>
            <span className="text-xs text-gray-400">Base estimate</span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-6xl font-black text-gray-900 tabular-nums">{dish.baseCalories}</span>
            <span className="text-xl text-gray-400 font-semibold">kcal</span>
          </div>

          <h3 className="text-sm font-bold text-gray-700 mb-3">Macronutrients</h3>
          <MacroBar {...dish.macros} />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Log as</p>
          <div className="grid grid-cols-4 gap-2">
            {MEAL_TYPES.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMeal(m.id)}
                className={`rounded-xl py-2.5 text-center transition-all ${
                  selectedMeal === m.id
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
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
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-orange-200 transition-all hover:shadow-orange-300 active:scale-[0.98]"
        >
          ✅ Log {dish.baseCalories} kcal
        </button>
      </div>

      <BottomNav />
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    }>
      <ResultContent />
    </Suspense>
  )
}
