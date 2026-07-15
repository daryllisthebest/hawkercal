'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { addEntry, getTodayStr } from '@/lib/storage'

export default function ResultPage() {
  const router = useRouter()
  const [estimate, setEstimate] = useState(null)
  const [dishName, setDishName] = useState('')
  const [saved, setSaved] = useState(false)
  const [lastScanPhoto, setLastScanPhoto] = useState(null)

  useEffect(() => {
    const rawEstimate = sessionStorage.getItem('hawkercal_estimate')
    const photo = sessionStorage.getItem('lastScanPhoto')
    if (rawEstimate) {
      try {
        setEstimate(JSON.parse(rawEstimate))
        if (photo) setLastScanPhoto(photo)
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400">Loading…</div>
      </div>
    )
  }

  const totalCal = estimate.calories_total
  const minCal = Math.round(estimate.calories_min || totalCal * 0.85)
  const maxCal = Math.round(estimate.calories_max || totalCal * 1.15)

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-4">
        {/* Food photo */}
        {lastScanPhoto && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img src={lastScanPhoto} alt="Scanned food" className="w-full h-auto" />
          </div>
        )}

        {/* What we see — in quotes, conversational */}
        <div className="mb-6 text-center">
          <p className="text-base text-gray-700 italic leading-relaxed">
            "{estimate.what_i_see}"
          </p>
        </div>

        <div className="border-t border-gray-200 mb-6" />

        {/* Components list with calories */}
        {estimate.components && estimate.components.length > 0 && (
          <div className="mb-6 space-y-3">
            {estimate.components.map((component, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{component.emoji || '🍽️'}</span>
                  <span className="text-sm text-gray-700">{component.name}</span>
                </div>
                <div className="text-sm font-semibold text-gray-900 tabular-nums">
                  {Math.round(component.calories)} kcal
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-gray-200 mb-6" />

        {/* Total calories */}
        <div className="mb-6 text-center">
          <div className="text-lg font-semibold text-gray-900 mb-1">
            Total <span className="tabular-nums">~{minCal}–{maxCal} kcal</span>
          </div>
        </div>

        {/* Macros */}
        <div className="mb-6 flex justify-center gap-8 text-center">
          <div>
            <div className="text-xs text-gray-500 mb-1">Protein</div>
            <div className="text-sm font-semibold text-gray-900 tabular-nums">
              {Math.round(estimate.protein_g || 0)}g
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Carbs</div>
            <div className="text-sm font-semibold text-gray-900 tabular-nums">
              {Math.round(estimate.carbs_g || 0)}g
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Fat</div>
            <div className="text-sm font-semibold text-gray-900 tabular-nums">
              {Math.round(estimate.fat_g || 0)}g
            </div>
          </div>
        </div>

        {/* Optional dish name */}
        <div className="mb-6">
          <input
            type="text"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            placeholder="What's this dish? (optional)"
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-100"
          />
        </div>

        <div className="border-t border-gray-200 mb-6" />

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saved}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all active:scale-95 mb-4 ${
            saved ? 'bg-green-500' : 'bg-orange-500 hover:bg-orange-600'
          }`}
        >
          {saved ? '✓ Logged' : `Log ~${totalCal} kcal`}
        </button>

        <Link
          href="/scan"
          className="block text-center text-sm text-gray-500 hover:text-gray-700 font-medium"
        >
          Scan another meal
        </Link>

        <div className="border-t border-gray-200 mt-6 mb-6" />

        {/* Honest note */}
        {estimate.honest_note && (
          <div className="text-xs text-gray-500 leading-relaxed">
            <span className="mr-1">ℹ</span>
            {estimate.honest_note}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
