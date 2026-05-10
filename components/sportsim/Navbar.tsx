'use client'

import Link from 'next/link'
import { useState } from 'react'

const LEAGUES = [
  { name: 'World Cup 2026', slug: 'world-cup-2026' },
  { name: 'Premier League', slug: 'premier-league' },
  { name: 'Champions League', slug: 'champions-league' },
  { name: 'NBA', slug: 'nba' },
  { name: 'NFL', slug: 'nfl' },
  { name: 'NHL', slug: 'nhl' },
  { name: 'Cricket World Cup', slug: 'icc-cricket-world-cup' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-black text-white text-sm">
              SS
            </div>
            <span className="font-bold text-white text-lg">SportSim <span className="text-blue-500">AI</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {LEAGUES.slice(0, 4).map((l) => (
              <Link
                key={l.slug}
                href={`/simulate/${l.slug}`}
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                {l.name}
              </Link>
            ))}
            <div className="relative group">
              <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                More ▾
              </button>
              <div className="absolute top-full right-0 mt-1 bg-gray-900 border border-gray-800 rounded-xl shadow-xl min-w-48 hidden group-hover:block">
                {LEAGUES.slice(4).map((l) => (
                  <Link
                    key={l.slug}
                    href={`/simulate/${l.slug}`}
                    className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 first:rounded-t-xl last:rounded-b-xl"
                  >
                    {l.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 space-y-1">
            {LEAGUES.map((l) => (
              <Link
                key={l.slug}
                href={`/simulate/${l.slug}`}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
              >
                {l.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
