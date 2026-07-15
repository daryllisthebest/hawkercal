'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { addEntry, getTodayStr } from '@/lib/storage'

const TYPE_COLORS = {
  protein: { border: 'border-l-green-500' },
  starch:  { border: 'border-l-amber-500' },
  sauce:   { border: 'border-l-orange-400' },
  sides:   { border: 'border-l-gray-400' },
}

function ComponentCard({ component }) {
  const tc = TYPE_COLORS[component.type] || TYPE_COLORS.sides

  return (
    <div className={`bg-white rounded-lg border-l-4 p-3 flex items-center gap-3 ${tc.border} shadow-sm border border-gray-100 border-l-0`}>
      <span className="text-xl flex-shrink-0">{component.emoji || '🍽️'}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900">{component.name}</div>
        {component.portion_note && (
          <div className="text-xs text-gray-500">{component.portion_note}</div>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-base font-bold text-gray-900 tabular-nums">{component.calories}</div>
        <div className="text-[10px] text-gray-400">kcal</div>
      </div>
    </div>
  )
}

export default function ResultPage() {
  const router = useRouter()
  const [estimate, setEstimate] = useState(null)
  const [dishName, setDishName] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const rawEstimate = sessionStorage.getItem('hawkercal_estimate')
    if (rawEstimate) {
      try {
        setEstimate(JSON.parse(rawEstimate))
      } catch {
        router.push('/scan')
      }
    } else {
      router.push('/scan')
    }
  }, [router])

  const handleSave = () => {
    if (!estimate) return

    addEntry({
      date: getTodayStr(),
      timestamp: Date.now(),
      estimate,
      dishName: dishName || null,
      totalCalories: estimate.calories_total,
      components: estimate.components,
    })
    setSaved(true)
    setTimeout(() => router.push('/home'), 1500)
  }

  if (!estimate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-gray-400">Loading…</div>
      </div>
    )
  }

  const totalCal = estimate.calories_total
  const minCal = Math.round(estimate.calories_min || totalCal * 0.85)
  const maxCal = Math.round(estimate.calories_max || totalCal * 1.15)

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* What we see — conversational intro */}
        <div className="mb-8">
          <p className="text-base text-gray-700 leading-relaxed">{estimate.what_i_see}</p>
        </div>

        {/* Total calories — large and prominent */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 text-center">
          <div className="text-5xl font-black text-orange-500 mb-2 tabular-nums">{totalCal}</div>
          <div className="text-gray-500 text-sm mb-4">estimated calories</div>
          <div className="text-sm text-gray-400">
            ~{minCal}–{maxCal} kcal
          </div>
        </div>

        {/* Components list */}
        {estimate.components && estimate.components.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Breakdown</h3>
            <div className="space-y-2">
              {estimate.components.map((component, i) => (
                <ComponentCard key={i} component={component} />
              ))}
            </div>
          </div>
        )}

        {/* Macros summary */}
        {estimate.protein_g !== undefined && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8 flex gap-3 justify-around text-center">
            <div>
              <div className="text-xs text-gray-500 mb-1">Protein</div>
              <div className="text-sm font-bold text-green-600">{Math.round(estimate.protein_g)}g</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Carbs</div>
              <div className="text-sm font-bold text-amber-600">{Math.round(estimate.carbs_g)}g</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Fat</div>
              <div className="text-sm font-bold text-orange-600">{Math.round(estimate.fat_g)}g</div>
            </div>
          </div>
        )}

        {/* Optional dish name input */}
        <div className="mb-8">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
            What was this dish? <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            placeholder="e.g. Chicken Chop, Laksa, Nasi Lemak"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-100"
          />
        </div>

        {/* Honest note */}
        {estimate.honest_note && (
          <div className="text-[11px] text-gray-400 mb-8 leading-relaxed">
            {estimate.honest_note}
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saved}
          className={`w-full py-3.5 rounded-xl font-bold text-white transition-all active:scale-95 mb-3 ${
            saved
              ? 'bg-green-500'
              : 'bg-orange-500 hover:bg-orange-600'
          }`}
        >
          {saved ? '✓ Logged' : `Log ~${totalCal} kcal`}
        </button>

        <Link href="/scan" className="block text-center text-sm text-orange-500 font-semibold hover:text-orange-600">
          Scan another meal
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}
