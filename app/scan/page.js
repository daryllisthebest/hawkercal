'use client'
import { useState, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { DISHES, mockDetect } from '@/lib/mockData'

const ALL_DISHES = Object.values(DISHES)

const TIPS = [
  'For best results, photograph the dish from above 📸',
  'Make sure the food is well-lit and in focus 💡',
  'Capture the full plate in frame for better accuracy 🍽️',
]

export default function ScanPage() {
  const router = useRouter()
  const fileRef = useRef(null)
  const [phase, setPhase] = useState('idle')
  const [preview, setPreview] = useState(null)
  const [analyzeMsg, setAnalyzeMsg] = useState('Scanning your meal…')
  const [tipIdx] = useState(() => Math.floor(Math.random() * TIPS.length))
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return ALL_DISHES
    return ALL_DISHES.filter(d =>
      d.name.toLowerCase().includes(q) ||
      (d.nameLocal && d.nameLocal.toLowerCase().includes(q)) ||
      (d.tags && d.tags.some(t => t.toLowerCase().includes(q)))
    )
  }, [search])

  const startAnalysis = (imgUrl) => {
    setPhase('analyzing')
    const msgs = ['Scanning your meal…', 'Identifying dish type…', 'Estimating portions…', 'Calculating calories…']
    let i = 0
    const iv = setInterval(() => {
      i++
      if (i < msgs.length) setAnalyzeMsg(msgs[i])
    }, 600)
    setTimeout(() => {
      clearInterval(iv)
      const result = mockDetect()
      router.push(`/result?dish=${result.dishId}&confidence=${result.confidence}`)
    }, 2600)
  }

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    startAnalysis(url)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleQuickPick = (dishId) => {
    setPhase('analyzing')
    setAnalyzeMsg('Loading dish info…')
    setTimeout(() => router.push(`/result?dish=${dishId}&confidence=95`), 1200)
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-24">

      <header className="glass border-b border-orange-100/60 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/log" className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-bold text-gray-900">Scan Meal</h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-6">

        {phase === 'idle' && (
          <>
            {/* Camera / upload zone */}
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className="relative bg-white border-2 border-dashed border-orange-300 rounded-3xl p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 transition-all duration-200 active:scale-[0.99] mb-4 group"
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={e => handleFile(e.target.files?.[0])}
              />

              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-105 transition-transform">
                <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              <h2 className="text-xl font-black text-gray-900 mb-2">Snap Your Meal</h2>
              <p className="text-gray-500 text-sm mb-5">Take a photo or upload from your gallery.<br />Our AI identifies the dish instantly.</p>

              <div className="flex gap-3 justify-center">
                <div className="flex items-center gap-1.5 bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-orange-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth={2} />
                  </svg>
                  Take Photo
                </div>
                <div className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-400 flex items-center justify-center gap-1">
                <span>💡</span> {TIPS[tipIdx]}
              </div>
            </div>

            <div className="flex items-center gap-2 justify-center text-xs text-gray-400 mb-6">
              <span>Supports JPG, PNG, HEIC, WEBP</span>
              <span>·</span>
              <span>Max 20MB</span>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Or search a dish</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Search bar */}
            <div className="relative mb-4">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search 45 dishes… e.g. laksa, pho, chicken"
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

            {/* Results count */}
            <p className="text-xs text-gray-400 mb-3 px-1">
              {search ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${search}"` : `All ${ALL_DISHES.length} detectable dishes`}
            </p>

            {/* Dish list */}
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🤔</div>
                <p className="text-gray-500 text-sm font-medium">No dish found for "{search}"</p>
                <p className="text-gray-400 text-xs mt-1">Try a different name or snap a photo instead</p>
              </div>
            ) : (
              <div className="space-y-2 mb-6">
                {filtered.map(dish => (
                  <button
                    key={dish.id}
                    onClick={() => handleQuickPick(dish.id)}
                    className="w-full bg-white rounded-2xl px-4 py-3 flex items-center gap-4 border border-gray-100 hover:border-orange-300 hover:shadow-sm hover:shadow-orange-50 transition-all duration-150 active:scale-[0.99] text-left"
                  >
                    <span className="text-3xl flex-shrink-0">{dish.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 text-sm leading-tight">{dish.name}</div>
                      {dish.nameLocal && (
                        <div className="text-xs text-gray-400 mt-0.5">{dish.nameLocal}</div>
                      )}
                      {dish.tags && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {dish.tags.map(t => (
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
          </>
        )}

        {phase === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-20">
            {preview && (
              <div className="w-48 h-48 rounded-3xl overflow-hidden mb-8 shadow-xl shadow-orange-100 ring-4 ring-orange-100">
                <img src={preview} alt="Uploaded meal" className="w-full h-full object-cover" />
              </div>
            )}
            {!preview && (
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl flex items-center justify-center text-5xl mb-8 shadow-lg">
                🔍
              </div>
            )}

            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 border-4 border-orange-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-2 flex items-center justify-center text-xl">🤖</div>
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-2">AI is working…</h2>
            <p className="text-gray-500 text-sm animate-pulse">{analyzeMsg}</p>

            <div className="flex gap-1.5 mt-6">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      <BottomNav />
    </div>
  )
}
