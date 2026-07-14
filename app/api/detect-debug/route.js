import Anthropic from '@anthropic-ai/sdk'
import { DISHES } from '@/lib/mockData'

if (typeof process !== 'undefined') {
  console.log('[detect-debug/route] API key present at startup:', !!process.env.ANTHROPIC_API_KEY)
}

// ── Rebuild the same constants as detect/route.js ────────────────────────────

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
      const ids = vd.key_identifiers?.slice(0, 4).join('; ') || ''
      const diff = vd.differentiators ? ` | DIFF: ${vd.differentiators.slice(0, 120)}` : ''
      return `  ${d.id}: ${name} | ${vd.protein} + ${vd.starch} + ${vd.sauce} | KEY: ${ids}${diff}`
    }
    const desc = d.description ? d.description.slice(0, 100) : ''
    const tags = d.tags?.slice(0, 4).join(', ') || ''
    return `  ${d.id}: ${name} | ${desc} | [${tags}]`
  })
  .join('\n')

const DETECTION_CAT_OVERRIDES = {
  'chicken-chop': 'Western', 'fish-and-chips': 'Western', 'pork-chop': 'Western', 'fries': 'Western',
  'char-kway-teow': 'Noodles', 'laksa': 'Noodles', 'pad-thai': 'Noodles', 'hokkien-mee': 'Noodles',
  'mee-goreng': 'Noodles', 'bak-chor-mee': 'Noodles', 'wanton-mee': 'Noodles', 'mee-pok': 'Noodles',
  'fishball-mee': 'Noodles', 'bee-hoon': 'Noodles', 'mee-soto': 'Noodles', 'bun-cha': 'Noodles',
  'mee-pok-fishball-set': 'Noodles',
  'lu-rou-fan': 'Rice',
  'chicken-rice': 'Rice', 'nasi-lemak': 'Rice', 'nasi-goreng': 'Rice', 'nasi-goreng-id': 'Rice',
  'cai-png': 'Rice', 'duck-rice': 'Rice', 'char-siew-rice': 'Rice', 'com-tam': 'Rice',
  'pad-krapow': 'Rice', 'nasi-padang': 'Rice', 'nasi-goreng-kampung': 'Rice', 'claypot-rice': 'Rice',
  'pho': 'Soup', 'pho-ga': 'Soup', 'soto-ayam': 'Soup', 'tom-yum': 'Soup',
  'bak-kut-teh': 'Soup', 'sinigang': 'Soup', 'kare-kare': 'Soup', 'mala-hotpot': 'Soup', 'chilli-crab': 'Soup',
  'rendang': 'Malay', 'gado-gado': 'Malay', 'satay': 'Malay', 'green-curry': 'Malay', 'lontong': 'Malay',
  'mala-xiang-guo': 'Malay', 'adobo': 'Malay', 'sisig': 'Malay', 'lechon': 'Malay',
  'roti-prata': 'Indian/Mamak',
  'you-tiao': 'Dim Sum/Snack', 'kaya-toast': 'Dim Sum/Snack', 'soft-boiled-eggs': 'Dim Sum/Snack',
  'chwee-kueh': 'Dim Sum/Snack', 'carrot-cake': 'Dim Sum/Snack', 'chicken-wing': 'Dim Sum/Snack',
  'sunny-side-up': 'Dim Sum/Snack', 'spring-rolls': 'Dim Sum/Snack', 'banh-mi': 'Dim Sum/Snack',
  'lumpia-ph': 'Dim Sum/Snack', 'sio-bak': 'Dim Sum/Snack',
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
  'chicken chop': 'chicken-chop', 'grilled chicken set': 'grilled-chicken-set',
  'grilled chicken': 'grilled-chicken-set', 'pork chop': 'pork-chop',
  'fish & chips': 'fish-and-chips', 'fish and chips': 'fish-and-chips',
  'chicken rice': 'chicken-rice', 'hainanese chicken rice': 'chicken-rice',
  'nasi lemak': 'nasi-lemak', 'nasi goreng': 'nasi-goreng',
  'char kway teow': 'char-kway-teow', 'mee goreng': 'mee-goreng',
  'laksa': 'laksa', 'hokkien mee': 'hokkien-mee', 'bak chor mee': 'bak-chor-mee',
  'mee pok': 'mee-pok', 'mee pok dry': 'mee-pok', 'mee pok ta': 'mee-pok',
  'fishball soup': 'fishball-soup', 'yu wan soup': 'fishball-soup',
  'mee pok ta set': 'mee-pok-fishball-set', 'mee pok set': 'mee-pok-fishball-set',
  'mee pok dry + fishball soup': 'mee-pok-fishball-set',
  'lu rou fan': 'lu-rou-fan', 'braised pork rice': 'lu-rou-fan',
  'bak kut teh': 'bak-kut-teh', 'roti prata': 'roti-prata', 'roti canai': 'roti-canai',
  'bubble tea': 'bubble-tea', 'boba': 'bubble-tea', 'teh tarik': 'teh-tarik',
  'kopi': 'kopi', 'teh': 'teh', 'milo': 'milo-dinosaur', 'milo dinosaur': 'milo-dinosaur',
  'cai png': 'cai-png', 'economy rice': 'cai-png', 'mixed rice': 'cai-png',
  'duck rice': 'duck-rice', 'claypot rice': 'claypot-rice',
  'pad thai': 'pad-thai', 'pho': 'pho', 'tom yum': 'tom-yum',
  'rendang': 'rendang', 'satay': 'satay', 'nasi padang': 'nasi-padang',
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

// Instrumented version of applyConfidenceOverrides — same logic, tracks every rule that fires
function applyConfidenceOverridesTracked(result, rawText = '') {
  const overrides_applied = []

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
    overrides_applied.push({ rule: 'Rule 1 — noodle dish / no noodles', action: 'confidence → 35, needsConfirmation = true' })
  }

  const hasWedgeFries = starch.includes('wedge') || everywhere.includes('wedge fries') || everywhere.includes('potato wedge')
  const hasGrilledProtein = (result.visual_inventory?.protein?.toLowerCase() || '').includes('grilled')

  if (hasWedgeFries && hasGrilledProtein) {
    const before = result.dish
    result.dish = (everywhere.includes('fish') || everywhere.includes('fillet')) ? 'Grilled Fish Set' : 'Grilled Chicken Set'
    result.category = 'Kopitiam Western'
    result.confidence = 82
    result.needsConfirmation = false
    result.override_reason = 'Grilled protein + wedge fries — Western set meal, not Chicken Chop (no gravy)'
    overrides_applied.push({ rule: 'Rule 4 — grilled + wedge fries', action: `dish forced ${before} → ${result.dish}`, confidence: 82 })
  } else if (hasFries || hasWesternVeg) {
    const before = result.dish
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
    overrides_applied.push({ rule: 'Rule 2 — crinkle fries / western veg', action: `dish forced ${before} → ${result.dish}`, confidence: 85 })
  }

  if (result.confidence < 70) {
    result.needsConfirmation = true
    overrides_applied.push({ rule: 'Rule 3 — low confidence', action: `needsConfirmation = true (confidence = ${result.confidence})` })
  }

  if (result.portion_eaten_estimate && result.portion_eaten_estimate > 20) {
    const remainingRatio = (100 - result.portion_eaten_estimate) / 100
    const calBefore = result.calories_total
    result.calories_total = Math.round(result.calories_total * remainingRatio)
    result.needsConfirmation = true
    result.override_reason = `Detected ~${result.portion_eaten_estimate}% already eaten — calories adjusted to reflect visible remaining portion`
    if (result.ingredients) {
      result.ingredients.forEach(ing => { ing.calories = Math.round(ing.calories * remainingRatio) })
    }
    overrides_applied.push({
      rule: 'Rule 6 — partial portion eaten',
      action: `calories_total ${calBefore} → ${result.calories_total} (×${remainingRatio.toFixed(2)}), needsConfirmation = true`,
    })
  }

  const bowlMentions = (result.visual_inventory?.plating?.toLowerCase().match(/bowl/g) || []).length
  if (bowlMentions >= 2 && !result.isCombo) {
    result.isCombo = true
    result.needsConfirmation = true
    result.override_reason = 'Multiple bowls detected — likely a main dish + soup side combo'
    overrides_applied.push({ rule: 'Rule 7 — multi-bowl', action: `isCombo = true, bowls mentioned: ${bowlMentions}` })
  }

  return { result, overrides_applied }
}

const STAGE2_SYSTEM_PROMPT = `You are an expert Southeast Asian hawker food identifier specialising in Singapore and Malaysia cuisine.

STEP 1 — VISUAL INVENTORY (do this before naming any dish):
- PROTEIN: Describe the main protein exactly (fried chicken cutlet, fish fillet, prawns, minced pork, tofu...)
- STARCH: What starch is present? (crinkle-cut fries, white rice, yellow noodles, flat rice noodles, vermicelli, none)
- SAUCE: Color and texture (brown pepper gravy, red chili paste, clear broth, dark soy glaze...)
- SIDES: Any accompaniments (mixed corn/carrot/pea veg, cucumber, sambal, fried shallots...)
- PLATING: How served (white oval plate, bowl with broth, banana leaf, claypot...)

STEP 2 — MATCH TO DISH using your inventory. Do NOT guess the dish first then justify it.
You must only return dish names that exist exactly in the DISH_LIST provided. Do not invent or approximate dish names.

KNOWN TRAPS — you must check these:
- If STARCH is not noodles, you CANNOT return a noodle dish (Mee Goreng, Laksa, Hokkien Mee, etc.)
- Brown sauce alone does NOT mean Mee Goreng. Mee Goreng requires visible yellow noodles.
- Crinkle-cut fries + fried protein + brown gravy + mixed veg = Kopitiam Western (Chicken Chop, Pork Chop, Fish & Chips)
- Green table background is irrelevant. Only judge what is on the plate.
- Mixed corn/carrot/pea veg = Kopitiam Western side dish, not a hawker stir-fry indicator.
- Clear or pale-yellow broth + large pork ribs submerged in a bowl = Bak Kut Teh. This is NEVER duck rice or any rice dish even if a side bowl of rice is visible nearby.
- A side bowl of rice at the edge of frame does NOT make the main dish a rice dish. Judge by what is in the central bowl.
- Round smooth white balls in a savoury bowl = fishballs. This is NEVER a dessert (Bubur Cha Cha, Tang Yuan, etc.). Fishballs appear with noodles or in broth; dessert balls are in sweet coconut milk and the bowl contains no meat or noodles.
- If minced pork, fish cake, or any savoury meat is visible, the dish CANNOT be a dessert.
- A heavily stained/messy bowl with orange residue but little food remaining is NOT a sign of low calories — it indicates a chili-sauce dish that has mostly been eaten. Do not under-estimate just because the bowl looks "empty-ish."
- Two-bowl setups (one main dish bowl + one small soup bowl) are extremely common in Singapore hawker dining. Always check for a second bowl in frame before finalizing a single-dish detection.

FEW-SHOT CORRECTION EXAMPLES — learn from these past mistakes:

EXAMPLE 1 — Grilled Chicken Set (commonly misidentified)
Visual inventory: PROTEIN: grilled chicken thigh, skin-on, pepper seasoning, no batter | STARCH: thick-cut wedge fries (NOT crinkle-cut) | SAUCE: sweet chili dipping sauce in separate cup, NO gravy on plate | SIDES: garden salad — lettuce, broccoli, cherry tomatoes, cucumber, thousand island dressing | PLATING: black oval plate, casual dining or food court western stall
→ Correct answer: Grilled Chicken Set, ~680 kcal, category: Kopitiam Western
TRAP: If protein is GRILLED (char marks, no batter, no breading) AND there is NO brown gravy on the plate → this is Grilled Chicken Set. Chicken Chop ALWAYS has brown pepper or mushroom gravy poured directly over the chicken. Absence of gravy disqualifies Chicken Chop entirely.

EXAMPLE 2 — Chicken Chop (commonly misidentified as Mee Goreng)
Visual inventory: PROTEIN: fried chicken cutlet, flattened, battered/breaded | STARCH: crinkle-cut fries | SAUCE: brown pepper or mushroom gravy poured OVER the chicken | SIDES: mixed corn/carrot/pea vegetables | PLATING: white oval plate, kopitiam western stall
→ Correct answer: Chicken Chop, ~780 kcal, category: Kopitiam Western
TRAP: Brown sauce + no noodles = gravy dish (Chicken Chop, Pork Chop). NEVER a noodle dish. Mee Goreng requires visible yellow noodles — if no noodles are present, it cannot be Mee Goreng regardless of sauce colour.

EXAMPLE 7 — Mee Pok Dry + Fishball Soup (partially eaten, messy bowl)
Visual inventory:
  PROTEIN: fishcake/dumpling visible at bottom of main bowl, partially eaten
  STARCH: flat yellow noodles, significant portion remaining (~60% of original)
  SAUCE: bowl rim and interior heavily stained orange/red from chili sauce —
         sauce remnants visible even where noodles have been eaten
  SIDES: spring onion flecks, soup spoon resting in bowl
  PLATING: TWO bowls visible — main noodle bowl (stained, partially eaten)
           and smaller side bowl with clear broth and fishballs

Correct dish: Mee Pok Dry + Fishball Soup
Total calories: ~540 kcal (full portion) — but ADJUST for visible remaining quantity

CRITICAL RULE for partially eaten food:
1. Estimate calories based on what is VISIBLE, not the assumed full portion.
2. Set a field "portion_eaten_estimate": number (0-100, percentage already consumed)
3. Stained/empty bowl areas indicate food WAS there — use this to estimate the ORIGINAL portion size, then apply the remaining percentage
4. Set needsConfirmation: true whenever portion_eaten_estimate > 20

Break the dish into individual ingredients with their own calorie contribution. For Chicken Chop, return separate entries for: fried chicken cutlet, crinkle fries, gravy, and mixed vegetables. Each ingredient must have its own calorie estimate. The sum of all ingredient calories must equal calories_total within 5%.

Respond ONLY in valid JSON with this exact structure:
{
  "thinking": "string",
  "dish": "string",
  "category": "string",
  "confidence": number,
  "needsConfirmation": boolean,
  "portion_eaten_estimate": number,
  "calories_total": number,
  "protein_g": number,
  "carbs_g": number,
  "fat_g": number,
  "ingredients": [
    { "id": "string", "name": "string", "type": "protein | starch | sauce | sides | drink", "emoji": "string", "weight_g": number, "calories": number, "protein_g": number, "carbs_g": number, "fat_g": number, "confidence": number, "description": "string" }
  ],
  "visual_inventory": { "protein": "string", "starch": "string", "sauce": "string", "sides": "string", "plating": "string" },
  "alternatives": [{ "dish": "string", "calories": number, "reason": "string" }],
  "trap_checks": { "noodle_dish_has_noodles": boolean, "background_ignored": boolean, "western_veg_checked": boolean },
  "reason": "string"
}`

export async function POST(request) {
  console.log('[detect-debug POST] Checking API key...', !!process.env.ANTHROPIC_API_KEY)
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[detect-debug POST] ANTHROPIC_API_KEY is missing!')
    return Response.json({ error: 'No API key — debug endpoint requires ANTHROPIC_API_KEY' }, { status: 503 })
  }
  console.log('[detect-debug POST] API key present, proceeding...')

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
    // ── STAGE 1 ──────────────────────────────────────────────────────────────
    const stage1UserPrompt = `Examine this food image. Focus on the PRIMARY dish in the largest/central bowl or plate. Ignore side bowls, condiment dishes, and background items at the edges of the frame.

Build a quick visual inventory of the PRIMARY dish only:
STARCH: white rice | fried rice | noodles | fries | roti/flatbread | none
PROTEIN: chicken | pork | fish | egg | tofu | prawns | other
LIQUID: broth | curry | gravy | none

Select ONE category:
Rice → rice is the base of the main dish (not a side bowl)
Noodles → noodles visible (yellow, flat, vermicelli) — noodles may be hidden under toppings; look for strands peeking out at the edges
Soup → broth-heavy dish, meat/ribs submerged in liquid, or congee/porridge
Western → fries present (any type) or western cutlet plate
Indian/Mamak → thosai/roti/murtabak/briyani/curry with bread
Malay → satay/rendang/rojak/otah/malay kuih
Dim Sum/Snack → dumplings/bao/dim sum/small kuih/snacks
Drink/Dessert → any beverage or sweet dessert — ONLY if no meat, fish, or savoury protein is present.

Reply format (no other text):
STARCH: [value]
PROTEIN: [value]
LIQUID: [value]
CATEGORY: [category]`

    const preCheckResponse = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      messages: [{ role: 'user', content: [imageBlock, { type: 'text', text: stage1UserPrompt }] }],
    })

    const stage1RawResponse = preCheckResponse.content[0].text.trim()
    const stage1TokensUsed = (preCheckResponse.usage?.input_tokens || 0) + (preCheckResponse.usage?.output_tokens || 0)
    const detectedCategory = stage1RawResponse.match(/CATEGORY:\s*(.+)/i)?.[1]?.trim() || null

    // ── STAGE 2 ──────────────────────────────────────────────────────────────
    const isPro = request.headers.get('x-user-tier') === 'pro'
    const mainModel = isPro ? 'claude-opus-4-7' : 'claude-haiku-4-5-20251001'

    const dishListForCategory = DISH_LIST_BY_CAT[detectedCategory] ?? DISH_LIST
    const dishCount = dishListForCategory.split('\n').length

    const stage2UserPrompt = `Identify this dish. Category pre-classified as: ${detectedCategory || 'unknown'}.

DISH TAXONOMY:
${TAXONOMY_REF}

CANDIDATE DISHES (${detectedCategory || 'all'} — ${dishCount} dishes):
${dishListForCategory}

Respond ONLY with valid JSON. No markdown, no explanation outside the JSON.`

    const response = await client.messages.create({
      model: mainModel,
      max_tokens: 1500,
      system: STAGE2_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: [imageBlock, { type: 'text', text: stage2UserPrompt }] }],
    })

    const stage2RawResponse = response.content[0].text.trim()
    const stage2TokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)

    // ── Parse + override ──────────────────────────────────────────────────────
    const jsonMatch = stage2RawResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in stage 2 response')

    let parsed = JSON.parse(jsonMatch[0])
    const { result: finalResult, overrides_applied } = applyConfidenceOverridesTracked(parsed, stage2RawResponse)

    const dishId = resolveDishId(finalResult.dish) || Object.keys(DISHES)[0]

    return Response.json({
      // Stage 1
      stage1_raw_response: stage1RawResponse,
      stage1_detected_category: detectedCategory,
      stage1_tokens_used: stage1TokensUsed,

      // Stage 2 inputs
      stage2_system_prompt_sent: STAGE2_SYSTEM_PROMPT,
      stage2_dish_list_sent: dishListForCategory,
      stage2_dish_count: dishCount,
      stage2_tokens_used: stage2TokensUsed,
      stage2_model: mainModel,

      // Stage 2 raw output
      stage2_raw_response: stage2RawResponse,

      // Post processing
      overrides_applied,

      // Final
      final_result: {
        dishId,
        dish: finalResult.dish,
        confidence: Math.min(99, Math.max(40, finalResult.confidence)),
        needsConfirmation: finalResult.needsConfirmation ?? false,
        portionEatenEstimate: finalResult.portion_eaten_estimate ?? 0,
        isCombo: finalResult.isCombo ?? false,
        calories_total: finalResult.calories_total ?? null,
        protein_g: finalResult.protein_g,
        carbs_g: finalResult.carbs_g,
        fat_g: finalResult.fat_g,
        ingredients: finalResult.ingredients ?? [],
        visual_inventory: finalResult.visual_inventory,
        alternatives: finalResult.alternatives ?? [],
        trap_checks: finalResult.trap_checks,
        reason: finalResult.reason,
        thinking: finalResult.thinking,
        override_reason: finalResult.override_reason || null,
      },
    })
  } catch (err) {
    return Response.json({ error: err.message, stack: err.stack }, { status: 500 })
  }
}
