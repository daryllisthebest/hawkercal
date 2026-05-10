import Link from 'next/link'
import AdSlot from '@/components/sportsim/AdSlot'

const LEAGUES = [
  {
    name: 'World Cup 2026',
    slug: 'world-cup-2026',
    sport: 'Football',
    badge: '🌍',
    featured: true,
    description: '48-team tournament — North America 2026',
  },
  {
    name: 'Premier League',
    slug: 'premier-league',
    sport: 'Football',
    badge: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    description: '2024/25 Season',
  },
  {
    name: 'Champions League',
    slug: 'champions-league',
    sport: 'Football',
    badge: '⭐',
    description: '2024/25 Season',
  },
  {
    name: 'NBA',
    slug: 'nba',
    sport: 'Basketball',
    badge: '🏀',
    description: '2024/25 Season',
  },
  {
    name: 'NFL',
    slug: 'nfl',
    sport: 'American Football',
    badge: '🏈',
    description: '2024/25 Season',
  },
  {
    name: 'NHL',
    slug: 'nhl',
    sport: 'Ice Hockey',
    badge: '🏒',
    description: '2024/25 Season',
  },
  {
    name: 'Cricket World Cup',
    slug: 'icc-cricket-world-cup',
    sport: 'Cricket',
    badge: '🏏',
    description: 'ICC 2025',
  },
]

export default function HomePage() {
  const featured = LEAGUES.find((l) => l.featured)!
  const rest = LEAGUES.filter((l) => !l.featured)

  return (
    <main>
      {/* Top leaderboard ad */}
      <div className="flex justify-center pt-4 px-4">
        <AdSlot size="leaderboard" />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 text-blue-400 text-sm mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            AI-Powered Simulation Engine
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight">
            Simulate The <span className="text-blue-500">World</span>
          </h1>
          <p className="mt-6 text-xl text-gray-400 leading-relaxed">
            Run Monte Carlo simulations across 7 major sports leagues. Get Claude AI-generated analyst narratives.
            Explore championship probabilities and match previews.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={`/sportsim/champion/${featured.slug}`}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-colors"
            >
              Simulate World Cup 2026
            </Link>
            <Link
              href="/sportsim/simulate/premier-league"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
            >
              View All Leagues
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tournament Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Link href={`/sportsim/champion/${featured.slug}`}>
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 rounded-2xl p-8 overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/20 transition-all">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="text-5xl mb-3">🌍</div>
                <h2 className="text-3xl font-black text-white">FIFA World Cup 2026</h2>
                <p className="text-blue-200 mt-2">48 teams · North America · Summer 2026</p>
                <p className="text-blue-300 text-sm mt-1">Monte Carlo simulation · 1,000 iterations</p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-center">
                  <div className="text-2xl font-black text-white">1,000</div>
                  <div className="text-blue-200 text-xs">Simulations</div>
                </div>
                <span className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-5 py-2.5 rounded-xl group-hover:bg-blue-50 transition-colors">
                  Simulate Champion →
                </span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* League grid + sidebar ad */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-6">All Leagues</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((league) => (
                <Link
                  key={league.slug}
                  href={`/sportsim/simulate/${league.slug}`}
                  className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-xl p-5 flex items-start gap-4 transition-all group"
                >
                  <div className="text-3xl">{league.badge}</div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {league.name}
                    </div>
                    <div className="text-gray-500 text-sm mt-0.5">{league.sport}</div>
                    <div className="text-gray-600 text-xs mt-1">{league.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar ad */}
          <div className="hidden lg:block shrink-0">
            <AdSlot size="sidebar" />
          </div>
        </div>
      </section>

      {/* Simulation info strip */}
      <section className="bg-gray-900 border-y border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-blue-500">1,000×</div>
              <div className="text-gray-300 font-semibold mt-2">Monte Carlo Iterations</div>
              <div className="text-gray-500 text-sm mt-1">Per championship simulation run</div>
            </div>
            <div>
              <div className="text-4xl font-black text-blue-500">4</div>
              <div className="text-gray-300 font-semibold mt-2">Weighted Factors</div>
              <div className="text-gray-500 text-sm mt-1">Form · H2H · Home advantage · Fitness</div>
            </div>
            <div>
              <div className="text-4xl font-black text-blue-500">Claude AI</div>
              <div className="text-gray-300 font-semibold mt-2">Analyst Narratives</div>
              <div className="text-gray-500 text-sm mt-1">3-paragraph expert analysis on every sim</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
