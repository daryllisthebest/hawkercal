type FormResult = 'W' | 'D' | 'L' | '?'

const colours: Record<FormResult, string> = {
  W: 'bg-green-500 text-white',
  D: 'bg-yellow-500 text-black',
  L: 'bg-red-500 text-white',
  '?': 'bg-gray-700 text-gray-400',
}

export default function FormBadge({ result }: { result: string }) {
  const r = (result as FormResult) in colours ? (result as FormResult) : '?'
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${colours[r]}`}>
      {r}
    </span>
  )
}
