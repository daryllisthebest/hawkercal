export default function CalorieRing({ consumed = 0, goal = 2000, size = 180 }) {
  const strokeWidth = 12
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(consumed / goal, 1)
  const offset = circumference * (1 - pct)
  const remaining = Math.max(goal - consumed, 0)
  const isOver = consumed > goal
  const pctNum = Math.round(pct * 100)

  const trackColor = '#F3F4F6'
  const arcColor = isOver ? '#EF4444' : pct > 0.85 ? '#F59E0B' : '#F97316'

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 absolute inset-0">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={trackColor} strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={arcColor} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1), stroke 0.4s ease' }}
        />
      </svg>

      <div className="flex flex-col items-center z-10">
        <span className="text-3xl font-black text-gray-900 leading-none tabular-nums">
          {consumed.toLocaleString()}
        </span>
        <span className="text-xs text-gray-400 font-medium mt-0.5">of {goal.toLocaleString()} kcal</span>
        <div
          className="mt-2 px-3 py-0.5 rounded-full text-[11px] font-bold"
          style={{ backgroundColor: arcColor + '20', color: arcColor }}
        >
          {isOver
            ? `${(consumed - goal).toLocaleString()} over`
            : remaining === 0
            ? 'Goal hit! 🎉'
            : `${remaining.toLocaleString()} left`}
        </div>
      </div>
    </div>
  )
}
