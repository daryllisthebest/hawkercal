const MACROS = [
  { key: 'protein', label: 'Protein', color: '#3B82F6', bg: '#DBEAFE', unit: 'g' },
  { key: 'carbs', label: 'Carbs', color: '#F97316', bg: '#FFEDD5', unit: 'g' },
  { key: 'fat', label: 'Fat', color: '#EAB308', bg: '#FEF9C3', unit: 'g' },
  { key: 'fiber', label: 'Fiber', color: '#22C55E', bg: '#DCFCE7', unit: 'g' },
]

export default function MacroBar({ protein = 0, carbs = 0, fat = 0, fiber = 0, compact = false }) {
  const total = protein + carbs + fat + fiber || 1

  if (compact) {
    return (
      <div className="flex gap-1 h-2 rounded-full overflow-hidden">
        {MACROS.map(m => {
          const val = { protein, carbs, fat, fiber }[m.key]
          const w = (val / total) * 100
          return w > 0 ? (
            <div key={m.key} style={{ width: `${w}%`, backgroundColor: m.color }} className="h-full" />
          ) : null
        })}
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {MACROS.map(m => {
        const val = { protein, carbs, fat, fiber }[m.key]
        const w = Math.round((val / total) * 100)
        return (
          <div key={m.key} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-12 text-right shrink-0">{m.label}</span>
            <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: m.bg }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${w}%`,
                  backgroundColor: m.color,
                  transition: 'width 0.8s cubic-bezier(.4,0,.2,1)',
                }}
              />
            </div>
            <span className="text-xs font-semibold text-gray-700 w-9 tabular-nums shrink-0">
              {val}{m.unit}
            </span>
          </div>
        )
      })}
    </div>
  )
}
