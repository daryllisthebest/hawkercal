'use client'

export const dynamic = 'force-dynamic'

import { Suspense, useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import MacroBar from '@/components/MacroBar'
import { DISHES, getMealForTime, MEAL_TYPES } from '@/lib/mockData'
import { addEntry, getTodayStr, getCustomDishes } from '@/lib/storage'

function QuestionBlock({ question, answer, onSingle, onMulti }) {
  const isMulti = question.type === 'multi'
  const selected = isMulti ? (answer || []) : answer

  return (
    <div>
      <div className="mb-2">
        <p className="text-sm font-bold text-gray-900">{question.question}</p>
        {question.subtitle && (
          <p className="text-xs text-gray-400 mt-0.5">{question.subtitle}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {question.options.map(opt => {
          const isSelected = isMulti
            ? selected.includes(opt.id)
            : selected === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => isMulti ? onMulti(question.id, opt.id, question.options) : onSingle(question.id, opt.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-left transition-all active:scale-[0.97] ${
                isSelected
                  ? 'border-orange-400 bg-orange-50 shadow-sm'
                  : 'border-gray-100 bg-gray-50 hover:border-orange-200 hover:bg-orange-50/50'
              }`}
            >
              <span className="text-lg flex-shrink-0">{opt.icon}</span>
              <div className="min-w-0">
                <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-orange-700' : 'text-gray-800'}`}>
                  {opt.label}
                </div>
                {opt.desc && (
                  <div className="text-[10px] text-gray-400 leading-tight mt-0.5 truncate">{opt.desc}</div>
                )}
              </div>
              {opt.modifier !== 0 && (
                <span className={`ml-auto text-[10px] font-black flex-shrink-0 ${opt.modifier > 0 ? 'text-red-400' : 'text-green-500'}`}>
                  {opt.modifier > 0 ? '+' : ''}{opt.modifier}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ResultContent() {
  const params = useSearchParams()
  const router = useRouter()
  const dishId = params.get('dish') || 'chicken-rice'
  const confidence = parseInt(params.get('confidence') || '87', 10)

  const [dish, setDish] = useState(() => DISHES[dishId] || DISHES['chicken-rice'])
  const [answers, setAnswers] = useState({})
  const [selectedMeal, setSelectedMeal] = useState(getMealForTime())
  const [logged, setLogged] = useState(false)
  const [scanPhoto, setScanPhoto] = useState(null)

  useEffect(() => {
    const photo = sessionStorage.getItem('lastScanPhoto')
    if (photo) setScanPhoto(photo)
  }, [])

  useEffect(() => {
    if (!DISHES[dishId]) {
      const found = getCustomDishes().find(d => d.id === dishId)
      if (found) setDish(found)
    }
  }, [dishId])

  const hasQuestions = dish.questions?.length > 0
  const answeredCount = Object.keys(answers).length
  const allAnswered = hasQuestions && answeredCount >= dish.questions.length

  const { adjustedCalories, totalAdjustment } = useMemo(() => {
    if (!hasQuestions) return { adjustedCalories: dish.baseCalories, totalAdjustment: 0 }
    let adj = 0
    dish.questions.forEach(q => {
      const ans = answers[q.id]
      if (!ans) return
      if (q.type === 'single') {
        const opt = q.options.find(o => o.id === ans)
        if (opt) adj += opt.modifier
      } else {
        ;(Array.isArray(ans) ? ans : [ans]).forEach(id => {
          const opt = q.options.find(o => o.id === id)
          if (opt) adj += opt.modifier
        })
      }
    })
    return {
      adjustedCalories: Math.max(dish.baseCalories + adj, 80),
      totalAdjustment: adj,
    }
  }, [answers, dish, hasQuestions])

  const scaleFactor = adjustedCalories / dish.baseCalories
  const scaledMacros = {
    protein: Math.round(dish.macros.protein * scaleFactor),
    carbs: Math.round(dish.macros.carbs * scaleFactor),
    fat: Math.round(dish.macros.fat * scaleFactor),
    fiber: Math.round(dish.macros.fiber * scaleFactor),
  }

  const handleSingle = (qId, optId) => {
    setAnswers(prev => ({ ...prev, [qId]: optId }))
  }

  const handleMulti = (qId, optId, options) => {
    const opt = options.find(o => o.id === optId)
    setAnswers(prev => {
      const current = prev[qId] || []
      if (opt?.exclusive) {
        return { ...prev, [qId]: current.includes(optId) ? [] : [optId] }
      }
      const withoutExclusive = current.filter(id => !options.find(o => o.id === id)?.exclusive)
      const idx = withoutExclusive.indexOf(optId)
      if (idx >= 0) {
        const next = withoutExclusive.filter(id => id !== optId)
        return { ...prev, [qId]: next }
      }
      return { ...prev, [qId]: [...withoutExclusive, optId] }
    })
  }

  const logIt = () => {
    addEntry({
      date: getTodayStr(),
      dishId: dish.id,
      name: dish.name,
      emoji: dish.emoji,
      calories: adjustedCalories,
      macros: scaledMacros,
      meal: selectedMeal,
      modifications: answeredCount > 0 ? ['Refined with questions'] : ['Standard portion'],
    })
    setLogged(true)
    setTimeout(() => router.push('/log'), 1200)
  }

  const confColor = confidence >= 85 ? 'text-green-600 bg-green-50 border-green-200'
    : confidence >= 65 ? 'text-amber-600 bg-amber-50 border-amber-200'
    : 'text-red-600 bg-red-50 border-red-200'

  if (logged) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 animate-bounce">✅</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Logged!</h2>
          <p className="text-gray-500">Adding <strong>{adjustedCalories} kcal</strong> to your log…</p>
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

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          {scanPhoto && (
            <div className="w-full h-52 bg-black">
              <img src={scanPhoto} alt="Your meal" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">
              <span>🤖</span> AI Detected
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border ${confColor}`}>
              {confidence >= 85 ? '✓' : confidence >= 65 ? '~' : '?'} {confidence}% confident
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-18 h-18 w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-5xl flex-shrink-0 shadow-sm" style={{ backgroundColor: dish.bgColor }}>
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

          <p className="text-sm text-gray-500 leading-relaxed mb-3">{dish.description || dish.name}</p>

          <div className="flex flex-wrap gap-2">
            {(dish.tags || []).map(tag => (
              <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                {tag}
              </span>
            ))}
          </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-500">
              {answeredCount > 0 ? 'Refined Estimate' : hasQuestions ? 'Estimated Range' : 'Estimated Calories'}
            </span>
            {totalAdjustment !== 0 && (
              <span className={`text-xs font-black px-2 py-1 rounded-lg ${
                totalAdjustment > 0 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'
              }`}>
                {totalAdjustment > 0 ? '+' : ''}{totalAdjustment} kcal from answers
              </span>
            )}
          </div>

          {answeredCount === 0 && hasQuestions && dish.calorieRange ? (
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-5xl font-black text-gray-900 tabular-nums">
                {dish.calorieRange.min}–{dish.calorieRange.max}
              </span>
              <span className="text-xl text-gray-400 font-semibold">kcal</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-6xl font-black text-orange-500 tabular-nums transition-all">
                {adjustedCalories}
              </span>
              <span className="text-xl text-gray-400 font-semibold">kcal</span>
            </div>
          )}

          {answeredCount === 0 && hasQuestions && (
            <p className="text-xs text-gray-400 mb-3">Answer the questions below to refine this estimate</p>
          )}

          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Macronutrients</p>
            <MacroBar {...scaledMacros} />
          </div>
        </div>

        {dish.hiddenCalories?.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-base">⚠️</span>
              <span className="text-sm font-bold text-amber-800">Watch out for hidden calories</span>
            </div>
            <ul className="space-y-1.5">
              {dish.hiddenCalories.map(item => (
                <li key={item} className="flex items-start gap-2 text-xs text-amber-700 leading-snug">
                  <span className="mt-0.5 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasQuestions && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center text-base flex-shrink-0">
                🎯
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Improve Accuracy</h3>
                <p className="text-xs text-gray-400">
                  {answeredCount}/{dish.questions.length} answered
                  {answeredCount === 0 ? ' · calories update as you answer' : ''}
                </p>
              </div>
              {allAnswered && (
                <div className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                  ✓ Done
                </div>
              )}
            </div>

            <div className="space-y-5">
              {dish.questions.map(q => (
                <QuestionBlock
                  key={q.id}
                  question={q}
                  answer={answers[q.id]}
                  onSingle={handleSingle}
                  onMulti={handleMulti}
                />
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Log as</p>
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
          ✅ Log {adjustedCalories} kcal
        </button>

        <button
          onClick={() => router.push('/glossary')}
          className="w-full bg-white text-gray-500 py-3 rounded-2xl text-sm font-semibold border border-gray-200 hover:border-orange-300 hover:text-orange-500 transition-all active:scale-[0.98]"
        >
          Wrong dish? Pick the correct one →
        </button>

        {hasQuestions && answeredCount < dish.questions.length && (
          <p className="text-center text-xs text-gray-400 pb-2">
            You can log now or answer questions above for a more accurate estimate
          </p>
        )}

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
