export function CardSkeleton() {
  return (
    <div className="bg-gray-900 rounded-xl p-5 animate-pulse space-y-3">
      <div className="h-4 bg-gray-800 rounded w-3/4" />
      <div className="h-4 bg-gray-800 rounded w-1/2" />
      <div className="h-20 bg-gray-800 rounded" />
    </div>
  )
}

export function NarrativeSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-gray-800 rounded w-full" />
      <div className="h-4 bg-gray-800 rounded w-5/6" />
      <div className="h-4 bg-gray-800 rounded w-4/6" />
      <div className="h-4 bg-gray-800 rounded w-full" />
      <div className="h-4 bg-gray-800 rounded w-3/4" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-800 rounded" />
      ))}
    </div>
  )
}

export function ProbabilityBarSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-4 bg-gray-800 rounded w-32" />
          <div className="flex-1 h-4 bg-gray-800 rounded" />
          <div className="h-4 bg-gray-800 rounded w-12" />
        </div>
      ))}
    </div>
  )
}
