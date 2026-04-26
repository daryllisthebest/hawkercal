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

const TESTIMONIALS = [
  {
    avatar: '👨🏽',
    name: 'Ahmad F.',
    handle: '@ahmadfit.sg',
    location: 'Singapore',
    text: 'Finally an app that actually knows what Char Kway Teow is! Every other calorie tracker made me search and guess manually. This nailed it first try.',
    stars: 5,
  },
  {
    avatar: '👩🏻',
    name: 'Sarah L.',
    handle: '@sarahkl',
    location: 'Kuala Lumpur',
    text: "Been using HawkerCal for 3 weeks and down 2.5kg. The portion questions make such a difference — it's not just generic calories anymore.",
    stars: 5,
  },
  {
    avatar: '👩🏽',
    name: 'Nat W.',
    handle: '@natbkk',
    location: 'Bangkok',
    text: 'Love that it knows the difference between Pad Thai and Pad See Ew! Western apps always get Thai food wrong. This one is spot-on.',
    stars: 5,
  },
]

const FLAGS = ['🇸🇬', '🇲🇾', '🇹🇭', '🇮🇩', '🇻🇳', '🇵🇭']

export default function LandingPage() {
  const [annual, setAnnual] = useState(true)
  const monthlyPro = annual ? 3.99 : 5.99

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 glass border-b border-orange-100/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-lg shadow-sm">
              🍜
            </div>
            <span className="font-extrabold text-gray-900 text-lg tracking-tight">
              HawkerCal <span className="text-orange-500">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <a href="#how-it-works" className="text-gray-500 hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#dishes" className="text-gray-500 hover:text-gray-900 transition-colors">Dishes</a>
            <a href="#pricing" className="text-gray-500 hover:text-gray-900 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/log" className="hidden md:block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
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

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-amber-50/30 to-white pt-20 pb-28">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 -left-20 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
          {['🍜', '🍚', '🍛', '🥘', '🍢', '🍲', '🧋', '🫓'].map((e, i) => (
            <span
              key={i}
              className="absolute text-5xl opacity-[0.12]"
              style={{
                left: `${5 + i * 12}%`,
                top: `${10 + (i % 4) * 22}%`,
                animation: `float ${2.5 + (i % 3) * 0.8}s ease-in-out ${i * 0.35}s infinite`,
              }}
            >
              {e}
            </span>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm mb-8">
            <span className="flex gap-1">{FLAGS.map(f => <span key={f} className="text-base">{f}</span>)}</span>
            <span className="text-gray-300">•</span>
            Built for Southeast Asian food
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 leading-[1.05] mb-6 tracking-tight">
            Know what's in<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500">
              your hawker bowl.
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI calorie tracking built for Singapore, Malaysia, Thailand and beyond.{' '}
            <strong className="text-gray-700 font-semibold">Snap your meal. Log in 10 seconds.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link
              href="/scan"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-orange-200 hover:shadow-orange-300 transition-all hover:scale-105 active:scale-95"
            >
              📸 Snap Your Meal — It's Free
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-orange-300 text-gray-700 hover:text-orange-600 px-8 py-4 rounded-2xl text-lg font-semibold transition-all"
            >
              See how it works ↓
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
            {['Free forever plan', 'No sign-up needed', 'Works offline', 'Data stays on device'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="text-green-500 font-bold">✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="bg-gray-950 text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: '50,000+', label: 'SEA dishes in database', color: 'text-orange-400' },
              { val: '98%', label: 'Detection accuracy', color: 'text-amber-400' },
              { val: '6', label: 'Countries supported', color: 'text-yellow-400' },
              { val: '4.8 ★', label: 'Average user rating', color: 'text-orange-400' },
            ].map(s => (
              <div key={s.label}>
                <div className={`text-3xl font-black ${s.color}`}>{s.val}</div>
                <div className="text-sm text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
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

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-orange-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-orange-500 uppercase tracking-widest">User Love</span>
            <h2 className="text-4xl font-black text-gray-900 mt-3 mb-4">Hawker fans across SEA love it</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white rounded-3xl p-6 shadow-sm shadow-orange-100 border border-orange-100/50 hover:shadow-md hover:shadow-orange-100 transition-shadow">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} className="text-amber-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-5 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">{t.avatar}</div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.location} · {t.handle}</div>
                  </div>
                </div>
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
