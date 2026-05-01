'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { DISHES } from '@/lib/mockData'
import { getCustomDishes, addCustomDish, removeCustomDish } from '@/lib/storage'

const ALL_DISHES = Object.values(DISHES)

const REGIONS = [
  { id: 'all', label: 'All', flag: '🌏' },
  { id: 'Singapore', label: 'Singapore', flag: '🇸🇬' },
  { id: 'Malaysia', label: 'Malaysia', flag: '🇲🇾' },
  { id: 'Thailand', label: 'Thailand', flag: '🇹🇭' },
  { id: 'Indonesia', label: 'Indonesia', flag: '🇮🇩' },
  { id: 'Vietnam', label: 'Vietnam', flag: '🇻🇳' },
  { id: 'Philippines', label: 'Philippines', flag: '🇵🇭' },
]

const EMPTY_FORM = { name: '', emoji: '', calories: '', description: '', origin: '' }

export default function GlossaryPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('all')
  const [customDishes, setCustomDishes] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    setCustomDishes(getCustomDishes())
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const standard = ALL_DISHES.filter(d => {
      const matchRegion = region === 'all' || d.origin === region
      if (!matchRegion) return false
      if (!q) return true
      return (
        d.name.toLowerCase().includes(q) ||
        (d.nameLocal && d.nameLocal.toLowerCase().includes(q)) ||
        (d.tags && d.tags.some(t => t.toLowerCase().includes(q))) ||
        (d.description && d.description.toLowerCase().includes(q))
      )
    })
    const customs = customDishes.filter(d => {
      if (region !== 'all') return false
      if (!q) return true
      return (
        d.name.toLowerCase().includes(q) ||
        (d.origin && d.origin.toLowerCase().includes(q)) ||
        (d.description && d.description.toLowerCase().includes(q))
      )
    })
    return [...customs, ...standard]
  }, [search, region, customDishes])

  const handleAdd = () => {
    const name = form.name.trim()
    const calories = parseInt(form.calories)
    if (!name) { setFormError('Dish name is required'); return }
    if (!form.calories || isNaN(calories) || calories <= 0) { setFormError('Enter a valid calorie amount'); return }
    addCustomDish({ name, emoji: form.emoji.trim(), calories, description: form.description.trim(), origin: form.origin.trim() })
    setCustomDishes(getCustomDishes())
    setShowAddForm(false)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  const handleDelete = (id) => {
    removeCustomDish(id)
    setCustomDishes(getCustomDishes())
  }

  const closeForm = () => { setShowAddForm(false); setForm(EMPTY_FORM); setFormError('') }

  const totalCount = ALL_DISHES.length + customDishes.length

  return (
    <div className="min-h-screen bg-orange-50 pb-28">
      <header className="glass border-b border-orange-100/60 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/scan" className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="text-center">
            <h1 className="font-bold text-gray-900 leading-tight">Food Glossary</h1>
            <p className="text-[10px] text-gray-400">{totalCount} dishes · tap to log</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-sm text-white hover:bg-orange-600 transition-colors"
            title="Add your own dish"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-4">

        {/* Search */}
        <div className="relative mb-3">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, cuisine, or tag…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Region filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none">
          {REGIONS.map(r => (
            <button
              key={r.id}
              onClick={() => setRegion(r.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                region === r.id
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
              }`}
            >
              <span>{r.flag}</span>
              <span>{r.label}</span>
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-xs text-gray-400 mb-3 px-1">
          {search || region !== 'all'
            ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`
            : `All ${totalCount} dishes in your database`}
        </p>

        {/* Dish list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🤔</div>
            <p className="text-gray-500 font-medium">No dishes found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different name or remove filters</p>
            {region === 'all' && (
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 inline-flex items-center gap-1.5 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors"
              >
                + Add this dish
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(dish =>
              dish.isCustom ? (
                <div
                  key={dish.id}
                  className="w-full bg-white rounded-2xl px-4 py-3 flex items-center gap-3 border border-orange-200 shadow-sm text-left"
                >
                  <button
                    onClick={() => router.push(`/result?dish=${dish.id}&confidence=95`)}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-orange-50">
                      {dish.emoji || '🍽️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <span className="text-sm">{dish.flag}</span>
                        <span className="font-bold text-gray-900 text-sm leading-tight truncate">{dish.name}</span>
                        <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full flex-shrink-0">Custom</span>
                      </div>
                      {dish.origin && dish.origin !== 'Custom' && (
                        <div className="text-xs text-gray-400 mb-0.5">{dish.origin}</div>
                      )}
                      {dish.description && (
                        <div className="text-[11px] text-gray-400 leading-snug line-clamp-2">{dish.description}</div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-black text-orange-500">~{dish.baseCalories}</div>
                      <div className="text-[10px] text-gray-400">kcal</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDelete(dish.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors flex-shrink-0"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  key={dish.id}
                  onClick={() => router.push(`/result?dish=${dish.id}&confidence=95`)}
                  className="w-full bg-white rounded-2xl px-4 py-3 flex items-center gap-4 border border-gray-100 hover:border-orange-300 hover:shadow-sm hover:shadow-orange-50 transition-all duration-150 active:scale-[0.99] text-left"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: dish.bgColor || '#FEF3C7' }}
                  >
                    {dish.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-sm">{dish.flag}</span>
                      <span className="font-bold text-gray-900 text-sm leading-tight truncate">{dish.name}</span>
                    </div>
                    {dish.nameLocal && (
                      <div className="text-xs text-gray-400 mb-1">{dish.nameLocal}</div>
                    )}
                    {dish.description && (
                      <div className="text-[11px] text-gray-400 leading-snug line-clamp-2">{dish.description}</div>
                    )}
                    {dish.tags && dish.tags.length > 0 && (
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {dish.tags.slice(0, 3).map(t => (
                          <span key={t} className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-black text-orange-500">~{dish.baseCalories}</div>
                    <div className="text-[10px] text-gray-400">kcal</div>
                  </div>
                </button>
              )
            )}
          </div>
        )}

      </div>

      {/* Add Dish Bottom Sheet */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={closeForm} />
          <div className="relative w-full max-w-md mx-auto bg-white rounded-t-3xl p-6 pb-10 shadow-2xl">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-black text-gray-900 mb-1">Add Your Own Dish</h3>
            <p className="text-xs text-gray-400 mb-5">Saved locally on your device · any cuisine welcome</p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-16">
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Emoji</label>
                  <input
                    type="text"
                    placeholder="🍽️"
                    value={form.emoji}
                    onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
                    maxLength={4}
                    className="w-full text-center py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">
                    Dish Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Caesar Salad"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">
                    Calories <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 450"
                    value={form.calories}
                    onChange={e => setForm(f => ({ ...f, calories: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Cuisine / Origin</label>
                  <input
                    type="text"
                    placeholder="e.g. Italian"
                    value={form.origin}
                    onChange={e => setForm(f => ({ ...f, origin: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">
                  Description <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  placeholder="Briefly describe the dish…"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                />
              </div>

              {formError && (
                <p className="text-xs text-red-500 font-semibold">{formError}</p>
              )}

              <button
                onClick={handleAdd}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-2xl font-black text-sm shadow-sm hover:from-orange-600 hover:to-orange-700 transition-all active:scale-[0.98]"
              >
                Add Dish
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
