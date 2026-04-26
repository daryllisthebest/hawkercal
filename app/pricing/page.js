'use client'
import { useState } from 'react'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

const FREE_FEATURES = [
  { icon: '📸', text: '10 AI food scans per day' },
  { icon: '📅', text: '7-day food history' },
  { icon: '🔢', text: 'Daily calorie log' },
  { icon: '📊', text: 'Basic macro breakdown' },
]

const PRO_FEATURES = [
  { icon: '♾️', text: 'Unlimited AI scans', highlight: true },
  { icon: '📅', text: 'Full history, no limit', highlight: true },
  { icon: '🧠', text: 'Weekly AI insights & coaching', highlight: true },
  { icon: '📤', text: 'Export data to CSV', highlight: true },
]

const COMPARE = [
  { feature: 'AI food scans', free: '10/day', pro: 'Unlimited' },
  { feature: 'Food history', free: '7 days', pro: 'Unlimited' },
  { feature: 'Calorie tracking', free: '✓', pro: '✓' },
  { feature: 'Macro breakdown', free: 'Basic', pro: 'Full + trends' },
  { feature: 'Weekly insights', free: '✕', pro: 'AI-powered' },
]

const FAQS = [
  { q: 'Is the free plan really free forever?', a: 'Yes! The free plan has no expiry date and no credit card required.' },
  { q: 'How accurate is the AI calorie detection?', a: 'Our AI achieves ~98% dish identification accuracy on common SEA hawker foods.' },
  { q: 'Can I cancel my Pro plan anytime?', a: 'Absolutely. Cancel anytime from your account settings — no questions asked.' },
  { q: 'Does it work for Malaysian, Thai, Indonesian and Vietnamese food?', a: 'Yes! We support dishes from Singapore, Malaysia, Thailand, Indonesia, and Vietnam.' },
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState(null)

  const monthlyPrice = annual ? 3.99 : 5.99

  return (
    <div className="min-h-screen bg-orange-50 pb-28">

      <header className="glass border-b border-orange-100/60 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/log" className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-bold text-gray-900">Upgrade to Pro</h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-6 space-y-5">

        <div className="text-center py-4">
          <div className="text-5xl mb-3">✨</div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Level up your hawker journey</h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
            Unlock unlimited scans, AI coaching, and full history to hit your health goals faster.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="inline-flex items-center bg-white border border-gray-200 rounded-2xl p-1 shadow-sm gap-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${!annual ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${annual ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Annual
              <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full font-black">SAVE 33%</span>
            </button>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 rounded-3xl p-6 text-white overflow-hidden shadow-2xl shadow-gray-900/30">
          <div className="relative">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="text-xs font-black text-orange-400 uppercase tracking-widest mb-2">Pro Plan</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black">S${monthlyPrice}</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-400 to-amber-500 p-0.5 rounded-2xl">
                <div className="bg-gray-900 rounded-[14px] px-3 py-2 text-xs font-black text-orange-400 text-center">
                  MOST<br />POPULAR
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {PRO_FEATURES.map(f => (
                <div key={f.text} className="flex items-center gap-3">
                  <span className="text-sm">{f.icon}</span>
                  <span className={`text-sm ${f.highlight ? 'text-white font-semibold' : 'text-gray-400'}`}>
                    {f.text}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-orange-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Start Pro — S${monthlyPrice}/mo
            </button>
            <p className="text-center text-gray-500 text-xs mt-3">Cancel anytime · No hidden fees · 7-day free trial</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Free Plan</div>
              <div className="text-4xl font-black text-gray-900">S$0</div>
              <div className="text-sm text-gray-400">Forever free</div>
            </div>
          </div>
          <div className="space-y-2.5 mb-5">
            {FREE_FEATURES.map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-sm flex-shrink-0">{f.icon}</div>
                <span className="text-sm text-gray-600">{f.text}</span>
              </div>
            ))}
          </div>
          <Link href="/scan" className="block w-full text-center border-2 border-gray-200 hover:border-orange-300 text-gray-700 hover:text-orange-600 py-3.5 rounded-2xl font-bold transition-all text-sm">
            Continue with Free
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-base">Plan Comparison</h3>
          </div>
          <div className="divide-y divide-gray-50">
            <div className="grid grid-cols-3 px-5 py-3 bg-gray-50/50">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Feature</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide text-center">Free</span>
              <span className="text-xs font-bold text-orange-500 uppercase tracking-wide text-center">Pro</span>
            </div>
            {COMPARE.map(row => (
              <div key={row.feature} className="grid grid-cols-3 px-5 py-3 items-center">
                <span className="text-xs text-gray-700 font-medium pr-2">{row.feature}</span>
                <span className="text-xs text-gray-400 text-center tabular-nums">{row.free}</span>
                <span className="text-xs text-gray-800 font-semibold text-center tabular-nums">{row.pro}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
          <div className="flex gap-0.5 mb-2">
            {[1,2,3,4,5].map(i => <span key={i} className="text-amber-400">★</span>)}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            "Upgraded to Pro after 3 days on free. The weekly AI coaching alone is worth it!"
          </p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-base">👩🏻</div>
            <div>
              <div className="text-xs font-bold text-gray-900">Priya N. · Singapore</div>
              <div className="text-[10px] text-gray-400">HawkerCal Pro user</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-base">Frequently Asked Questions</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {FAQS.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors group"
                >
                  <span className="text-sm font-semibold text-gray-800 pr-4 leading-snug">{faq.q}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  )
}
