const LOG_KEY = 'hawkercal_log'
const GOAL_KEY = 'hawkercal_goal'
const PROFILE_KEY = 'hawkercal_profile'
const SCAN_KEY = 'hawkercal_scans'

export const FREE_SCAN_LIMIT = 3

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
    counts[key] = (counts[key] || { count: 0, name: e.name, emoji: e.emoji, dishId: e.dishId, totalCal: 0 })
    counts[key].count++
    counts[key].totalCal += (e.calories || 0)
  })
  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

const DRINK_IDS = new Set(['bubble-tea', 'teh-tarik', 'thai-milk-tea', 'teh-tarik-ais'])
const FRIED_IDS = new Set(['char-kway-teow', 'nasi-goreng', 'nasi-goreng-id', 'mee-goreng', 'roti-prata', 'hokkien-mee', 'spring-rolls', 'lumpia-ph'])
const COCONUT_IDS = new Set(['nasi-lemak', 'laksa', 'green-curry', 'rendang', 'kare-kare', 'soto-ayam'])

export function getWeeklyInsights() {
  const data = getWeeklyData()
  const allEntries = data.flatMap(d => d.entries)
  const totalWeekCal = allEntries.reduce((s, e) => s + (e.calories || 0), 0)
  const daysWithData = data.filter(d => d.calories > 0)

  const highestDay = data.reduce((best, d) => d.calories > best.calories ? d : best, data[0])

  const drinkEntries = allEntries.filter(e => DRINK_IDS.has(e.dishId))
  const drinkCal = drinkEntries.reduce((s, e) => s + (e.calories || 0), 0)
  const drinkPct = totalWeekCal > 0 ? Math.round((drinkCal / totalWeekCal) * 100) : 0

  const friedCal = allEntries.filter(e => FRIED_IDS.has(e.dishId)).reduce((s, e) => s + (e.calories || 0), 0)
  const coconutCal = allEntries.filter(e => COCONUT_IDS.has(e.dishId)).reduce((s, e) => s + (e.calories || 0), 0)
  const hiddenSource = friedCal >= coconutCal
    ? { label: 'Fried & oily dishes', kcal: Math.round(friedCal * 0.18), icon: '🍳' }
    : { label: 'Coconut-based dishes', kcal: Math.round(coconutCal * 0.22), icon: '🥥' }

  const bubbleTeaEntries = allEntries.filter(e => e.dishId === 'bubble-tea')
  const bubbleTeaTimes = bubbleTeaEntries.length

  const drinkBreakdown = []
  const drinkGroups = {}
  drinkEntries.forEach(e => {
    const key = e.name
    drinkGroups[key] = (drinkGroups[key] || { name: e.name, emoji: e.emoji, cal: 0 })
    drinkGroups[key].cal += e.calories || 0
  })
  Object.values(drinkGroups).forEach(g => drinkBreakdown.push(g))
  drinkBreakdown.sort((a, b) => b.cal - a.cal)

  const suggestions = []
  if (bubbleTeaTimes >= 2) {
    const saving = Math.round(bubbleTeaTimes * 75)
    suggestions.push({
      icon: '🧋',
      title: 'Rethink your bubble tea sugar',
      body: `Switching from 100% sugar to 25% could save ~${saving} kcal this week.`,
      impact: saving,
      tag: 'Easy win',
      tagColor: 'bg-green-100 text-green-700',
    })
  }

  const rothiPrataEntries = allEntries.filter(e => e.dishId === 'roti-prata')
  if (rothiPrataEntries.length >= 1) {
    suggestions.push({
      icon: '🫓',
      title: 'Skip the curry dip',
      body: `Requesting less curry dip on your Roti Prata saves ~60 kcal each time.`,
      impact: rothiPrataEntries.length * 60,
      tag: 'Low effort',
      tagColor: 'bg-blue-100 text-blue-700',
    })
  }

  const friedDishes = allEntries.filter(e => FRIED_IDS.has(e.dishId))
  if (friedDishes.length >= 2) {
    suggestions.push({
      icon: '🥗',
      title: 'Ask for less oil',
      body: `Your fried dishes this week had ~${hiddenSource.kcal} kcal in hidden oil. Most stalls will reduce oil on request.`,
      impact: Math.round(hiddenSource.kcal * 0.5),
      tag: 'Bigger impact',
      tagColor: 'bg-orange-100 text-orange-700',
    })
  }

  if (coconutCal > 1000) {
    suggestions.push({
      icon: '🥥',
      title: 'Go easy on the coconut',
      body: `Choosing "less coconut milk" in laksa and curries could trim ~150 kcal per bowl.`,
      impact: 150,
      tag: 'Moderate',
      tagColor: 'bg-amber-100 text-amber-700',
    })
  }

  return {
    totalWeekCal,
    avgCal: daysWithData.length ? Math.round(totalWeekCal / daysWithData.length) : 0,
    highestDay,
    drinkCal,
    drinkPct,
    drinkBreakdown,
    hiddenSource,
    bubbleTeaTimes,
    suggestions: suggestions.slice(0, 3),
    allEntries,
  }
}

export function getTodayScanCount() {
  const data = safeGet(SCAN_KEY, {})
  return data.date === getTodayStr() ? (data.count || 0) : 0
}

export function incrementScanCount() {
  const today = getTodayStr()
  const data = safeGet(SCAN_KEY, {})
  const count = data.date === today ? (data.count || 0) + 1 : 1
  safeSet(SCAN_KEY, { date: today, count })
  return count
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
  const d = (n) => getDateStr(new Date(Date.now() - n * 86400000))

  const entries = [
    { date: today, dishId: 'roti-prata',   name: 'Roti Prata',   emoji: '🫓', calories: 350,  macros: { protein: 8,  carbs: 44, fat: 17, fiber: 1 }, meal: 'breakfast', modifications: ['2 plain pratas'] },
    { date: today, dishId: 'chicken-rice', name: 'Chicken Rice', emoji: '🍚', calories: 480,  macros: { protein: 28, carbs: 58, fat: 14, fiber: 1 }, meal: 'lunch',     modifications: ['Regular'] },
    { date: today, dishId: 'cai-png',      name: 'Cai Png',      emoji: '🍱', calories: 520,  macros: { protein: 22, carbs: 65, fat: 18, fiber: 4 }, meal: 'lunch',     modifications: ['3 dishes'] },
    { date: today, dishId: 'bubble-tea',   name: 'Bubble Tea',   emoji: '🧋', calories: 280,  macros: { protein: 2,  carbs: 52, fat: 6,  fiber: 0 }, meal: 'snack',     modifications: ['50% sugar'] },
    { date: d(1), dishId: 'nasi-lemak',    name: 'Nasi Lemak',   emoji: '🍛', calories: 620,  macros: { protein: 20, carbs: 72, fat: 28, fiber: 4 }, meal: 'breakfast', modifications: ['Fried chicken'] },
    { date: d(1), dishId: 'bubble-tea',    name: 'Bubble Tea',   emoji: '🧋', calories: 330,  macros: { protein: 3,  carbs: 60, fat: 8,  fiber: 0 }, meal: 'snack',     modifications: ['Large'] },
    { date: d(1), dishId: 'hokkien-mee',   name: 'Hokkien Mee',  emoji: '🍝', calories: 540,  macros: { protein: 26, carbs: 70, fat: 20, fiber: 2 }, meal: 'dinner',    modifications: ['Regular'] },
    { date: d(2), dishId: 'chicken-rice',  name: 'Chicken Rice', emoji: '🍚', calories: 480,  macros: { protein: 28, carbs: 58, fat: 14, fiber: 1 }, meal: 'lunch',     modifications: [] },
    { date: d(2), dishId: 'teh-tarik',     name: 'Teh Tarik',    emoji: '☕', calories: 200,  macros: { protein: 3,  carbs: 28, fat: 6,  fiber: 0 }, meal: 'snack',     modifications: [] },
    { date: d(2), dishId: 'laksa',         name: 'Laksa',        emoji: '🍜', calories: 610,  macros: { protein: 24, carbs: 68, fat: 28, fiber: 3 }, meal: 'dinner',    modifications: [] },
    { date: d(3), dishId: 'char-kway-teow', name: 'Char Kway Teow', emoji: '🥘', calories: 680, macros: { protein: 22, carbs: 78, fat: 32, fiber: 2 }, meal: 'dinner', modifications: [] },
    { date: d(3), dishId: 'cai-png',       name: 'Cai Png',      emoji: '🍱', calories: 520,  macros: { protein: 22, carbs: 65, fat: 18, fiber: 4 }, meal: 'lunch',     modifications: [] },
  ]

  entries.forEach(e => {
    const log = getLog()
    safeSet(LOG_KEY, [...log, { ...e, id: `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`, timestamp: Date.now() }])
  })
}
