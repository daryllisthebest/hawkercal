'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { DISHES, FEATURED_DISH_IDS, mockDetect } from '@/lib/mockData'

const QUICK_PICKS = FEATURED_DISH_IDS.map(id => DISHES[id]).filter(Boolean)

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

      {/* Header */}
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

            <div className="flex items-center gap-2 justify-center text-xs text-gray-400 mb-8">
              <span>Supports JPG, PNG, HEIC, WEBP</span>
              <span>·</span>
              <span>Max 20MB</span>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Or pick from popular</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {QUICK_PICKS.map(dish => (
                <button
                  key={dish.id}
                  onClick={() => handleQuickPick(dish.id)}
                  className="bg-white rounded-2xl p-3 text-left border border-gray-100 hover:border-orange-300 hover:shadow-md hover:shadow-orange-50 transition-all duration-200 active:scale-95 group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{dish.emoji}</div>
                  <div className="text-xs font-bold text-gray-800 leading-tight mb-0.5 line-clamp-2">{dish.name}</div>
                  <div className="text-xs font-black text-orange-500">~{dish.baseCalories} kcal</div>
                </button>
              ))}
            </div>
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
