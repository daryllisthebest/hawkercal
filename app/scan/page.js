'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { DISHES } from '@/lib/mockData'
import { getTodayScanCount, incrementScanCount, FREE_SCAN_LIMIT, getMonthlyProScanCount, incrementMonthlyProScanCount, PRO_MONTHLY_SCAN_LIMIT, getProfile } from '@/lib/storage'

const TIPS = [
  'Photograph the dish from above for best results 📸',
  'Make sure the food is well-lit and in focus 💡',
  'Capture the full plate in frame for better accuracy 🍽️',
]

export default function ScanPage() {
  const router = useRouter()
  const cameraRef = useRef(null)
  const galleryRef = useRef(null)
  const [phase, setPhase] = useState('idle')
  const [preview, setPreview] = useState(null)
  const [pendingFile, setPendingFile] = useState(null)
  const [analyzeMsg, setAnalyzeMsg] = useState('Scanning your meal…')
  const [tipIdx] = useState(() => Math.floor(Math.random() * TIPS.length))

  const startAnalysis = async (file) => {
    if (preview) sessionStorage.setItem('lastScanPhoto', preview)
    const profile = getProfile()
    incrementScanCount()
    if (profile.isPro) incrementMonthlyProScanCount()
    setPhase('analyzing')
    setAnalyzeMsg('Scanning your meal…')

    const msgTimers = [
      setTimeout(() => setAnalyzeMsg('Identifying dish type…'), 1200),
      setTimeout(() => setAnalyzeMsg('Calculating calories…'), 2800),
    ]

    try {
      const formData = new FormData()
      formData.append('image', file)

      const profile = getProfile()
      const res = await fetch('/api/detect', {
        method: 'POST',
        body: formData,
        headers: profile.isPro ? { 'x-user-tier': 'pro' } : {},
      })
      const { dishId, confidence, _debug } = await res.json()

      msgTimers.forEach(clearTimeout)
      try { sessionStorage.setItem('hawkercal_debug', JSON.stringify(_debug ?? null)) } catch {}
      router.push(`/result?dish=${dishId}&confidence=${confidence}`)
    } catch {
      msgTimers.forEach(clearTimeout)
      const ids = Object.keys(DISHES)
      const dishId = ids[Math.floor(Math.random() * ids.length)]
      router.push(`/result?dish=${dishId}&confidence=60`)
    }
  }

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const profile = getProfile()
    if (profile.isPro && getMonthlyProScanCount() >= PRO_MONTHLY_SCAN_LIMIT) {
      setPhase('pro-limit-reached')
      return
    }
    if (!profile.isPro && getTodayScanCount() >= FREE_SCAN_LIMIT) {
      setPhase('limit-reached')
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    setPendingFile(file)
    setPhase('confirm')
  }

  const handleRetake = () => {
    setPreview(null)
    setPendingFile(null)
    setPhase('idle')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
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
          <Link href="/glossary" className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 text-gray-600 hover:text-orange-500 transition-colors" title="Food Glossary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </Link>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-6">

        {phase === 'idle' && (
          <>
            {/* Hidden inputs — separate so each triggers the right picker */}
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={e => handleFile(e.target.files?.[0])}
            />
            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleFile(e.target.files?.[0])}
            />

            {/* Drop zone (tapping the zone opens gallery) */}
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => galleryRef.current?.click()}
              className="relative bg-white border-2 border-dashed border-orange-300 rounded-3xl p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 transition-all duration-200 active:scale-[0.99] mb-4 group"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-105 transition-transform">
                <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              <h2 className="text-xl font-black text-gray-900 mb-2">Snap Your Meal</h2>
              <p className="text-gray-500 text-sm mb-5">
                Take a new photo or choose one from your gallery.<br />
                <span className="font-semibold text-orange-600">AI identifies the dish instantly.</span>
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={e => { e.stopPropagation(); cameraRef.current?.click() }}
                  className="flex items-center gap-1.5 bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-orange-200 active:scale-95 transition-transform"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth={2} />
                  </svg>
                  Take Photo
                </button>
                <button
                  onClick={e => { e.stopPropagation(); galleryRef.current?.click() }}
                  className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold active:scale-95 transition-transform"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Gallery
                </button>
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

            {/* Glossary CTA */}
            <Link
              href="/glossary"
              className="flex items-center justify-between w-full bg-white rounded-2xl px-5 py-4 border border-gray-100 hover:border-orange-300 hover:shadow-sm hover:shadow-orange-50 transition-all duration-150 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  📖
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-sm">Food Glossary</div>
                  <div className="text-xs text-gray-400">{Object.keys(DISHES).length} dishes · search &amp; log manually</div>
                </div>
              </div>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </>
        )}

        {phase === 'limit-reached' && (
          <div className="flex flex-col items-center pt-10 text-center px-2">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-4xl mb-6">🔒</div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Daily limit reached</h2>
            <p className="text-gray-500 text-sm mb-1">You've used your {FREE_SCAN_LIMIT} free scans for today.</p>
            <p className="text-gray-400 text-xs mb-8">Resets at midnight · Upgrade for unlimited scans</p>

            <Link
              href="/pricing"
              className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black text-base text-center shadow-lg shadow-orange-200 active:scale-95 transition-transform mb-3 block"
            >
              Upgrade to Pro →
            </Link>
            <button
              onClick={() => setPhase('idle')}
              className="w-full bg-white text-gray-500 py-3 rounded-2xl font-semibold text-sm border border-gray-200 active:scale-95 transition-transform"
            >
              Back
            </button>
          </div>
        )}

        {phase === 'pro-limit-reached' && (
          <div className="flex flex-col items-center pt-10 text-center px-2">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-4xl mb-6">📅</div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Monthly limit reached</h2>
            <p className="text-gray-500 text-sm mb-1">You've used all {PRO_MONTHLY_SCAN_LIMIT} Pro scans for this month.</p>
            <p className="text-gray-400 text-xs mb-8">Resets on the 1st · You can still log meals manually from the glossary</p>
            <Link
              href="/glossary"
              className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black text-base text-center shadow-lg shadow-orange-200 active:scale-95 transition-transform mb-3 block"
            >
              Browse Food Glossary →
            </Link>
            <button
              onClick={() => setPhase('idle')}
              className="w-full bg-white text-gray-500 py-3 rounded-2xl font-semibold text-sm border border-gray-200 active:scale-95 transition-transform"
            >
              Back
            </button>
          </div>
        )}

        {phase === 'confirm' && (
          <div className="flex flex-col items-center pt-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Confirm your photo</p>

            <div className="w-full rounded-3xl overflow-hidden mb-5 shadow-xl shadow-orange-100 ring-4 ring-orange-100 bg-black" style={{ maxHeight: '55vw', minHeight: 220 }}>
              <img
                src={preview}
                alt="Selected meal"
                className="w-full h-full object-cover"
                style={{ maxHeight: '55vw', minHeight: 220 }}
              />
            </div>

            <p className="text-sm text-gray-500 mb-6 text-center">
              Is this the right photo? Tap <span className="font-bold text-gray-800">Analyse</span> to identify the dish.
            </p>

            <button
              onClick={() => startAnalysis(pendingFile)}
              className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-orange-200 active:scale-95 transition-transform mb-3"
            >
              Analyse This Dish →
            </button>

            <button
              onClick={handleRetake}
              className="w-full bg-white text-gray-600 py-3.5 rounded-2xl font-semibold text-sm border border-gray-200 active:scale-95 transition-transform"
            >
              Choose a Different Photo
            </button>
          </div>
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
