'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

const FREE_FEATURES = [
  { icon: '📸', text: '3 AI food scans per day' },
  { icon: '📅', text: 'Daily food log' },
  { icon: '🔢', text: 'Basic calorie estimate' },
]

const PRO_FEATURES = [
  { icon: '♾️', text: 'Unlimited AI scans', highlight: true },
  { icon: '🧠', text: 'Weekly AI insights', highlight: true },
  { icon: '🔍', text: 'Hidden calories breakdown', highlight: true },
  { icon: '🍜', text: 'Southeast Asian food database (50+ dishes)', highlight: true },
  { icon: '🥗', text: 'Healthier meal suggestions', highlight: true },
  { icon: '⚖️', text: 'Weight goal tracking', highlight: true },
]

const COMPARE = [
  { feature: 'Daily AI scans', free: '3', pro: 'Unlimited' },
  { feature: 'Daily log', free: '✓', pro: '✓' },
  { feature: 'Calorie tracking', free: 'Basic', pro: 'Advanced' },
  { feature: 'Hidden calories breakdown', free: '✕', pro: '✓' },
  { feature: 'Weekly AI insights', free: '✕', pro: '✓' },
  { feature: 'Healthier suggestions', free: '✕', pro: '✓' },
  { feature: 'Weight goal tracking', free: '✕', pro: '✓' },
]

const FAQS = [
  { q: 'Is the free plan really free forever?', a: 'Yes! The free plan has no expiry and requires no credit card. All you get is the 3 daily scans and basic daily log.' },
  { q: 'How accurate is the AI calorie detection?', a: 'Our AI achieves ~98% accuracy on common SEA hawker foods. Weekly insights and hidden calorie breakdowns help refine estimates further.' },
  { q: 'Can I cancel Pro anytime?', a: 'Absolutely. No questions asked, no hidden fees. Cancel from your account settings whenever you want.' },
  { q: 'What if I go over 3 scans on the free plan?', a: 'The 4th scan will be blocked. You can upgrade to Pro anytime to unlock unlimited scans.' },
  { q: 'Which cuisines do you support?', a: 'We specialize in Southeast Asian cuisines: Singapore, Malaysia, Thailand, Indonesia, and Vietnam.' },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen bg-orange-50 pb-28">

      <header className="glass border-b border-orange-100/60 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/log" className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-bold text-gray-900">Upgrade to Pro</h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-8 space-y-6">

        {/* Hero */}
        <div className="text-center py-2">
          <div className="text-6xl mb-4 animate-bounce">🍜</div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 leading-tight">
            Track Smarter,<br />Eat Healthier
          </h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-sm mx-auto">
            Unlimited scans. AI insights. Hidden calorie breakdowns. Everything you need to master your health.
          </p>
        </div>

        {/* Pro Card - Premium */}
        <div className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-black rounded-3xl p-6 text-white overflow-hidden shadow-2xl">
          {/* Glow effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            {/* Most Popular Badge */}
            <div className="inline-flex items-center gap-1.5 bg-orange-500/20 border border-orange-400/50 rounded-full px-3 py-1 mb-4">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              <span className="text-xs font-black text-orange-400 uppercase tracking-widest">Most Popular</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Pro Plan</div>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-white">S$4.99</span>
                <span className="text-gray-400 font-semibold">/month</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Cancel anytime · No hidden fees</p>
            </div>

            {/* Features Grid */}
            <div className="space-y-3 mb-8">
              {PRO_FEATURES.map(f => (
                <div key={f.text} className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">{f.icon}</span>
                  <span className="text-sm text-gray-100 font-medium leading-snug">{f.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-2xl font-black text-base shadow-xl shadow-orange-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] mb-3">
              Start Tracking Smarter
            </button>

            <p className="text-center text-gray-400 text-xs">7-day free trial included</p>
          </div>
        </div>

        {/* Free Plan Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="mb-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Free Forever</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-gray-900">S$0</span>
              <span className="text-sm text-gray-500">No credit card needed</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {FREE_FEATURES.map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                  {f.icon}
                </div>
                <span className="text-sm text-gray-700">{f.text}</span>
              </div>
            ))}
          </div>

          <Link
            href="/scan"
            className="block w-full text-center border-2 border-gray-300 hover:border-orange-400 text-gray-700 hover:text-orange-600 py-3 rounded-2xl font-bold text-sm transition-colors"
          >
            Continue with Free
          </Link>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">Full Feature Comparison</h3>
          </div>
          <div className="divide-y divide-gray-50">
            <div className="grid grid-cols-3 px-5 py-3 bg-gray-50/50 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
              <span>Feature</span>
              <span className="text-center">Free</span>
              <span className="text-center text-orange-600">Pro</span>
            </div>
            {COMPARE.map(row => (
              <div key={row.feature} className="grid grid-cols-3 px-5 py-3.5 items-center text-sm">
                <span className="text-gray-800 font-medium">{row.feature}</span>
                <span className="text-center text-gray-500 text-xs">{row.free}</span>
                <span className="text-center font-semibold text-gray-900 text-xs">{row.pro}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        {/* FAQ */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Questions?</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {FAQS.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-800 pr-4">{faq.q}</span>
                  <span className={`text-xl flex-shrink-0 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                    →
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 bg-gray-50/30">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center py-4 space-y-3">
          <p className="text-sm font-semibold text-gray-700">
            Still have questions?
          </p>
          <p className="text-xs text-gray-500">
            Email us at support@hawkercal.app
          </p>
        </div>

      </div>

      <BottomNav />
    </div>
  )
}
