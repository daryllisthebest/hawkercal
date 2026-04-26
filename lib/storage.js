const LOG_KEY = 'hawkercal_log'
const GOAL_KEY = 'hawkercal_goal'
const PROFILE_KEY = 'hawkercal_profile'

export function getTodayStr() {
  return new Date().toISOString().split('T')[0]
}

export function getDateStr(date) {
  return date.toISOString().split('T')[0]
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'short' })
}

function safeGet(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function safeSet(key, value) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export function getLog() {
  return safeGet(LOG_KEY, [])
}

export function getLogByDate(dateStr) {
  return getLog().filter(e => e.date === dateStr)
}

export function addEntry(entry) {
  const log = getLog()
  const newEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: Date.now(),
  }
  safeSet(LOG_KEY, [...log, newEntry])
  return newEntry
}

export function removeEntry(id) {
  safeSet(LOG_KEY, getLog().filter(e => e.id !== id))
}

export function getTodayCalories() {
  return getLogByDate(getTodayStr()).reduce((sum, e) => sum + (e.calories || 0), 0)
}

export function getTodayMacros() {
  const entries = getLogByDate(getTodayStr())
  return entries.reduce(
    (acc, e) => ({
      protein: acc.protein + (e.macros?.protein || 0),
      carbs: acc.carbs + (e.macros?.carbs || 0),
      fat: acc.fat + (e.macros?.fat || 0),
      fiber: acc.fiber + (e.macros?.fiber || 0),
    }),
    { protein: 0, carbs: 0, fat: 0, fiber: 0 }
  )
}

export function getWeeklyData() {
  const log = getLog()
  const today = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    const dateStr = getDateStr(d)
    const entries = log.filter(e => e.date === dateStr)
    const calories = entries.reduce((s, e) => s + (e.calories || 0), 0)
    const isToday = dateStr === getTodayStr()
    return {
      date: dateStr,
      label: isToday ? 'Today' : d.toLocaleDateString('en-SG', { weekday: 'short' }),
      shortLabel: d.toLocaleDateString('en-SG', { weekday: 'short' }).slice(0, 2),
      calories,
      entries,
      isToday,
    }
  })
}

export function getWeeklyAverage() {
  const data = getWeeklyData()
  const withData = data.filter(d => d.calories > 0)
  if (!withData.length) return 0
  return Math.round(withData.reduce((s, d) => s + d.calories, 0) / withData.length)
}

export function getStreak() {
  const log = getLog()
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = getDateStr(d)
    const hasEntries = log.some(e => e.date === dateStr)
    if (hasEntries) streak++
    else if (i > 0) break
  }
  return streak
}

export function getTopDishes() {
  const log = getLog()
  const counts = {}
  log.forEach(e => {
    const key = e.dishId || e.name
    counts[key] = (counts[key] || { count: 0, name: e.name, emoji: e.emoji, dishId: e.dishId })
    counts[key].count++
  })
  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

export function getCalorieGoal() {
  if (typeof window === 'undefined') return 2000
  return parseInt(localStorage.getItem(GOAL_KEY) || '2000', 10)
}

export function setCalorieGoal(goal) {
  if (typeof window === 'undefined') return
  localStorage.setItem(GOAL_KEY, String(goal))
}

export function getProfile() {
  return safeGet(PROFILE_KEY, { name: '', goal: 2000, isPro: false })
}

export function setProfile(data) {
  safeSet(PROFILE_KEY, { ...getProfile(), ...data })
}

export function seedDemoData() {
  if (getLog().length > 0) return
  const today = getTodayStr()
  const yesterday = getDateStr(new Date(Date.now() - 86400000))
  const twoDaysAgo = getDateStr(new Date(Date.now() - 172800000))

  const entries = [
    { date: today, dishId: 'chicken-rice', name: 'Chicken Rice', emoji: '🍚', calories: 480, macros: { protein: 28, carbs: 58, fat: 14, fiber: 1 }, meal: 'lunch', modifications: ['Regular portion', 'Steamed chicken'] },
    { date: today, dishId: 'bubble-tea', name: 'Bubble Tea', emoji: '🧋', calories: 280, macros: { protein: 2, carbs: 52, fat: 6, fiber: 0 }, meal: 'snack', modifications: ['Large', '50% sugar', 'Tapioca pearls'] },
    { date: yesterday, dishId: 'laksa', name: 'Laksa', emoji: '🍜', calories: 610, macros: { protein: 24, carbs: 68, fat: 28, fiber: 3 }, meal: 'lunch', modifications: ['Regular bowl', 'Drank half broth'] },
    { date: yesterday, dishId: 'roti-prata', name: 'Roti Prata', emoji: '🫓', calories: 420, macros: { protein: 12, carbs: 52, fat: 20, fiber: 2 }, meal: 'breakfast', modifications: ['2 pratas', 'Egg prata', 'Light curry dip'] },
    { date: twoDaysAgo, dishId: 'char-kway-teow', name: 'Char Kway Teow', emoji: '🥘', calories: 680, macros: { protein: 22, carbs: 78, fat: 32, fiber: 2 }, meal: 'dinner', modifications: ['Regular portion', 'Normal oil'] },
    { date: twoDaysAgo, dishId: 'cai-png', name: 'Cai Png', emoji: '🍱', calories: 520, macros: { protein: 22, carbs: 65, fat: 18, fiber: 4 }, meal: 'lunch', modifications: ['3 dishes', 'Braised items', 'One scoop rice'] },
  ]

  entries.forEach(e => {
    const log = getLog()
    safeSet(LOG_KEY, [...log, { ...e, id: `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`, timestamp: Date.now() }])
  })
}
