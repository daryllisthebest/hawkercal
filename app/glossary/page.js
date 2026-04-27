'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { DISHES } from '@/lib/mockData'

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

export default function GlossaryPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('all')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return ALL_DISHES.filter(d => {
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
  }, [search, region])

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
            <p className="text-[10px] text-gray-400">{ALL_DISHES.length} dishes · tap to log</p>
          </div>
          <div className="w-9" />
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
            : `All ${ALL_DISHES.length} dishes in our database`}
        </p>

        {/* Dish list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🤔</div>
            <p className="text-gray-500 font-medium">No dishes found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different name or remove filters</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(dish => (
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
            ))}
          </div>
        )}

      </div>

      <BottomNav />
    </div>
  )
}
