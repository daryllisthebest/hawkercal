import Anthropic from '@anthropic-ai/sdk'
import { DISHES } from '@/lib/mockData'

const DISH_TAXONOMY = {
  'Kopitiam Western': {
    visual_signature: 'Two variants: (A) crinkle-cut fries + fried/battered cutlet + brown gravy poured over + mixed corn/carrot/pea veg OR (B) thick wedge fries + grilled protein (char marks, no batter) + garden salad + sweet chili dip + NO gravy',
    dishes: [
      { name: 'Chicken Chop', calories: 780, cues: 'fried/battered chicken cutlet (flattened), crinkle-cut fries, brown pepper or mushroom gravy poured OVER the chicken, mixed corn/carrot/pea veg on side, white oval plate' },
      { name: 'Grilled Chicken Set', calories: 680, cues: 'grilled chicken thigh (char marks, no batter), thick wedge fries (NOT crinkle-cut), garden salad (lettuce/broccoli/cherry tomato/cucumber), sweet chili dip in separate cup, NO brown gravy on plate', differentiator: 'grilled not fried, wedge not crinkle, salad not mixed veg, NO gravy — gravy absence is the strongest Chicken Chop disqualifier' },
      { name: 'Pork Chop', calories: 820, cues: 'pork cutlet, crinkle fries, brown sauce' },
      { name: 'Fish & Chips', calories: 710, cues: 'battered fish fillet, fries, tartar sauce' },
      { name: 'Chicken Cutlet Rice', calories: 740, cues: 'chicken cutlet on rice instead of fries' },
    ],
  },
  'Noodle Dishes': {
    visual_signature: 'noodles must be visible — yellow, flat rice, thin vermicelli, or thick round',
    dishes: [
      { name: 'Char Kway Teow', calories: 740, cues: 'flat rice noodles, wok char, cockles, bean sprouts, egg' },
      { name: 'Mee Goreng', calories: 620, cues: 'yellow noodles (required), red-orange sauce, egg, tofu' },
      { name: 'Laksa', calories: 590, cues: 'thick coconut milk broth (orange), thick rice noodles, tofu puffs' },
      { name: 'Hokkien Mee', calories: 680, cues: 'thick yellow + thin rice noodles mixed, prawn broth' },
      { name: 'Bak Chor Mee', calories: 510, cues: 'thin noodles, minced pork, mushrooms, vinegar' },
    ],
  },
  'Rice Dishes': {
    visual_signature: 'white or flavoured rice as the base, protein and sides on top or alongside',
    dishes: [
      { name: 'Hainanese Chicken Rice', calories: 520, cues: 'poached chicken slices, white/yellow rice, ginger sauce, dark soy' },
      { name: 'Nasi Lemak', calories: 620, cues: 'coconut rice, fried anchovies, peanuts, sambal, half egg' },
      { name: 'Nasi Goreng', calories: 680, cues: 'fried rice, dark soy colour, egg on top, usually kerupuk' },
      { name: 'Biryani', calories: 750, cues: 'spiced yellow/orange basmati, curry protein, raita' },
    ],
  },
  'Soups & Broths': {
    visual_signature: 'significant liquid broth visible, served in bowl',
    dishes: [
      { name: 'Bak Kut Teh', calories: 480, cues: 'pork ribs, clear herbal broth, dark soy dip on side' },
      { name: 'Fish Head Curry', calories: 560, cues: 'large fish head, red curry, lady fingers, tomato' },
    ],
  },
}

const TAXONOMY_REF = Object.entries(DISH_TAXONOMY)
  .map(([cat, data]) => {
    const dishes = data.dishes.map(d => `    - ${d.name}: ${d.cues}${d.differentiator ? ` | KEY DIFFERENTIATOR: ${d.differentiator}` : ''}`).join('\n')
    return `  ${cat} [${data.visual_signature}]\n${dishes}`
  })
  .join('\n\n')

const DISH_LIST = Object.values(DISHES)
  .map(d => {
    const name = `${d.name}${d.nameLocal ? ` (${d.nameLocal})` : ''}`
    const vd = d.visual_detection
    if (vd) {
      // Use structured visual_detection when available — more useful to the vision model
      const ids = vd.key_identifiers?.slice(0, 4).join('; ') || ''
      const diff = vd.differentiators ? ` | DIFF: ${vd.differentiators.slice(0, 120)}` : ''
      return `  ${d.id}: ${name} | ${vd.protein} + ${vd.starch} + ${vd.sauce} | KEY: ${ids}${diff}`
    }
    const desc = d.description ? d.description.slice(0, 100) : ''
    const tags = d.tags?.slice(0, 4).join(', ') || ''
    return `  ${d.id}: ${name} | ${desc} | [${tags}]`
  })
  .join('\n')

// ── Stage-1 category → filtered dish list for Stage-2 ───────────────────────
// Original 67 dishes have inconsistent tags; batch dishes use category as tags[0].
// Explicit overrides for originals, tag-based fallback for batch dishes.
const DETECTION_CAT_OVERRIDES = {
  // Western
  'chicken-chop': 'Western', 'fish-and-chips': 'Western', 'pork-chop': 'Western', 'fries': 'Western',
  // Noodles
  'char-kway-teow': 'Noodles', 'laksa': 'Noodles', 'pad-thai': 'Noodles', 'hokkien-mee': 'Noodles',
  'mee-goreng': 'Noodles', 'bak-chor-mee': 'Noodles', 'wanton-mee': 'Noodles', 'mee-pok': 'Noodles',
  'fishball-mee': 'Noodles', 'bee-hoon': 'Noodles', 'mee-soto': 'Noodles', 'bun-cha': 'Noodles',
  // Rice
  'chicken-rice': 'Rice', 'nasi-lemak': 'Rice', 'nasi-goreng': 'Rice', 'nasi-goreng-id': 'Rice',
  'cai-png': 'Rice', 'duck-rice': 'Rice', 'char-siew-rice': 'Rice', 'com-tam': 'Rice',
  'pad-krapow': 'Rice', 'nasi-padang': 'Rice', 'nasi-goreng-kampung': 'Rice', 'claypot-rice': 'Rice',
  // Soup
  'pho': 'Soup', 'pho-ga': 'Soup', 'soto-ayam': 'Soup', 'tom-yum': 'Soup',
  'bak-kut-teh': 'Soup', 'sinigang': 'Soup', 'kare-kare': 'Soup', 'mala-hotpot': 'Soup', 'chilli-crab': 'Soup',
  // Malay
  'rendang': 'Malay', 'gado-gado': 'Malay', 'satay': 'Malay', 'green-curry': 'Malay', 'lontong': 'Malay',
  'mala-xiang-guo': 'Malay', 'adobo': 'Malay', 'sisig': 'Malay', 'lechon': 'Malay',
  // Indian/Mamak
  'roti-prata': 'Indian/Mamak',
  // Dim Sum/Snack
  'you-tiao': 'Dim Sum/Snack', 'kaya-toast': 'Dim Sum/Snack', 'soft-boiled-eggs': 'Dim Sum/Snack',
  'chwee-kueh': 'Dim Sum/Snack', 'carrot-cake': 'Dim Sum/Snack', 'chicken-wing': 'Dim Sum/Snack',
  'sunny-side-up': 'Dim Sum/Snack', 'spring-rolls': 'Dim Sum/Snack', 'banh-mi': 'Dim Sum/Snack',
  'lumpia-ph': 'Dim Sum/Snack', 'sio-bak': 'Dim Sum/Snack',
  // Drink/Dessert
  'bubble-tea': 'Drink/Dessert', 'kopi': 'Drink/Dessert', 'teh': 'Drink/Dessert',
  'milo-dinosaur': 'Drink/Dessert', 'bandung': 'Drink/Dessert', 'sugarcane-juice': 'Drink/Dessert',
  'teh-tarik': 'Drink/Dessert', 'thai-milk-tea': 'Drink/Dessert', 'ice-kachang': 'Drink/Dessert',
  'chendol': 'Drink/Dessert', 'ice-cream-bread': 'Drink/Dessert', 'ondeh-ondeh': 'Drink/Dessert',
}
const TAG0_TO_DETECTION_CAT = {
  Rice: 'Rice', Noodles: 'Noodles', Soup: 'Soup', Congee: 'Soup',
  Western: 'Western', Indian: 'Indian/Mamak', Malay: 'Malay',
  'Dim Sum': 'Dim Sum/Snack', Snack: 'Dim Sum/Snack',
  Drink: 'Drink/Dessert', Dessert: 'Drink/Dessert',
}

const DISH_LIST_BY_CAT = {}
Object.values(DISHES).forEach(d => {
  const cat = DETECTION_CAT_OVERRIDES[d.id] || TAG0_TO_DETECTION_CAT[d.tags?.[0]] || 'Rice'
  if (!DISH_LIST_BY_CAT[cat]) DISH_LIST_BY_CAT[cat] = []
  const name = `${d.name}${d.nameLocal ? ` (${d.nameLocal})` : ''}`
  const vd = d.visual_detection
  let entry
  if (vd) {
    const ids = vd.key_identifiers?.slice(0, 4).join('; ') || ''
    const diff = vd.differentiators ? ` | DIFF: ${vd.differentiators.slice(0, 120)}` : ''
    entry = `  ${d.id}: ${name} | ${vd.protein} + ${vd.starch} + ${vd.sauce} | KEY: ${ids}${diff}`
  } else {
    const desc = d.description ? d.description.slice(0, 100) : ''
    entry = `  ${d.id}: ${name} | ${desc}`
  }
  DISH_LIST_BY_CAT[cat].push(entry)
})
Object.keys(DISH_LIST_BY_CAT).forEach(cat => {
  DISH_LIST_BY_CAT[cat] = DISH_LIST_BY_CAT[cat].join('\n')
})
const DISH_NAME_TO_ID = {
  'chicken chop': 'chicken-chop',
  'grilled chicken set': 'grilled-chicken-set',
  'grilled chicken': 'grilled-chicken-set',
  'grilled fish set': 'fish-and-chips',
  'hainanese beef steak': 'hainanese-beef-steak',
  'beef steak kopitiam': 'hainanese-beef-steak',
  'lamb chop kopitiam': 'lamb-chop-kopitiam',
  'lamb chop': 'lamb-chop-kopitiam',
  'chicken cutlet rice': 'chicken-cutlet-rice',
  'chicken cutlet': 'chicken-cutlet-rice',
  'mushroom chicken chop': 'mushroom-chicken-chop',
  'mushroom chicken': 'mushroom-chicken-chop',
  'pork chop': 'pork-chop',
  'fish & chips': 'fish-and-chips',
  'fish and chips': 'fish-and-chips',
  'fish n chips': 'fish-and-chips',
  'french fries': 'fries',
  // Indian & Mamak
  'thosai': 'thosai-plain',
  'dosai': 'thosai-plain',
  'dosa': 'thosai-plain',
  'thosai plain': 'thosai-plain',
  'thosai egg': 'thosai-egg',
  'egg thosai': 'thosai-egg',
  'murtabak': 'murtabak-chicken',
  'murtabak chicken': 'murtabak-chicken',
  'murtabak mutton': 'murtabak-mutton',
  'briyani chicken': 'briyani-chicken',
  'biryani chicken': 'briyani-chicken',
  'nasi briyani': 'briyani-chicken',
  'biryani': 'briyani-chicken',
  'briyani': 'briyani-chicken',
  'briyani mutton': 'briyani-mutton',
  'biryani mutton': 'briyani-mutton',
  'fish head curry': 'fish-head-curry',
  'curry chicken': 'curry-chicken',
  'chicken curry': 'curry-chicken',
  'dal curry': 'dal-curry',
  'dhal curry': 'dal-curry',
  'tandoori chicken': 'tandoori-chicken',
  'chapati': 'chapati',
  'naan': 'naan',
  'lassi': 'lassi',
  // Dim Sum
  'har gow': 'har-gow',
  'har gao': 'har-gow',
  'prawn dumpling': 'har-gow',
  'siu mai': 'siu-mai',
  'siumai': 'siu-mai',
  'shao mai': 'siu-mai',
  'char siew bao': 'char-siew-bao-steamed',
  'char siu bao': 'char-siew-bao-steamed',
  'char siew bao steamed': 'char-siew-bao-steamed',
  'char siew bao baked': 'char-siew-bao-baked',
  'baked char siew bao': 'char-siew-bao-baked',
  'cheung fun': 'cheung-fun',
  'rice noodle roll': 'cheung-fun',
  'lo mai gai': 'lo-mai-gai',
  'glutinous rice chicken': 'lo-mai-gai',
  'egg tart': 'egg-tart',
  'dan tat': 'egg-tart',
  'lo bak go': 'lo-bak-go',
  'radish cake': 'lo-bak-go',
  'turnip cake': 'lo-bak-go',
  'taro dumpling': 'taro-dumpling',
  'wu kok': 'taro-dumpling',
  'xiao long bao': 'xiao-long-bao',
  'xlb': 'xiao-long-bao',
  'soup dumpling': 'xiao-long-bao',
  // Congee
  'congee': 'plain-congee',
  'plain congee': 'plain-congee',
  'porridge': 'plain-congee',
  'sampan porridge': 'sampan-porridge',
  'frog leg porridge': 'frog-leg-porridge',
  'frog porridge': 'frog-leg-porridge',
  'century egg porridge': 'century-egg-porridge',
  'pidan porridge': 'century-egg-porridge',
  'chicken congee': 'chicken-congee',
  'fish congee': 'fish-congee',
  // Malay
  'nasi padang': 'nasi-padang',
  'mee rebus': 'mee-rebus',
  'mee siam': 'mee-siam',
  'rojak': 'rojak',
  'popiah': 'popiah-fresh',
  'popiah fresh': 'popiah-fresh',
  'otah': 'otah-otah',
  'otah otah': 'otah-otah',
  'otak otak': 'otah-otah',
  'nasi goreng kampung': 'nasi-goreng-kampung',
  'kuih tutu': 'kuih-tutu',
  'putu piring': 'putu-piring',
  'epok epok': 'epok-epok',
  'curry puff': 'epok-epok',
  'mee bandung': 'mee-bandung',
  'soto betawi': 'soto-betawi',
  // Chinese Hawker
  'prawn noodle': 'prawn-noodle-soup',
  'prawn noodle soup': 'prawn-noodle-soup',
  'hae mee': 'prawn-noodle-soup',
  'yong tau foo': 'yong-tau-foo',
  'yong tofu': 'yong-tau-foo',
  'braised duck noodles': 'braised-duck-noodles',
  'duck noodles': 'braised-duck-noodles',
  'lor mee': 'lor-mee',
  'kway chap': 'kway-chap',
  'claypot rice': 'claypot-rice',
  'oyster omelette': 'oyster-omelette',
  'orh luak': 'oyster-omelette',
  'muah chee': 'muah-chee',
  'tang yuan': 'tang-yuan',
  'glutinous rice balls': 'tang-yuan',
  // Malaysian
  'asam laksa': 'asam-laksa',
  'curry laksa': 'curry-laksa',
  'penang char kway teow': 'penang-char-kway-teow',
  'wonton noodle soup': 'wonton-noodle-soup',
  'pan mee': 'pan-mee',
  'hakka mee': 'hakka-mee',
  'nasi kandar': 'nasi-kandar',
  'roti canai': 'roti-canai',
  'banana leaf rice': 'banana-leaf-rice',
  'cendol': 'cendol-malaysian',
  'cendol malaysian': 'cendol-malaysian',
  'abc': 'abc-air-batu-campur',
  'air batu campur': 'abc-air-batu-campur',
  // Vietnamese
  'bun bo hue': 'bun-bo-hue',
  'mi quang': 'mi-quang',
  'banh xeo': 'banh-xeo',
  'sizzling crepe': 'banh-xeo',
  'goi cuon': 'goi-cuon',
  'fresh spring rolls': 'goi-cuon',
  'hu tieu': 'hu-tieu',
  'com ga hoi an': 'com-ga-hoi-an',
  'hoi an chicken rice': 'com-ga-hoi-an',
  // Beverages
  'kopi o': 'kopi-o',
  'kopi c': 'kopi-c',
  'teh o': 'teh-o',
  'teh c': 'teh-c',
  'barley water': 'barley-water',
  'chrysanthemum tea': 'chrysanthemum-tea',
  'soya bean milk': 'soya-bean-milk',
  'soy milk': 'soya-bean-milk',
  'coconut water': 'coconut-water',
  'calamansi juice': 'calamansi-juice',
  'watermelon juice': 'watermelon-juice',
  // Desserts
  'tau huay': 'tau-huay',
  'tofu pudding': 'tau-huay',
  'soya beancurd': 'tau-huay',
  'grass jelly': 'grass-jelly-cincau',
  'cincau': 'grass-jelly-cincau',
  'grass jelly cincau': 'grass-jelly-cincau',
  'red bean soup': 'red-bean-soup',
  'peanut soup': 'peanut-soup',
  'bubur cha cha': 'bubur-cha-cha',
  'durian pengat': 'durian-pengat',
  'durian dessert': 'durian-pengat',
  'kueh lapis': 'kueh-lapis',
  'angku kueh': 'angku-kueh',
  'red tortoise cake': 'angku-kueh',
  'char kway teow': 'char-kway-teow',
  'char kuay teow': 'char-kway-teow',
  'mee goreng': 'mee-goreng',
  'laksa': 'laksa',
  'hokkien mee': 'hokkien-mee',
  'hokkien prawn mee': 'hokkien-mee',
  'bak chor mee': 'bak-chor-mee',
  'wonton noodle': 'wanton-mee',
  'wanton mee': 'wanton-mee',
  'mee pok': 'mee-pok',
  'fishball noodle': 'fishball-mee',
  'fishball mee': 'fishball-mee',
  'fishball soup noodle': 'fishball-mee',
  'mee soto': 'mee-soto',
  'mee soto ayam': 'mee-soto',
  'bee hoon': 'bee-hoon',
  'rice vermicelli': 'bee-hoon',
  'pad thai': 'pad-thai',
  'hainanese chicken rice': 'chicken-rice',
  'chicken rice': 'chicken-rice',
  'nasi lemak': 'nasi-lemak',
  'nasi goreng': 'nasi-goreng',
  'duck rice': 'duck-rice',
  'roast duck rice': 'duck-rice',
  'char siew rice': 'char-siew-rice',
  'char siu rice': 'char-siew-rice',
  'soy sauce chicken rice': 'soy-sauce-chicken-rice',
  'cai png': 'cai-png',
  'economy rice': 'cai-png',
  'mixed rice': 'cai-png',
  'com tam': 'com-tam',
  'bak kut teh': 'bak-kut-teh',
  'tom yum': 'tom-yum',
  'soto ayam': 'soto-ayam',
  'pho': 'pho',
  'pho ga': 'pho-ga',
  'mala hot pot': 'mala-hotpot',
  'mala hotpot': 'mala-hotpot',
  'mala xiang guo': 'mala-xiang-guo',
  'rendang': 'rendang',
  'satay': 'satay',
  'roti prata': 'roti-prata',
  'lontong': 'lontong',
  'gado gado': 'gado-gado',
  'green curry': 'green-curry',
  'pad krapow': 'pad-krapow',
  'kaya toast': 'kaya-toast',
  'soft boiled eggs': 'soft-boiled-eggs',
  'half boiled eggs': 'soft-boiled-eggs',
  'you tiao': 'you-tiao',
  'chinese doughnut': 'you-tiao',
  'chwee kueh': 'chwee-kueh',
  'carrot cake': 'carrot-cake',
  'chai tow kway': 'carrot-cake',
  'chicken wing': 'chicken-wing',
  'sunny side up': 'sunny-side-up',
  'sunny side up egg': 'sunny-side-up',
  'ondeh ondeh': 'ondeh-ondeh',
  'onde onde': 'ondeh-ondeh',
  'banh mi': 'banh-mi',
  'bun cha': 'bun-cha',
  'spring rolls': 'spring-rolls',
  'adobo': 'adobo',
  'sinigang': 'sinigang',
  'sisig': 'sisig',
  'chilli crab': 'chilli-crab',
  'chili crab': 'chilli-crab',
  'ice kachang': 'ice-kachang',
  'chendol': 'chendol',
  'ice cream bread': 'ice-cream-bread',
  'kopi': 'kopi',
  'teh': 'teh',
  'milo': 'milo-dinosaur',
  'milo dinosaur': 'milo-dinosaur',
  'bandung': 'bandung',
  'teh tarik': 'teh-tarik',
  'thai milk tea': 'thai-milk-tea',
  'thai iced tea': 'thai-milk-tea',
  'bubble tea': 'bubble-tea',
  'boba': 'bubble-tea',
  'sugarcane juice': 'sugarcane-juice',
}

function resolveDishId(dishName) {
  if (!dishName) return null
  const lower = dishName.toLowerCase().trim()
  if (DISH_NAME_TO_ID[lower]) return DISH_NAME_TO_ID[lower]
  const byId = Object.keys(DISHES).find(id => id.replace(/-/g, ' ') === lower)
  if (byId) return byId
  const byName = Object.values(DISHES).find(d => d.name.toLowerCase() === lower)
  if (byName) return byName.id
  const partial = Object.values(DISHES).find(d =>
    lower.includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(lower)
  )
  if (partial) return partial.id
  return null
}

function applyConfidenceOverrides(result, rawText = '') {
  const noodleDishes = [
    'mee goreng', 'laksa', 'hokkien mee', 'char kway teow',
    'pad thai', 'bak chor mee', 'wonton noodle', 'mee rebus',
    'mee siam', 'prawn noodle',
  ]

  const inventoryStr = JSON.stringify(result.visual_inventory || {}).toLowerCase()
  const rawLower = rawText.toLowerCase()
  const everywhere = inventoryStr + ' ' + rawLower
  const starch = result.visual_inventory?.starch?.toLowerCase() || ''
  const dish = result.dish?.toLowerCase() || ''

  const isNoodleDish = noodleDishes.some(n => dish.includes(n))
  const hasNoNoodles = !starch.includes('noodle') && !starch.includes('vermicelli')
  const hasFries = everywhere.includes('fries') || everywhere.includes('crinkle') ||
    everywhere.includes('chips') || everywhere.includes('potato')
  const hasWesternVeg = everywhere.includes('corn') || everywhere.includes(' peas') ||
    everywhere.includes('pea,') || everywhere.includes('mixed veg')

  if (isNoodleDish && hasNoNoodles) {
    result.confidence = Math.min(result.confidence, 35)
    result.needsConfirmation = true
    result.override_reason = 'Noodle dish detected but no noodles found in visual inventory'
  }

  // Rule 4 (must run BEFORE Rule 2): grilled protein + wedge fries → Grilled Chicken Set
  // "wedge fries" contains "fries" so Rule 2 would incorrectly fire without this guard
  const hasWedgeFries = starch.includes('wedge') || everywhere.includes('wedge fries') || everywhere.includes('potato wedge')
  const hasGrilledProtein = (result.visual_inventory?.protein?.toLowerCase() || '').includes('grilled')

  if (hasWedgeFries && hasGrilledProtein) {
    result.dish = (everywhere.includes('fish') || everywhere.includes('fillet')) ? 'Grilled Fish Set' : 'Grilled Chicken Set'
    result.category = 'Kopitiam Western'
    result.confidence = 82
    result.needsConfirmation = false
    result.override_reason = 'Grilled protein + wedge fries — Western set meal, not Chicken Chop (no gravy)'
  } else if (hasFries || hasWesternVeg) {
    if (everywhere.includes('fish') || everywhere.includes('fillet') || everywhere.includes('battered')) {
      result.dish = 'Fish & Chips'
    } else if (everywhere.includes('pork')) {
      result.dish = 'Pork Chop'
    } else {
      result.dish = 'Chicken Chop'
    }
    result.category = 'Kopitiam Western'
    result.confidence = 85
    result.needsConfirmation = false
    result.override_reason = 'Crinkle fries/western veg detected — forced to Kopitiam Western'
  }

  if (result.confidence < 70) result.needsConfirmation = true

  return result
}

export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    const ids = Object.keys(DISHES)
    return Response.json({ dishId: ids[Math.floor(Math.random() * ids.length)], confidence: 72 })
  }

  let imageBase64, mediaType
  try {
    const formData = await request.formData()
    const file = formData.get('image')
    if (!file) return Response.json({ error: 'No image provided' }, { status: 400 })
    const bytes = await file.arrayBuffer()
    imageBase64 = Buffer.from(bytes).toString('base64')
    mediaType = file.type || 'image/jpeg'
  } catch {
    return Response.json({ error: 'Failed to read image' }, { status: 400 })
  }

  const client = new Anthropic()
  const imageBlock = { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } }

  try {
    // ── STAGE 1 (Haiku): visual inventory + category classification ──────────
    const preCheckResponse = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: [
          imageBlock,
          {
            type: 'text',
            text: `Examine this food image. Build a quick visual inventory then classify.

STARCH: white rice | fried rice | noodles | fries | roti/flatbread | none
PROTEIN: chicken | pork | fish | egg | tofu | prawns | other
LIQUID: broth | curry | gravy | none

Select ONE category:
Rice → rice base, no noodles
Noodles → noodles visible (yellow, flat, vermicelli)
Soup → broth-heavy dish or congee/porridge
Western → fries present (any type) or western cutlet plate
Indian/Mamak → thosai/roti/murtabak/briyani/curry with bread
Malay → satay/rendang/rojak/otah/malay kuih
Dim Sum/Snack → dumplings/bao/dim sum/small kuih/snacks
Drink/Dessert → any beverage or sweet dessert

Reply format (no other text):
STARCH: [value]
PROTEIN: [value]
LIQUID: [value]
CATEGORY: [category]`,
          },
        ],
      }],
    })

    const pre = preCheckResponse.content[0].text.trim()
    const detectedCategory = pre.match(/CATEGORY:\s*(.+)/i)?.[1]?.trim() || null
    const preProteinLine = pre.match(/PROTEIN:\s*(.+)/i)?.[1]?.toLowerCase().trim() || ''
    const preIsDrink = detectedCategory === 'Drink/Dessert'
    const preProtein = preProteinLine.includes('fish') ? 'fish'
      : preProteinLine.includes('pork') ? 'pork'
      : 'chicken'

    console.log('Stage 1:', pre.replace(/\n/g, ' | '), '→ cat:', detectedCategory)

    // ── FAST PATH: drink ─────────────────────────────────────────────────────
    if (preIsDrink) {
      const drinkResponse = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 30,
        messages: [{
          role: 'user',
          content: [
            imageBlock,
            {
              type: 'text',
              text: 'Which drink is this? Reply with exactly one: KOPI, TEH, MILO, TEH_TARIK, THAI_MILK_TEA, BANDUNG, SUGARCANE, BUBBLE_TEA',
            },
          ],
        }],
      })
      const drinkText = drinkResponse.content[0].text.trim().toLowerCase()
      const drinkMap = {
        kopi: 'kopi', teh: 'teh', milo: 'milo-dinosaur',
        teh_tarik: 'teh-tarik', thai_milk_tea: 'thai-milk-tea',
        bandung: 'bandung', sugarcane: 'sugarcane-juice', bubble_tea: 'bubble-tea',
      }
      const drinkId = Object.entries(drinkMap).find(([k]) => drinkText.includes(k))?.[1] || 'kopi'
      console.log('Stage 1 → Drink fast path:', drinkId)
      return Response.json({ dishId: drinkId, confidence: 82 })
    }

    // ── MAIN DETECTION: Haiku (free) or Opus (Pro) ───────────────────────────
    const isPro = request.headers.get('x-user-tier') === 'pro'
    const mainModel = isPro ? 'claude-opus-4-7' : 'claude-haiku-4-5-20251001'
    console.log('Main model:', mainModel, isPro ? '(Pro)' : '(Free)')

    const response = await client.messages.create({
      model: mainModel,
      max_tokens: 700,
      system: `You are an expert Southeast Asian hawker food identifier specialising in Singapore and Malaysia cuisine.

STEP 1 — VISUAL INVENTORY (do this before naming any dish):
- PROTEIN: Describe the main protein exactly (fried chicken cutlet, fish fillet, prawns, minced pork, tofu...)
- STARCH: What starch is present? (crinkle-cut fries, white rice, yellow noodles, flat rice noodles, vermicelli, none)
- SAUCE: Color and texture (brown pepper gravy, red chili paste, clear broth, dark soy glaze...)
- SIDES: Any accompaniments (mixed corn/carrot/pea veg, cucumber, sambal, fried shallots...)
- PLATING: How served (white oval plate, bowl with broth, banana leaf, claypot...)

STEP 2 — MATCH TO DISH using your inventory. Do NOT guess the dish first then justify it.

KNOWN TRAPS — you must check these:
- If STARCH is not noodles, you CANNOT return a noodle dish (Mee Goreng, Laksa, Hokkien Mee, etc.)
- Brown sauce alone does NOT mean Mee Goreng. Mee Goreng requires visible yellow noodles.
- Crinkle-cut fries + fried protein + brown gravy + mixed veg = Kopitiam Western (Chicken Chop, Pork Chop, Fish & Chips)
- Green table background is irrelevant. Only judge what is on the plate.
- Mixed corn/carrot/pea veg = Kopitiam Western side dish, not a hawker stir-fry indicator.

FEW-SHOT CORRECTION EXAMPLES — learn from these past mistakes:

EXAMPLE 1 — Grilled Chicken Set (commonly misidentified)
Visual inventory: PROTEIN: grilled chicken thigh, skin-on, pepper seasoning, no batter | STARCH: thick-cut wedge fries (NOT crinkle-cut) | SAUCE: sweet chili dipping sauce in separate cup, NO gravy on plate | SIDES: garden salad — lettuce, broccoli, cherry tomatoes, cucumber, thousand island dressing | PLATING: black oval plate, casual dining or food court western stall
→ Correct answer: Grilled Chicken Set, ~680 kcal, category: Kopitiam Western
TRAP: If protein is GRILLED (char marks, no batter, no breading) AND there is NO brown gravy on the plate → this is Grilled Chicken Set. Chicken Chop ALWAYS has brown pepper or mushroom gravy poured directly over the chicken. Absence of gravy disqualifies Chicken Chop entirely.

EXAMPLE 2 — Chicken Chop (commonly misidentified as Mee Goreng)
Visual inventory: PROTEIN: fried chicken cutlet, flattened, battered/breaded | STARCH: crinkle-cut fries | SAUCE: brown pepper or mushroom gravy poured OVER the chicken | SIDES: mixed corn/carrot/pea vegetables | PLATING: white oval plate, kopitiam western stall
→ Correct answer: Chicken Chop, ~780 kcal, category: Kopitiam Western
TRAP: Brown sauce + no noodles = gravy dish (Chicken Chop, Pork Chop). NEVER a noodle dish. Mee Goreng requires visible yellow noodles — if no noodles are present, it cannot be Mee Goreng regardless of sauce colour.

Respond ONLY in valid JSON with this exact structure:
{
  "visual_inventory": {
    "protein": "string",
    "starch": "string",
    "sauce": "string",
    "sides": "string",
    "plating": "string"
  },
  "dish": "string",
  "category": "string",
  "confidence": number,
  "needsConfirmation": boolean,
  "calories": number,
  "protein_g": number,
  "carbs_g": number,
  "fat_g": number,
  "alternatives": [{ "dish": "string", "calories": number, "reason": "string" }],
  "reason": "string",
  "visual_cues": "string",
  "trap_checks": {
    "noodle_dish_has_noodles": boolean,
    "background_ignored": boolean,
    "western_veg_checked": boolean
  }
}`,
      messages: [{
        role: 'user',
        content: [
          imageBlock,
          {
            type: 'text',
            text: `Identify this dish. Category pre-classified as: ${detectedCategory || 'unknown'}.

DISH TAXONOMY:
${TAXONOMY_REF}

CANDIDATE DISHES (${detectedCategory || 'all'} — ${(DISH_LIST_BY_CAT[detectedCategory] ?? DISH_LIST).split('\n').length} dishes):
${DISH_LIST_BY_CAT[detectedCategory] ?? DISH_LIST}

Respond ONLY with valid JSON. No markdown, no explanation outside the JSON.`,
          },
        ],
      }],
    })

    const text = response.content[0].text.trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    let result = JSON.parse(jsonMatch[0])
    result = applyConfidenceOverrides(result, text)

    const dishId = resolveDishId(result.dish) || Object.keys(DISHES)[0]
    if (!DISHES[dishId]) throw new Error('Unknown dishId: ' + dishId)

    console.log('Visual inventory:', JSON.stringify(result.visual_inventory))
    console.log('Dish:', result.dish, '→', dishId, result.confidence + '%')
    if (result.override_reason) console.log('Override:', result.override_reason)

    return Response.json({
      dishId,
      confidence: Math.min(99, Math.max(40, result.confidence)),
    })
  } catch (err) {
    console.error('Detection error:', err.message)
    const ids = Object.keys(DISHES)
    return Response.json({ dishId: ids[Math.floor(Math.random() * ids.length)], confidence: 55 })
  }
}
