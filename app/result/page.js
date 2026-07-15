'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { addEntry, getTodayStr } from '@/lib/storage'

const TYPE_COLORS = {
  protein: { border: 'border-l-green-500',  badge: 'bg-green-100 text-green-700',  dot: '#22c55e' },
  starch:  { border: 'border-l-amber-500',  badge: 'bg-amber-100 text-amber-700',  dot: '#f59e0b' },
  sauce:   { border: 'border-l-orange-400', badge: 'bg-orange-100 text-orange-700', dot: '#fb923c' },
  sides:   { border: 'border-l-gray-400',   badge: 'bg-gray-100 text-gray-600',    dot: '#9ca3af' },
}

const STEPS = [0.5, 1, 1.5, 2, 2.5, 3]

function CalorieRingMini({ calories }) {
  const size = 96
  const sw = 8
  const r = (size - sw * 2) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(calories / 800, 1)
  const offset = circ * (1 - pct)
  const color = calories > 700 ? '#ef4444' : calories > 500 ? '#f59e0b' : '#f97316'

  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 absolute inset-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={sw} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div className="z-10 text-center">
        <div className="text-xl font-black text-gray-900 leading-none tabular-nums">{calories}</div>
        <div className="text-[10px] text-gray-400 font-medium">kcal</div>
      </div>
    </div>
  )
}

function MacroBox({ label, value, color }) {
  return (
    <div className="flex-1 rounded-xl px-3 py-2.5 text-center" style={{ backgroundColor: color + '18' }}>
      <div className="text-base font-black leading-none" style={{ color }}>{value}</div>
      <div className="text-[10px] text-gray-400 font-medium mt-0.5">g</div>
      <div className="text-[10px] text-gray-500 mt-0.5">{label}</div>
    </div>
  )
}

function PortionStepper({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {STEPS.map(s => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
            value === s
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600'
          }`}
        >
          {s}×
        </button>
      ))}
    </div>
  )
}

function ComponentCard({ component, multiplier, onMultiplierChange, isExpanded, onToggleExpand }) {
  const tc = TYPE_COLORS[component.type] || TYPE_COLORS.sides
  const cal = Math.round((component.calories || 0) * multiplier)
  const protein = Math.round((component.protein_g || 0) * multiplier)
  const carbs = Math.round((component.carbs_g || 0) * multiplier)
  const fat = Math.round((component.fat_g || 0) * multiplier)
  const weight = component.weight_g ? Math.round(component.weight_g * multiplier) : null

  return (
    <div
      className={`bg-white rounded-2xl border-l-4 transition-all duration-300 ${tc.border} ${
        'shadow-sm border border-gray-100 border-l-0'
      }`}
    >
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
        onClick={onToggleExpand}
      >
        <span className="text-2xl flex-shrink-0 leading-none">{component.emoji || '🍽️'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <span className="text-sm font-bold text-gray-900">{component.name}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${tc.badge}`}>
              {component.type || 'other'}
            </span>
          </div>
          <div className="text-xs text-gray-400 leading-snug line-clamp-1">
            {component.portion_note || (weight ? `~${weight}g` : '')}
          </div>
          {multiplier !== 1 && (
            <div className="text-[10px] text-orange-500 font-semibold mt-0.5">{multiplier}× portion</div>
          )}
        </div>
        <div className="flex-shrink-0 text-right mr-2">
          <div className="text-base font-black text-gray-900 tabular-nums">{cal}</div>
          <div className="text-[10px] text-gray-400">kcal</div>
        </div>
        <span className="text-gray-300 text-xs">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-50">
          <div className="flex gap-3 mt-3 mb-4">
            <div className="flex-1 text-center bg-green-50 rounded-xl py-2">
              <div className="text-xs font-black text-green-600">{protein}g</div>
              <div className="text-[10px] text-gray-400">protein</div>
            </div>
            <div className="flex-1 text-center bg-amber-50 rounded-xl py-2">
              <div className="text-xs font-black text-amber-600">{carbs}g</div>
              <div className="text-[10px] text-gray-400">carbs</div>
            </div>
            <div className="flex-1 text-center bg-orange-50 rounded-xl py-2">
              <div className="text-xs font-black text-orange-500">{fat}g</div>
              <div className="text-[10px] text-gray-400">fat</div>
            </div>
            {weight && (
              <div className="flex-1 text-center bg-gray-50 rounded-xl py-2">
                <div className="text-xs font-black text-gray-600">{weight}g</div>
                <div className="text-[10px] text-gray-400">weight</div>
              </div>
            )}
          </div>
          <div>
            <div className="text-[10px] text-gray-400 mb-2 font-semibold uppercase tracking-wide">Adjust portion</div>
            <PortionStepper value={multiplier} onChange={onMultiplierChange} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function ResultPage() {
  const router = useRouter()
  const [estimate, setEstimate] = useState(null)
  const [portionMults, setPortionMults] = useState({})
  const [expandedIdx, setExpandedIdx] = useState(null)
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

  const getTotalCalories = useCallback(() => {
    if (!estimate?.components) return 0
    return Math.round(
      estimate.components.reduce((sum, c, i) => sum + (c.calories || 0) * (portionMults[i] || 1), 0)
    )
  }, [estimate, portionMults])

  const getTotalMacros = useCallback(() => {
    if (!estimate?.components) return { protein: 0, carbs: 0, fat: 0 }
    return estimate.components.reduce(
      (sum, c, i) => {
        const mult = portionMults[i] || 1
        return {
          protein: sum.protein + (c.protein_g || 0) * mult,
          carbs: sum.carbs + (c.carbs_g || 0) * mult,
          fat: sum.fat + (c.fat_g || 0) * mult,
        }
      },
      { protein: 0, carbs: 0, fat: 0 }
    )
  }, [estimate, portionMults])

  const handleSave = () => {
    if (!estimate) return
    const totalCal = getTotalCalories()
    const macros = getTotalMacros()

    addEntry({
      date: getTodayStr(),
      timestamp: Date.now(),
      estimate,
      totalCalories: totalCal,
      macros,
      components: estimate.components,
    })
    setSaved(true)
    setTimeout(() => router.push('/home'), 1500)
  }

  if (!estimate) return <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center"><div className="text-gray-400">Loading…</div></div>

  const totalCal = getTotalCalories()
  const macros = getTotalMacros()

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-4">
        {/* What we see */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">📸</span>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900 mb-1">What we see</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{estimate.what_i_see}</p>
            </div>
          </div>
        </div>

        {/* Calorie summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-start gap-6 mb-6">
            <CalorieRingMini calories={totalCal} />
            <div className="flex-1 pt-2">
              <div className="text-xs text-gray-400 uppercase font-semibold mb-2">Total calories</div>
              <div className="text-3xl font-black text-gray-900 mb-1 tabular-nums">{totalCal}</div>
              <div className="text-xs text-gray-500">
                Range: {Math.round(estimate.calories_min || totalCal * 0.85)} – {Math.round(estimate.calories_max || totalCal * 1.15)} kcal
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <MacroBox label="Protein" value={Math.round(macros.protein)} color="#22c55e" />
            <MacroBox label="Carbs" value={Math.round(macros.carbs)} color="#f59e0b" />
            <MacroBox label="Fat" value={Math.round(macros.fat)} color="#f97316" />
          </div>

          {estimate.honest_note && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <div className="text-[11px] text-amber-700">{estimate.honest_note}</div>
            </div>
          )}
        </div>

        {/* Components */}
        {estimate.components && estimate.components.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Components</h2>
            <div className="space-y-3">
              {estimate.components.map((component, i) => (
                <ComponentCard
                  key={i}
                  component={component}
                  multiplier={portionMults[i] || 1}
                  onMultiplierChange={(m) => setPortionMults(p => ({ ...p, [i]: m }))}
                  isExpanded={expandedIdx === i}
                  onToggleExpand={() => setExpandedIdx(expandedIdx === i ? null : i)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saved}
          className={`w-full py-3.5 rounded-2xl font-bold text-white transition-all active:scale-95 ${
            saved
              ? 'bg-green-500'
              : 'bg-orange-500 hover:bg-orange-600 active:shadow-lg'
          }`}
        >
          {saved ? '✓ Saved to log' : 'Save to food log'}
        </button>

        <Link href="/scan" className="block text-center mt-3 text-sm text-orange-500 font-semibold hover:text-orange-600">
          Scan another meal
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}
