'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const path = usePathname()
  const isLog = path === '/log' || path === '/'
  const isScan = path === '/scan' || path === '/result' || path === '/clarify'
  const isInsights = path === '/insights'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-orange-100/60 safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around h-[68px] px-2">

        <Link
          href="/log"
          className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all duration-200 ${
            isLog ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <svg className="w-6 h-6" fill={isLog ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-[11px] font-semibold tracking-wide">My Log</span>
        </Link>

        <Link href="/scan" className="flex flex-col items-center -mt-5 group">
          <div
            className={`w-[58px] h-[58px] rounded-full flex items-center justify-center shadow-lg transition-all duration-200 group-active:scale-95 ${
              isScan
                ? 'bg-orange-600 shadow-orange-300'
                : 'bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-200 group-hover:shadow-orange-300'
            }`}
          >
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <circle cx="12" cy="13" r="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className={`text-[11px] font-semibold tracking-wide mt-1 ${isScan ? 'text-orange-500' : 'text-gray-400'}`}>
            Scan
          </span>
        </Link>

        <Link
          href="/insights"
          className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all duration-200 ${
            isInsights ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <svg className="w-6 h-6" fill={isInsights ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-[11px] font-semibold tracking-wide">Insights</span>
        </Link>

      </div>
    </nav>
  )
}
