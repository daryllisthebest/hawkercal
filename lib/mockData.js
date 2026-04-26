export const DISHES = require('./mockData-dishes.json')
export const FEATURED_DISH_IDS = Object.keys(DISHES).slice(0, 32)
export const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: '🌅', time: '6–11am' },
  { id: 'lunch', label: 'Lunch', icon: '☀️', time: '11am–3pm' },
  { id: 'dinner', label: 'Dinner', icon: '🌙', time: '3–10pm' },
  { id: 'snack', label: 'Snack', icon: '🍵', time: 'Anytime' },
]

export function getMealForTime() {
  const h = new Date().getHours()
  if (h >= 6 && h < 11) return 'breakfast'
  if (h >= 11 && h < 15) return 'lunch'
  if (h >= 15 && h < 22) return 'dinner'
  return 'snack'
}

export function mockDetect() {
  const allDishIds = Object.keys(DISHES)
  const id = allDishIds[Math.floor(Math.random() * allDishIds.length)]
  return {
    dishId: id,
    confidence: Math.round((0.76 + Math.random() * 0.21) * 100),
  }
}
