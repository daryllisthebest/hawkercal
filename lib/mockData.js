export const DISHES = {
  'chicken-rice': { id: 'chicken-rice', name: 'Chicken Rice', nameLocal: '鸡饭', origin: 'Singapore', flag: '🇸🇬', emoji: '🍚', color: '#F59E0B', bgColor: '#FEF3C7', description: 'Steamed or roasted chicken with fragrant rice cooked in chicken broth, served with chilli and ginger sauce.', baseCalories: 480, macros: { protein: 28, carbs: 58, fat: 14, fiber: 1 }, tags: ['Rice', 'Chicken', 'Classic'], questions: [{ id: 'portion', question: 'How big was your portion?', subtitle: 'Portion size is the biggest calorie variable', type: 'single', options: [{ id: 'small', label: 'Small', desc: "Half portion / child's meal", icon: '🤏', modifier: -100 }, { id: 'regular', label: 'Regular', desc: 'Standard hawker serving', icon: '👌', modifier: 0 }, { id: 'large', label: 'Large', desc: 'Extra rice added', icon: '👐', modifier: 130 }, { id: 'xl', label: 'Double Rice', desc: 'Two scoops of rice', icon: '🙌', modifier: 220 }] }, { id: 'style', question: 'Which style of chicken?', subtitle: 'Different cooking methods change the calorie count', type: 'single', options: [{ id: 'steamed', label: 'Steamed (Bai Qie)', desc: 'Lighter, poached in broth', icon: '💧', modifier: -30 }, { id: 'roasted', label: 'Roasted (Shao Ji)', desc: 'Crispy skin, more flavour', icon: '🔥', modifier: 20 }, { id: 'soy', label: 'Soy Sauce', desc: 'Braised in dark soy', icon: '🤎', modifier: 15 }] }, { id: 'extras', question: 'Any add-ons on your plate?', subtitle: 'Select all that apply', type: 'multi', options: [{ id: 'egg', label: 'Soft-boiled egg', icon: '🥚', modifier: 70 }, { id: 'char_siu', label: 'Char Siu slice', icon: '🥩', modifier: 110 }, { id: 'extra_chicken', label: 'Extra chicken', icon: '🍗', modifier: 150 }, { id: 'none', label: 'No add-ons', icon: '✓', modifier: 0, exclusive: true }] }] },
  'nasi-lemak': { id: 'nasi-lemak', name: 'Nasi Lemak', nameLocal: 'Nasi Lemak (MY)', origin: 'Malaysia', flag: '🇲🇾', emoji: '🍛', color: '#16A34A', bgColor: '#DCFCE7', description: 'Fragrant coconut rice served with crispy anchovies, roasted peanuts, boiled egg, cucumber and spicy sambal.', baseCalories: 620, macros: { protein: 20, carbs: 72, fat: 28, fiber: 4 }, tags: ['Rice', 'Coconut', 'Spicy'], questions: [] },
  'char-kway-teow': { id: 'char-kway-teow', name: 'Char Kway Teow', nameLocal: '炒粿条', origin: 'Singapore', flag: '🇸🇬', emoji: '🥘', color: '#92400E', bgColor: '#FEF3C7', description: 'Stir-fried flat rice noodles in a rich dark sauce with prawns, cockles, Chinese sausage, eggs and bean sprouts.', baseCalories: 680, macros: { protein: 22, carbs: 78, fat: 32, fiber: 2 }, tags: ['Noodles', 'Wok-fried', 'Seafood'], questions: [] },
  'laksa': { id: 'laksa', name: 'Laksa', nameLocal: '叻沙', origin: 'Singapore', flag: '🇸🇬', emoji: '🍜', color: '#EA580C', bgColor: '#FFEDD5', description: 'Rich and spicy coconut milk noodle soup loaded with prawns, tofu puffs, cockles, and fresh laksa leaves.', baseCalories: 610, macros: { protein: 24, carbs: 68, fat: 28, fiber: 3 }, tags: ['Noodles', 'Coconut', 'Spicy'], questions: [] },
  'cai-png': { id: 'cai-png', name: 'Cai Png (Economy Rice)', nameLocal: '菜饭', origin: 'Singapore', flag: '🇸🇬', emoji: '🍱', color: '#0891B2', bgColor: '#CFFAFE', description: 'Mix-and-match rice plate with a selection of dishes from a steam tray.', baseCalories: 520, macros: { protein: 22, carbs: 65, fat: 18, fiber: 4 }, tags: ['Rice', 'Mixed', 'Value'], questions: [] },
  'pad-thai': { id: 'pad-thai', name: 'Pad Thai', nameLocal: 'ผัดไทย', origin: 'Thailand', flag: '🇹🇭', emoji: '🍜', color: '#CA8A04', bgColor: '#FEF9C3', description: 'Stir-fried rice noodles with eggs, tofu or shrimp, tamarind sauce, fish sauce, peanuts and bean sprouts.', baseCalories: 560, macros: { protein: 22, carbs: 68, fat: 24, fiber: 3 }, tags: ['Noodles', 'Thai', 'Peanut'], questions: [] },
  'pho': { id: 'pho', name: 'Phở Bò', nameLocal: 'Phở bò', origin: 'Vietnam', flag: '🇻🇳', emoji: '🍲', color: '#065F46', bgColor: '#D1FAE5', description: 'Vietnamese slow-simmered beef bone broth with flat rice noodles, thin-sliced beef, fresh herbs and lime.', baseCalories: 480, macros: { protein: 30, carbs: 58, fat: 12, fiber: 2 }, tags: ['Soup', 'Beef', 'Vietnamese'], questions: [] },
  'nasi-goreng': { id: 'nasi-goreng', name: 'Nasi Goreng', nameLocal: 'Nasi Goreng', origin: 'Indonesia', flag: '🇮🇩', emoji: '🍛', color: '#B45309', bgColor: '#FEF3C7', description: 'Indonesian fried rice seasoned with kecap manis, shrimp paste and chilli, topped with a fried egg and crackers.', baseCalories: 660, macros: { protein: 22, carbs: 82, fat: 28, fiber: 2 }, tags: ['Rice', 'Fried', 'Indonesian'], questions: [] },
  'bubble-tea': { id: 'bubble-tea', name: 'Bubble Tea', nameLocal: '珍珠奶茶', origin: 'Singapore', flag: '🇸🇬', emoji: '🧋', color: '#7C3AED', bgColor: '#EDE9FE', description: 'Milk tea or fruit tea with chewy tapioca pearls.', baseCalories: 330, macros: { protein: 3, carbs: 60, fat: 8, fiber: 0 }, tags: ['Drink', 'Sweet', 'Tea'], questions: [] },
  'roti-prata': { id: 'roti-prata', name: 'Roti Prata', nameLocal: 'Roti Prata (SG)', origin: 'Singapore', flag: '🇸🇬', emoji: '🫓', color: '#D97706', bgColor: '#FEF3C7', description: 'Crispy, flaky pan-fried flatbread cooked with ghee, served with fish or mutton curry for dipping.', baseCalories: 350, macros: { protein: 8, carbs: 44, fat: 17, fiber: 1 }, tags: ['Bread', 'Indian', 'Fried'], questions: [] },
  'hokkien-mee': { id: 'hokkien-mee', name: 'Hokkien Mee', nameLocal: '福建炒面', origin: 'Singapore', flag: '🇸🇬', emoji: '🍝', color: '#C2410C', bgColor: '#FFEDD5', description: 'Braised yellow noodles and thin rice noodles with prawns, squid, pork belly slices and egg.', baseCalories: 580, macros: { protein: 26, carbs: 70, fat: 20, fiber: 2 }, tags: ['Noodles', 'Seafood', 'Braised'], questions: [] },
  'satay': { id: 'satay', name: 'Satay', nameLocal: 'สะเต๊ะ', origin: 'Singapore', flag: '🇸🇬', emoji: '🍢', color: '#78350F', bgColor: '#FEF3C7', description: 'Grilled marinated meat skewers served with peanut sauce, ketupat and fresh cucumber slices.', baseCalories: 400, macros: { protein: 32, carbs: 24, fat: 18, fiber: 2 }, tags: ['Grilled', 'Skewer', 'Peanut'], questions: [] },
}

export const FEATURED_DISH_IDS = ['chicken-rice', 'nasi-lemak', 'char-kway-teow', 'laksa', 'cai-png', 'pad-thai', 'pho', 'nasi-goreng', 'bubble-tea', 'roti-prata', 'hokkien-mee', 'satay']

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
  const id = FEATURED_DISH_IDS[Math.floor(Math.random() * FEATURED_DISH_IDS.length)]
  return {
    dishId: id,
    confidence: Math.round((0.76 + Math.random() * 0.21) * 100),
  }
}
