'use client'

export const dynamic = 'force-dynamic'

import { Suspense, useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { DISHES, getMealForTime, MEAL_TYPES } from '@/lib/mockData'
import { addEntry, getTodayStr, getCustomDishes, addCorrection } from '@/lib/storage'

const TYPE_COLORS = {
  protein: { border: 'border-l-green-500',  badge: 'bg-green-100 text-green-700',  dot: '#22c55e' },
  starch:  { border: 'border-l-amber-500',  badge: 'bg-amber-100 text-amber-700',  dot: '#f59e0b' },
  sauce:   { border: 'border-l-orange-400', badge: 'bg-orange-100 text-orange-700', dot: '#fb923c' },
  sides:   { border: 'border-l-gray-400',   badge: 'bg-gray-100 text-gray-600',    dot: '#9ca3af' },
  drink:   { border: 'border-l-blue-400',   badge: 'bg-blue-100 text-blue-700',    dot: '#60a5fa' },
}

// Distributed label positions (centered via transform in JSX)
const LABEL_POS = [
  { x: '22%', y: '20%' },
  { x: '72%', y: '18%' },
  { x: '78%', y: '54%' },
  { x: '22%', y: '72%' },
  { x: '58%', y: '78%' },
  { x: '45%', y: '44%' },
]

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

function IngredientCard({ ingredient, multiplier, onMultiplierChange, isHighlighted, isExpanded, onToggleExpand, cardRef }) {
  const tc = TYPE_COLORS[ingredient.type] || TYPE_COLORS.sides
  const cal = Math.round((ingredient.calories || 0) * multiplier)
  const protein = Math.round((ingredient.protein_g || 0) * multiplier)
  const carbs = Math.round((ingredient.carbs_g || 0) * multiplier)
  const fat = Math.round((ingredient.fat_g || 0) * multiplier)
  const weight = ingredient.weight_g ? Math.round(ingredient.weight_g * multiplier) : null

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-2xl border-l-4 transition-all duration-300 ${tc.border} ${
        isHighlighted
          ? 'ring-2 ring-orange-400 ring-offset-1 shadow-md shadow-orange-100'
          : 'shadow-sm border border-gray-100 border-l-0'
      }`}
    >
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
        onClick={onToggleExpand}
      >
        <span className="text-2xl flex-shrink-0 leading-none">{ingredient.emoji || '🍽️'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <span className="text-sm font-bold text-gray-900">{ingredient.name}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${tc.badge}`}>
              {ingredient.type || 'sides'}
            </span>
          </div>
          <div className="text-xs text-gray-400 leading-snug line-clamp-1">
            {ingredient.description || (weight ? `~${weight}g` : '')}
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
          {ingredient.confidence && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Detection confidence</span>
                <span className="text-[10px] font-bold text-gray-600">{ingredient.confidence}%</span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${ingredient.confidence}%`,
                    backgroundColor: ingredient.confidence >= 80 ? '#22c55e' : ingredient.confidence >= 60 ? '#f59e0b' : '#ef4444',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          )}
          <div>
            <div className="text-[10px] text-gray-400 mb-2 font-semibold uppercase tracking-wide">Adjust portion</div>
            <PortionStepper value={multiplier} onChange={onMultiplierChange} />
          </div>
        </div>
      )}
    </div>
  )
}

function ConfidencePanel({ visualInventory, ingredients }) {
  if (!visualInventory) return null

  const ingConfByType = {}
  ingredients.forEach(ing => {
    const t = ing.type || 'sides'
    if (!ingConfByType[t]) ingConfByType[t] = []
    ingConfByType[t].push(ing.confidence ?? 75)
  })

  const avgConf = type => {
    const list = ingConfByType[type]
    if (!list?.length) return 74
    return Math.round(list.reduce((s, c) => s + c, 0) / list.length)
  }

  const fields = [
    { key: 'protein', ingType: 'protein', label: 'Protein', desc: visualInventory.protein },
    { key: 'starch',  ingType: 'starch',  label: 'Starch',  desc: visualInventory.starch },
    { key: 'sauce',   ingType: 'sauce',   label: 'Sauce',   desc: visualInventory.sauce },
    { key: 'sides',   ingType: 'sides',   label: 'Sides',   desc: visualInventory.sides },
  ].filter(f => f.desc)

  if (fields.length === 0) return null

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">🔍</span>
        <h3 className="text-sm font-bold text-gray-900">What the AI saw</h3>
      </div>
      <div className="space-y-4">
        {fields.map(({ key, ingType, label, desc }) => {
          const conf = avgConf(ingType)
          const barColor = conf >= 80 ? '#22c55e' : conf >= 60 ? '#f59e0b' : '#ef4444'
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-gray-700">{label}</span>
                <span className="text-xs font-bold tabular-nums" style={{ color: barColor }}>{conf}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${conf}%`, backgroundColor: barColor }}
                />
              </div>
              <div className="text-[11px] text-gray-400 leading-snug">{desc}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WrongDishPanel({ alternatives, debug, originalDishId, ingredients, confidence, onDishSelect }) {
  const router = useRouter()
  const [corrected, setCorrected] = useState(null)

  const handleSelect = useCallback((alt) => {
    const altDish = Object.values(DISHES).find(
      d => d.name.toLowerCase() === alt.dish.toLowerCase()
    ) || null

    addCorrection({
      originalDishId,
      selectedDishId: altDish?.id || null,
      selectedDishName: alt.dish,
      ingredients,
      confidence,
      stage1: debug?.stage1 || null,
      stage2: debug?.stage2 || null,
    })

    if (altDish) onDishSelect(altDish)
    setCorrected(alt.dish)
  }, [originalDishId, ingredients, confidence, debug, onDishSelect])

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🔄</span>
          <h3 className="text-sm font-bold text-gray-900">Wrong dish?</h3>
        </div>
        <button
          onClick={() => router.push('/glossary')}
          className="text-xs text-orange-500 font-semibold hover:text-orange-600"
        >
          Search all →
        </button>
      </div>

      {corrected && (
        <div className="mb-3 px-3 py-2 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 font-semibold">
          ✓ Updated to {corrected} — correction saved
        </div>
      )}

      {alternatives.length > 0 ? (
        <div className="space-y-2">
          {alternatives.slice(0, 3).map((alt, i) => {
            const altDish = Object.values(DISHES).find(
              d => d.name.toLowerCase() === alt.dish.toLowerCase()
            )
            return (
              <button
                key={i}
                onClick={() => handleSelect(alt)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-orange-300 hover:bg-orange-50 transition-all text-left active:scale-[0.98]"
              >
                <span className="text-xl flex-shrink-0">{altDish?.emoji || '🍽️'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-900">{alt.dish}</div>
                  {alt.reason && (
                    <div className="text-[11px] text-gray-400 line-clamp-1">{alt.reason}</div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-gray-700 tabular-nums">{alt.calories}</div>
                  <div className="text-[10px] text-gray-400">kcal</div>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <button
          onClick={() => router.push('/glossary')}
          className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-all"
        >
          Search all dishes →
        </button>
      )}
    </div>
  )
}

function DebugSection({ title, color, children }) {
  return (
    <div>
      <div className={`${color} font-bold uppercase tracking-widest text-[10px] mb-2`}>{title}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function DebugRow({ k, v, highlight }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-600 w-36 shrink-0">{k}:</span>
      <span className={highlight ? 'text-orange-300 font-bold' : 'text-gray-300'}>{v == null ? '—' : String(v)}</span>
    </div>
  )
}

function DebugPre({ label, value, maxLines, collapsed: initCollapsed = false }) {
  const [open, setOpen] = useState(!initCollapsed)
  const lines = (value || '').split('\n')
  const shown = maxLines ? lines.slice(0, maxLines).join('\n') + (lines.length > maxLines ? `\n… (${lines.length - maxLines} more lines)` : '') : value
  return (
    <div>
      <button onClick={() => setOpen(o => !o)} className="text-gray-600 hover:text-gray-400 text-[10px] mb-1">
        {label} {open ? '▲' : '▼'}
      </button>
      {open && (
        <pre className="bg-gray-900 rounded p-2 text-gray-300 whitespace-pre-wrap break-words text-[10px] max-h-48 overflow-y-auto">
          {shown}
        </pre>
      )}
    </div>
  )
}

function DebugPanel({ debug }) {
  const [open, setOpen] = useState(false)
  if (!debug) return null
  const s1 = debug.stage1
  const s2 = debug.stage2

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-700 bg-gray-950 font-mono text-xs">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-900 transition-colors"
      >
        <span className="text-green-400 font-bold tracking-tight">🔬 Debug — raw model output</span>
        <span className="text-gray-500 text-[10px]">{open ? '▲ collapse' : '▼ expand'}</span>
      </button>
      {open && (
        <div className="border-t border-gray-800 px-4 pb-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="pt-3">
            <div className="text-yellow-400 mb-2 uppercase tracking-widest text-[10px]">Stage 1 · Category</div>
            <div className="space-y-0.5">
              {s1 && Object.entries(s1).filter(([k]) => k !== 'raw').map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-gray-600 w-20 shrink-0">{k}:</span>
                  <span className={k === 'category' ? 'text-orange-300 font-bold' : 'text-gray-300'}>{v ?? '—'}</span>
                </div>
              ))}
            </div>
          </div>
          {s2 && (
            <div>
              <div className="text-yellow-400 mb-2 uppercase tracking-widest text-[10px]">Stage 2 · {s2.model}</div>
              <div className="space-y-0.5">
                {['dish', 'category', 'confidence', 'override_reason'].map(k => s2[k] != null && (
                  <div key={k} className="flex gap-2">
                    <span className="text-gray-600 w-24 shrink-0">{k}:</span>
                    <span className={k === 'dish' || k === 'override_reason' ? 'text-orange-300 font-bold' : 'text-gray-300'}>
                      {String(s2[k])}
                    </span>
                  </div>
                ))}
              </div>
              {s2.trap_checks && (
                <div className="mt-2 pl-2 border-l border-gray-800 space-y-0.5">
                  {Object.entries(s2.trap_checks).map(([k, v]) => (
                    <div key={k} className={v ? 'text-green-400' : 'text-red-400'}>
                      {v ? '✓' : '✗'} {k}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ResultContent() {
  const params = useSearchParams()
  const router = useRouter()
  const dishId = params.get('dish') || 'chicken-rice'
  const confidence = parseInt(params.get('confidence') || '87', 10)

  const [dish, setDish] = useState(() => DISHES[dishId] || DISHES['chicken-rice'])
  const [ingredients, setIngredients] = useState([])
  const [multipliers, setMultipliers] = useState({})
  const [highlightedId, setHighlightedId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [selectedMeal, setSelectedMeal] = useState(getMealForTime())
  const [logged, setLogged] = useState(false)
  const [scanPhoto, setScanPhoto] = useState(null)
  const [debug, setDebug] = useState(null)
  const [deepDebug, setDeepDebug] = useState(null)
  const [deepDebugOpen, setDeepDebugOpen] = useState(false)
  const [deepDebugLoading, setDeepDebugLoading] = useState(false)

  const cardRefs = useRef({})

  useEffect(() => {
    try {
      const photo = sessionStorage.getItem('lastScanPhoto')
      if (photo) setScanPhoto(photo)

      const rawDebug = sessionStorage.getItem('hawkercal_debug')
      if (rawDebug) setDebug(JSON.parse(rawDebug))

      const rawIng = sessionStorage.getItem('hawkercal_ingredients')
      if (rawIng) {
        const parsed = JSON.parse(rawIng)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setIngredients(parsed)
          const mults = {}
          parsed.forEach((ing, i) => { mults[ing.id || `ing-${i}`] = 1 })
          setMultipliers(mults)
        }
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (!DISHES[dishId]) {
      const found = getCustomDishes().find(d => d.id === dishId)
      if (found) setDish(found)
    }
  }, [dishId])

  useEffect(() => {
    if (highlightedId) {
      const ref = cardRefs.current[highlightedId]
      if (ref) ref.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [highlightedId])

  const fetchDeepDebug = useCallback(async () => {
    const photo = sessionStorage.getItem('lastScanPhoto')
    if (!photo) { setDeepDebug({ error: 'No scan photo found in session. Take a fresh scan first.' }); setDeepDebugOpen(true); return }
    setDeepDebugLoading(true)
    setDeepDebugOpen(true)
    try {
      const blob = await fetch(photo).then(r => r.blob())
      const form = new FormData()
      form.append('image', blob, 'photo.jpg')
      const res = await fetch('/api/detect-debug', { method: 'POST', body: form })
      const data = await res.json()
      setDeepDebug(data)
    } catch (e) {
      setDeepDebug({ error: e.message })
    } finally {
      setDeepDebugLoading(false)
    }
  }, [])

  const totalCalories = useMemo(() => {
    if (!ingredients.length) return dish.baseCalories
    return Math.max(50, Math.round(
      ingredients.reduce((sum, ing, i) => {
        const key = ing.id || `ing-${i}`
        return sum + (ing.calories || 0) * (multipliers[key] ?? 1)
      }, 0)
    ))
  }, [ingredients, multipliers, dish.baseCalories])

  const totalMacros = useMemo(() => {
    if (!ingredients.length) return dish.macros || { protein: 0, carbs: 0, fat: 0, fiber: 0 }
    return {
      protein: Math.round(ingredients.reduce((s, ing, i) => s + (ing.protein_g || 0) * (multipliers[ing.id || `ing-${i}`] ?? 1), 0)),
      carbs:   Math.round(ingredients.reduce((s, ing, i) => s + (ing.carbs_g || 0)   * (multipliers[ing.id || `ing-${i}`] ?? 1), 0)),
      fat:     Math.round(ingredients.reduce((s, ing, i) => s + (ing.fat_g || 0)     * (multipliers[ing.id || `ing-${i}`] ?? 1), 0)),
      fiber:   dish.macros?.fiber || 0,
    }
  }, [ingredients, multipliers, dish.macros])

  const handleMultiplier = useCallback((key, value) => {
    setMultipliers(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleToggleExpand = useCallback((id) => {
    setExpandedId(prev => prev === id ? null : id)
  }, [])

  const handleAnnotationTap = useCallback((id) => {
    setHighlightedId(id)
    setExpandedId(id)
  }, [])

  const handleDishSelect = useCallback((newDish) => {
    setDish(newDish)
    setIngredients([])
    setMultipliers({})
  }, [])

  const logIt = () => {
    addEntry({
      date: getTodayStr(),
      dishId: dish.id,
      name: dish.name,
      emoji: dish.emoji,
      calories: totalCalories,
      macros: totalMacros,
      meal: selectedMeal,
      modifications: ingredients.length > 0 ? ['Ingredient-level breakdown'] : ['Standard portion'],
    })
    setLogged(true)
    setTimeout(() => router.push('/log'), 1200)
  }

  const confColor = confidence >= 85 ? '#16a34a' : confidence >= 65 ? '#d97706' : '#dc2626'
  const confBg    = confidence >= 85 ? '#f0fdf4' : confidence >= 65 ? '#fffbeb' : '#fef2f2'
  const confBorder = confidence >= 85 ? '#bbf7d0' : confidence >= 65 ? '#fde68a' : '#fecaca'

  const alternatives = debug?.stage2?.alternatives || []
  const visualInventory = debug?.stage2?.visual_inventory || null

  if (logged) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 animate-bounce">✅</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Logged!</h2>
          <p className="text-gray-500">Adding <strong>{totalCalories} kcal</strong> to your log…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-36">

      {/* Header */}
      <header className="glass border-b border-orange-100/60 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/scan"
            className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-bold text-gray-900">AI Result</h1>
          <div
            className="text-xs font-bold px-2.5 py-1 rounded-lg border"
            style={{ color: confColor, backgroundColor: confBg, borderColor: confBorder }}
          >
            {confidence >= 85 ? '✓' : confidence >= 65 ? '~' : '?'} {confidence}%
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">

        {/* Image with floating annotation labels */}
        {scanPhoto && (
          <div className="relative rounded-3xl overflow-hidden bg-black shadow-sm" style={{ height: 228 }}>
            <img src={scanPhoto} alt="Your meal" className="w-full h-full object-cover" />

            {ingredients.slice(0, LABEL_POS.length).map((ing, i) => {
              const pos = LABEL_POS[i]
              const key = ing.id || `ing-${i}`
              const isActive = highlightedId === key
              return (
                <button
                  key={key}
                  onClick={() => handleAnnotationTap(key)}
                  style={{
                    left: pos.x,
                    top: pos.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm transition-all active:scale-95 ${
                    isActive
                      ? 'bg-orange-500 text-white scale-110 shadow-orange-300'
                      : 'bg-white/90 text-gray-800 hover:bg-white'
                  }`}
                >
                  <span className="leading-none">{ing.emoji || '●'}</span>
                  <span className="max-w-[72px] truncate leading-none">{ing.name}</span>
                </button>
              )
            })}

            <div
              className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border"
              style={{ color: confColor, backgroundColor: confBg + 'ee', borderColor: confBorder }}
            >
              {confidence >= 85 ? '✓' : '~'} {confidence}% confident
            </div>
          </div>
        )}

        {/* Dish header card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <CalorieRingMini calories={totalCalories} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-base">{dish.flag}</span>
                <span className="text-xs text-gray-400">{dish.origin}</span>
                {dish.tags?.[0] && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    {dish.tags[0]}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">{dish.name}</h2>
              {dish.description && (
                <p className="text-xs text-gray-400 mt-1 leading-snug line-clamp-2">{dish.description}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <MacroBox label="Protein" value={totalMacros.protein} color="#22c55e" />
            <MacroBox label="Carbs"   value={totalMacros.carbs}   color="#f59e0b" />
            <MacroBox label="Fat"     value={totalMacros.fat}     color="#f97316" />
          </div>
        </div>

        {/* Ingredient list */}
        {ingredients.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="text-sm font-bold text-gray-700">Ingredient breakdown</h3>
              <span className="text-xs text-gray-400">{ingredients.length} components</span>
            </div>
            <div className="space-y-2">
              {ingredients.map((ing, i) => {
                const key = ing.id || `ing-${i}`
                return (
                  <IngredientCard
                    key={key}
                    ingredient={{ ...ing, id: key }}
                    multiplier={multipliers[key] ?? 1}
                    onMultiplierChange={v => handleMultiplier(key, v)}
                    isHighlighted={highlightedId === key}
                    isExpanded={expandedId === key}
                    onToggleExpand={() => handleToggleExpand(key)}
                    cardRef={el => { cardRefs.current[key] = el }}
                  />
                )
              })}
            </div>
            <p className="text-center text-[11px] text-gray-400 mt-2">
              Tap any card to expand and adjust portion size
            </p>
          </div>
        )}

        {/* Confidence breakdown */}
        {visualInventory && (
          <ConfidencePanel visualInventory={visualInventory} ingredients={ingredients} />
        )}

        {/* Wrong dish panel */}
        <WrongDishPanel
          alternatives={alternatives}
          debug={debug}
          originalDishId={dish.id}
          ingredients={ingredients}
          confidence={confidence}
          onDishSelect={handleDishSelect}
        />

        {/* Meal type picker */}
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

        {/* Debug panel */}
        <DebugPanel debug={debug} />

      </div>

      {/* Floating debug button — scanPhoto is only set client-side so safe to render */}
      {scanPhoto && (
        <button
          onClick={fetchDeepDebug}
          className="fixed top-4 right-4 z-50 bg-gray-900 text-green-400 text-[10px] font-mono font-bold px-2.5 py-1.5 rounded-lg border border-gray-700 shadow-lg hover:bg-gray-800 active:scale-95 transition-all"
        >
          🔬 Debug
        </button>
      )}

      {/* Deep debug modal */}
      {deepDebugOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col" onClick={() => setDeepDebugOpen(false)}>
          <div
            className="flex-1 overflow-y-auto m-3 mt-12 rounded-2xl bg-gray-950 border border-gray-700 font-mono text-[11px]"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between px-4 py-3 bg-gray-950 border-b border-gray-800">
              <span className="text-green-400 font-bold">🔬 Full Detection Debug</span>
              <button onClick={() => setDeepDebugOpen(false)} className="text-gray-500 text-xs hover:text-white">✕ close</button>
            </div>
            {deepDebugLoading && (
              <div className="px-4 py-8 text-center text-gray-400 text-xs">Re-running detection on stored photo…</div>
            )}
            {deepDebug && !deepDebugLoading && (
              <div className="px-4 pb-6 space-y-5 pt-4">
                {deepDebug.error ? (
                  <div className="text-red-400">{deepDebug.error}</div>
                ) : (<>
                  <DebugSection title="Stage 1 — Category classifier" color="text-yellow-400">
                    <DebugRow k="detected_category" v={deepDebug.stage1_detected_category} highlight />
                    <DebugRow k="tokens_used" v={deepDebug.stage1_tokens_used} />
                    <DebugPre label="raw_response" value={deepDebug.stage1_raw_response} />
                  </DebugSection>

                  <DebugSection title="Stage 2 — Dish identifier inputs" color="text-blue-400">
                    <DebugRow k="model" v={deepDebug.stage2_model} />
                    <DebugRow k="dish_count" v={deepDebug.stage2_dish_count} />
                    <DebugRow k="tokens_used" v={deepDebug.stage2_tokens_used} />
                    <DebugPre label="dish_list_sent" value={deepDebug.stage2_dish_list_sent} maxLines={30} />
                    <DebugPre label="system_prompt_sent" value={deepDebug.stage2_system_prompt_sent} maxLines={20} collapsed />
                  </DebugSection>

                  <DebugSection title="Stage 2 — Raw model output" color="text-purple-400">
                    <DebugPre label="stage2_raw_response" value={deepDebug.stage2_raw_response} />
                  </DebugSection>

                  <DebugSection title="Post-processing overrides" color="text-orange-400">
                    {deepDebug.overrides_applied?.length === 0
                      ? <div className="text-gray-600 italic">No overrides fired</div>
                      : deepDebug.overrides_applied?.map((o, i) => (
                        <div key={i} className="border-l-2 border-orange-600 pl-3 py-1 space-y-0.5">
                          <div className="text-orange-300 font-bold">{o.rule}</div>
                          <div className="text-gray-300">{o.action}</div>
                        </div>
                      ))
                    }
                  </DebugSection>

                  <DebugSection title="Final result" color="text-green-400">
                    {Object.entries(deepDebug.final_result || {}).filter(([k]) => k !== 'ingredients' && k !== 'visual_inventory' && k !== 'alternatives' && k !== 'thinking').map(([k, v]) => (
                      <DebugRow key={k} k={k} v={typeof v === 'object' ? JSON.stringify(v) : v} highlight={k === 'dishId' || k === 'dish' || k === 'confidence'} />
                    ))}
                    {deepDebug.final_result?.visual_inventory && (
                      <DebugPre label="visual_inventory" value={JSON.stringify(deepDebug.final_result.visual_inventory, null, 2)} />
                    )}
                    {deepDebug.final_result?.thinking && (
                      <DebugPre label="thinking" value={deepDebug.final_result.thinking} />
                    )}
                  </DebugSection>
                </>)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sticky log button — sits above BottomNav */}
      <div className="fixed bottom-[68px] left-0 right-0 z-40 px-4 pb-2 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button
            onClick={logIt}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-orange-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <span>✅ Log</span>
            <span className="tabular-nums">{totalCalories.toLocaleString()} kcal</span>
          </button>
        </div>
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
