'use client'
import Link from 'next/link'
import { useState } from 'react'

const SAMPLE_DISHES = [
  { name: 'Chicken Rice', cal: 480, emoji: '🍚', tag: 'SG Favourite', tagColor: 'bg-amber-100 text-amber-700' },
  { name: 'Nasi Lemak', cal: 620, emoji: '🍛', tag: 'Malaysian Classic', tagColor: 'bg-green-100 text-green-700' },
  { name: 'Char Kway Teow', cal: 680, emoji: '🥘', tag: 'Wok Hei', tagColor: 'bg-orange-100 text-orange-700' },
  { name: 'Laksa', cal: 610, emoji: '🍜', tag: 'Spicy', tagColor: 'bg-red-100 text-red-700' },
  { name: 'Cai Png', cal: 520, emoji: '🍱', tag: 'Value Meal', tagColor: 'bg-blue-100 text-blue-700' },
  { name: 'Pad Thai', cal: 560, emoji: '🍜', tag: 'Thai', tagColor: 'bg-yellow-100 text-yellow-700' },
  { name: 'Phở Bò', cal: 480, emoji: '🍲', tag: 'Vietnamese', tagColor: 'bg-emerald-100 text-emerald-700' },
  { name: 'Nasi Goreng', cal: 660, emoji: '🍛', tag: 'Indonesian', tagColor: 'bg-amber-100 text-amber-700' },
  { name: 'Bubble Tea (L)', cal: 330, emoji: '🧋', tag: 'Drink', tagColor: 'bg-purple-100 text-purple-700' },
  { name: 'Roti Prata', cal: 350, emoji: '🫓', tag: 'Indian', tagColor: 'bg-orange-100 text-orange-700' },
  { name: 'Hokkien Mee', cal: 580, emoji: '🍝', tag: 'SG Classic', tagColor: 'bg-amber-100 text-amber-700' },
  { name: 'Satay (5 sticks)', cal: 400, emoji: '🍢', tag: 'Grilled', tagColor: 'bg-yellow-100 text-yellow-700' },
]

const FEATURES = [
  {
    icon: '🎯',
    title: 'Built for SEA Hawker Food',
    desc: 'Trained on 50,000+ photos of hawker, kopitiam, and street food dishes from Singapore, Malaysia, Thailand, Indonesia, and Vietnam.',
    accent: 'from-orange-500 to-amber-500',
  },
  {
    icon: '📊',
    title: 'Portion-Smart AI',
    desc: "Not all chicken rice is equal. We ask 3 quick follow-up questions about portion size, oil level, and add-ons for real accuracy.",
    accent: 'from-blue-500 to-indigo-500',
  },
  {
    icon: '🔒',
    title: 'Private & No Sign-Up',
    desc: 'Your food log lives on your device. No account creation, no email required. Start tracking in under 30 seconds.',
    accent: 'from-green-500 to-emerald-500',
  },
]

const STEPS = [
  { emoji: '📸', step: '01', title: 'Snap or Upload', desc: 'Take a photo of your hawker meal or upload from your gallery' },
  { emoji: '🤖', step: '02', title: 'AI Identifies', desc: 'Our model recognises the dish and pulls up base nutritional data' },
  { emoji: '✅', step: '03', title: 'Refine in 3 Taps', desc: 'Answer quick questions about portion, oil, and add-ons' },
  { emoji: '📊', step: '04', title: 'Track & Improve', desc: 'View your daily log, weekly trends, and personalised insights' },
]

const FLAGS = ['🇸🇬', '🇲🇾', '🇹🇭', '🇮🇩', '🇻🇳', '🇵🇭']

export default function LandingPage() {
  const [annual, setAnnual] = useState(true)
  const monthlyPro = annual ? 3.99 : 5.99

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── HEADER (DARK) ── */}
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur border-b border-gray-900/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-lg shadow-sm">
              🍜
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight">
              HawkerCal <span className="text-orange-500">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a>
            <a href="#dishes" className="text-gray-400 hover:text-white transition-colors">Dishes</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/log" className="hidden md:block text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Open App
            </Link>
            <Link
              href="/scan"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-orange-200 transition-all hover:shadow-orange-300 active:scale-95"
            >
              Start Free →
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO (DARK WITH PHONE MOCKUPS) ── */}
      <section className="relative overflow-hidden bg-gray-950 pt-16 pb-24 md:pt-32 md:pb-32">
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* LEFT COLUMN: Text Content */}
            <div className="text-white">
              {/* Flag badge */}
              <div className="inline-flex items-center gap-2 border border-gray-700 rounded-full px-4 py-2 text-sm font-semibold mb-8">
                <span className="flex gap-0.5">{FLAGS.map(f => <span key={f} className="text-base">{f}</span>)}</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">Built for SEA food</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black leading-[1.1] mb-6 tracking-tight">
                Know what's in<br />
                your hawker{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                  bowl.
                </span>
              </h1>

              <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-xl">
                AI calorie tracking built for Singapore, Malaysia, Thailand and beyond. Snap your meal. Log in 10 seconds.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  href="/scan"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-orange-900/30 transition-all hover:scale-105 active:scale-95 text-lg"
                >
                  📸 Snap Your Meal — Free →
                </Link>
                <a
                  href="#how-it-works"
                  className="flex items-center justify-center gap-2 border-2 border-gray-700 hover:border-orange-500 text-gray-300 hover:text-white px-8 py-4 rounded-2xl font-bold transition-all"
                >
                  See how it works ↓
                </a>
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                {['Free forever', 'No sign-up', 'Data on device'].map(t => (
                  <span key={t} className="flex items-center gap-1.5">
                    <span className="text-green-500">✓</span> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Phone Mockups */}
            <div className="relative h-[500px] md:h-[600px] hidden md:flex items-center justify-center">
              {/* Back phone - rotated left, showing Result screen */}
              <div
                className="absolute"
                style={{
                  width: '280px',
                  height: '580px',
                  left: '20px',
                  transform: 'rotate(-6deg)',
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: '#000',
                    borderRadius: '40px',
                    border: '12px solid #374151',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Status bar */}
                  <div style={{ background: '#111', height: '24px', paddingTop: '6px' }} />

                  {/* Content area - Result screen */}
                  <div style={{ flex: 1, background: '#1a1a1a', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>🍚</div>
                    <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
                      Chicken Rice detected
                    </div>

                    {/* Calorie badge */}
                    <div
                      style={{
                        background: '#f97316',
                        color: '#fff',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginBottom: '16px',
                        textAlign: 'center',
                      }}
                    >
                      480 kcal
                    </div>

                    {/* Confidence */}
                    <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '12px' }}>
                      98% confident
                    </div>

                    {/* Macro bars */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                      {[
                        { label: 'P', color: '#ef4444', pct: 45 },
                        { label: 'C', color: '#eab308', pct: 65 },
                        { label: 'F', color: '#f97316', pct: 35 },
                      ].map(m => (
                        <div key={m.label} style={{ flex: 1 }}>
                          <div
                            style={{
                              height: '32px',
                              background: m.color,
                              borderRadius: '8px',
                              marginBottom: '4px',
                            }}
                          />
                          <div style={{ color: '#9ca3af', fontSize: '11px', textAlign: 'center' }}>
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      style={{
                        background: '#f97316',
                        color: '#fff',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginTop: 'auto',
                      }}
                    >
                      Log this meal
                    </button>
                  </div>
                </div>
              </div>

              {/* Front phone - slight rotation, showing Log screen */}
              <div
                className="absolute"
                style={{
                  width: '280px',
                  height: '580px',
                  right: '20px',
                  transform: 'rotate(-3deg)',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: '#000',
                    borderRadius: '40px',
                    border: '12px solid #374151',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Status bar */}
                  <div style={{ background: '#111', height: '24px', paddingTop: '6px' }} />

                  {/* Content - Log screen */}
                  <div style={{ flex: 1, background: '#1a1a1a', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                      Today's Log
                    </div>

                    {/* Calorie ring */}
                    <div
                      style={{
                        width: '100px',
                        height: '100px',
                        margin: '0 auto 16px',
                        position: 'relative',
                      }}
                    >
                      <svg
                        viewBox="0 0 100 100"
                        style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}
                      >
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="6" />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="6"
                          strokeDasharray="113"
                          strokeDashoffset="0"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          color: '#f97316',
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}
                      >
                        760<br />kcal
                      </div>
                    </div>

                    {/* Meals */}
                    <div style={{ space: '8px', flex: 1, overflowY: 'auto' }}>
                      {[
                        { emoji: '🍚', name: 'Chicken Rice', cal: '480' },
                        { emoji: '🧋', name: 'Bubble Tea', cal: '280' },
                      ].map((meal, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px',
                            background: '#222',
                            borderRadius: '8px',
                            marginBottom: '8px',
                            fontSize: '12px',
                          }}
                        >
                          <span style={{ fontSize: '18px' }}>{meal.emoji}</span>
                          <span style={{ color: '#e5e7eb', flex: 1 }}>{meal.name}</span>
                          <span style={{ color: '#9ca3af' }}>{meal.cal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom nav */}
                  <div
                    style={{
                      background: '#111',
                      borderTop: '1px solid #374151',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      fontSize: '16px',
                    }}
                  >
                    <span>📊</span>
                    <span style={{ color: '#f97316', fontSize: '24px' }}>+</span>
                    <span>⚙️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-orange-500 uppercase tracking-widest">How It Works</span>
            <h2 className="text-4xl font-black text-gray-900 mt-3 mb-4">From photo to logged — in seconds</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">No more guessing or scrolling through generic food databases.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative group">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-orange-200 to-transparent z-0 -translate-x-4" />
                )}
                <div className="bg-orange-50 rounded-3xl p-6 hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-4">
                    {s.emoji}
                  </div>
                  <div className="text-xs font-black text-orange-300 tracking-widest mb-2">{s.step}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISH SHOWCASE ── */}
      <section id="dishes" className="py-24 bg-gradient-to-b from-orange-50/50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-orange-500 uppercase tracking-widest">Dish Database</span>
            <h2 className="text-4xl font-black text-gray-900 mt-3 mb-4">We know your favourite hawker dishes</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">From chicken rice to bubble tea — every popular SEA dish with accurate calorie ranges.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {SAMPLE_DISHES.map(d => (
              <div
                key={d.name}
                className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{d.emoji}</div>
                <div className="text-sm font-bold text-gray-900 mb-1 leading-tight">{d.name}</div>
                <div className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${d.tagColor}`}>{d.tag}</div>
                <div className="text-xl font-black text-orange-500">{d.cal}</div>
                <div className="text-xs text-gray-400">kcal (avg)</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/scan" className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600 transition-colors">
              Try scanning any of these →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-orange-500 uppercase tracking-widest">Why HawkerCal</span>
            <h2 className="text-4xl font-black text-gray-900 mt-3 mb-4">Built different. Built for us.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map(f => (
              <div key={f.title} className="group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.accent} flex items-center justify-center text-2xl shadow-lg mb-5 group-hover:scale-110 transition-transform duration-200`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-sm font-bold text-orange-500 uppercase tracking-widest">Pricing</span>
            <h2 className="text-4xl font-black text-gray-900 mt-3 mb-4">Simple, honest pricing</h2>
            <p className="text-gray-500 mb-8">Start free. Upgrade when you're ready.</p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-3 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${!annual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${annual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
              >
                Annual <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">–33%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="rounded-3xl border-2 border-gray-100 p-8">
              <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Free</div>
              <div className="text-5xl font-black text-gray-900 mb-1">S$0</div>
              <div className="text-gray-400 text-sm mb-8">Forever free, no credit card</div>
              <ul className="space-y-3 mb-8">
                {['10 AI scans per day', '7-day food history', 'Daily calorie log', 'Basic macros'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xs font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/scan" className="block w-full text-center border-2 border-gray-200 hover:border-orange-300 text-gray-700 hover:text-orange-600 py-3.5 rounded-2xl font-bold transition-all">
                Get Started Free
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-8 text-white relative overflow-hidden shadow-xl shadow-orange-200">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-full">
                Most Popular
              </div>
              <div className="text-sm font-bold text-orange-100 uppercase tracking-widest mb-3">Pro</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-black">S${monthlyPro}</span>
                <span className="text-orange-100">/mo</span>
              </div>
              <div className="text-orange-100 text-sm mb-8">{annual ? 'Billed annually · save S$24/yr' : 'Billed monthly'}</div>
              <ul className="space-y-3 mb-8">
                {['Unlimited AI scans', 'Full history & export', 'Weekly AI insights', 'Calorie goal coaching', 'Priority support', 'Early access to new features'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="block w-full text-center bg-white text-orange-600 hover:bg-orange-50 py-3.5 rounded-2xl font-bold transition-all hover:shadow-lg">
                Upgrade to Pro →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 bg-gradient-to-br from-gray-950 to-gray-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-6xl mb-6">🍜</div>
          <h2 className="text-4xl sm:text-5xl font-black mb-5 leading-tight">
            Start knowing what's in<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">your hawker bowl.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">Free. No sign-up. Works on any phone. Takes 10 seconds.</p>
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-10 py-5 rounded-2xl text-xl font-black shadow-2xl shadow-orange-900/50 transition-all hover:scale-105 active:scale-95"
          >
            📸 Snap Your First Meal
          </Link>
          <p className="text-gray-600 text-sm mt-6">No credit card • No account • Works offline</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-950 border-t border-gray-900 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍜</span>
            <span className="font-extrabold text-white">HawkerCal <span className="text-orange-500">AI</span></span>
          </div>
          <div className="text-gray-600 text-sm text-center">
            Made with ❤️ for hawker lovers across Singapore & Southeast Asia
          </div>
          <div className="flex gap-5 text-sm text-gray-600">
            <Link href="/pricing" className="hover:text-gray-400 transition-colors">Pricing</Link>
            <Link href="/log" className="hover:text-gray-400 transition-colors">App</Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(3deg); }
        }
      `}</style>
    </div>
  )
}
