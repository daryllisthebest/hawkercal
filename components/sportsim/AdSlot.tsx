'use client'

type AdSlotProps = {
  size: 'leaderboard' | 'medium-rectangle' | 'sidebar'
  className?: string
}

const dimensions: Record<AdSlotProps['size'], { w: number; h: number; label: string }> = {
  leaderboard: { w: 728, h: 90, label: '728×90 Leaderboard' },
  'medium-rectangle': { w: 300, h: 250, label: '300×250 Rectangle' },
  sidebar: { w: 300, h: 250, label: '300×250 Sidebar' },
}

export default function AdSlot({ size, className = '' }: AdSlotProps) {
  const { w, h, label } = dimensions[size]
  return (
    <div
      className={`ad-slot flex items-center justify-center bg-gray-900 border border-gray-800 text-gray-600 text-xs rounded ${className}`}
      style={{ width: w, maxWidth: '100%', height: h }}
      aria-label="Advertisement"
      data-ad-size={size}
    >
      {/* PropellerAds / Monetag ad code goes here */}
      <span>{label} Ad</span>
    </div>
  )
}
