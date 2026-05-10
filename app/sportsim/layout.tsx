import type { ReactNode } from 'react'
import Navbar from '@/components/sportsim/Navbar'

export const metadata = {
  title: 'SportSim AI — AI-Powered Sports Simulation Engine',
  description:
    'Simulate league seasons, championship outcomes, and individual matches with Monte Carlo simulations powered by Claude AI.',
}

export default function SportSimLayout({ children }: { children: ReactNode }) {
  return (
    <div className="sportsim-root min-h-screen bg-gray-950 text-white">
      <Navbar />
      {children}
      <footer className="border-t border-gray-800 mt-20 py-10 text-center text-gray-600 text-sm">
        <p>SportSim AI — Simulation for entertainment purposes only.</p>
        <p className="mt-1">Powered by Claude AI · Next.js · Supabase</p>
      </footer>
    </div>
  )
}
