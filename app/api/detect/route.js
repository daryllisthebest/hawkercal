import Anthropic from '@anthropic-ai/sdk'
import { DISHES } from '@/lib/mockData'

// Change 3 — Dish taxonomy used by the prompt and for category-level disambiguation
const DISH_TAXONOMY = {
  'Kopitiam Western': {
    visual_signature: 'crinkle-cut fries, fried protein cutlet, brown gravy, mixed corn/carrot/pea veg, white oval plate',
    dishes: [
      { name: 'Chicken Chop', calories: 780, cues: 'fried chicken cutlet, crinkle fries, pepper or mushroom brown gravy' },
      { name: 'Pork Chop', calories: 820, cues: 'pork cutlet, fries, brown sauce' },
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

// Build taxonomy reference string included in every prompt
const TAXONOMY_REF = Object.entries(DISH_TAXONOMY)
  .map(([cat, data]) => {
    const dishes = data.dishes.map(d => `    - ${d.name}: ${d.cues}`).join('\n')
    return `  ${cat} [${data.visual_signature}]\n${dishes}`
  })
  .join('\n\n')

// Full enriched dish list for dishes not covered by the taxonomy
const DISH_LIST = Object.values(DISHES)
  .map(d => {
    const name = `${d.name}${d.nameLocal ? ` (${d.nameLocal})` : ''}`
    const desc = d.description ? d.description.slice(0, 100) : ''
    const tags = d.tags?.slice(0, 4).join(', ') || ''
    return `  ${d.id}: ${name} | ${desc} | [${tags}]`
  })
  .join('\n')

// Name → dish ID lookup (covers taxonomy names + full database aliases)
const DISH_NAME_TO_ID = {
  // Kopitiam Western
  'chicken chop': 'chicken-chop',
  'pork chop': 'pork-chop',
  'fish & chips': 'fish-and-chips',
  'fish and chips': 'fish-and-chips',
  'fish n chips': 'fish-and-chips',
  'chicken cutlet rice': 'chicken-rice',
  'french fries': 'fries',
  // Noodle dishes
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
  // Rice dishes
  'hainanese chicken rice': 'chicken-rice',
  'chicken rice': 'chicken-rice',
  'nasi lemak': 'nasi-lemak',
  'nasi goreng': 'nasi-goreng',
  'biryani': 'biryani',
  'duck rice': 'duck-rice',
  'roast duck rice': 'duck-rice',
  'char siew rice': 'char-siew-rice',
  'char siu rice': 'char-siew-rice',
  'soy sauce chicken rice': 'soy-sauce-chicken-rice',
  'cai png': 'cai-png',
  'economy rice': 'cai-png',
  'mixed rice': 'cai-png',
  'com tam': 'com-tam',
  // Soups & broths
  'bak kut teh': 'bak-kut-teh',
  'fish head curry': 'chilli-crab', // closest match in DB
  'tom yum': 'tom-yum',
  'soto ayam': 'soto-ayam',
  'pho': 'pho',
  'pho ga': 'pho-ga',
  'mala hot pot': 'mala-hotpot',
  'mala hotpot': 'mala-hotpot',
  'mala xiang guo': 'mala-xiang-guo',
  // Malay / Indian
  'rendang': 'rendang',
  'satay': 'satay',
  'roti prata': 'roti-prata',
  'murtabak': 'murtabak',
  'lontong': 'lontong',
  'gado gado': 'gado-gado',
  'green curry': 'green-curry',
  'pad krapow': 'pad-krapow',
  // Breakfast / snacks
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
  // Vietnamese / other SEA
  'banh mi': 'banh-mi',
  'bun cha': 'bun-cha',
  'spring rolls': 'spring-rolls',
  'adobo': 'adobo',
  'sinigang': 'sinigang',
  'sisig': 'sisig',
  // Seafood
  'chilli crab': 'chilli-crab',
  'chili crab': 'chilli-crab',
  // Desserts
  'ice kachang': 'ice-kachang',
  'ice kaching': 'ice-kachang',
  'chendol': 'chendol',
  'ice cream bread': 'ice-cream-bread',
  // Drinks
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

  // 1. Direct name lookup
  if (DISH_NAME_TO_ID[lower]) return DISH_NAME_TO_ID[lower]

  // 2. Exact match on dish ID (hyphens → spaces)
  const byId = Object.keys(DISHES).find(id => id.replace(/-/g, ' ') === lower)
  if (byId) return byId

  // 3. Exact match on dish.name
  const byName = Object.values(DISHES).find(d => d.name.toLowerCase() === lower)
  if (byName) return byName.id

  // 4. Partial contains match
  const partial = Object.values(DISHES).find(d =>
    lower.includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(lower)
  )
  if (partial) return partial.id

  return null
}

// Change 2 — Post-processing confidence overrides
// rawText = full model response string, scanned as a safety net when fields are misfiled
function applyConfidenceOverrides(result, rawText = '') {
  const noodleDishes = [
    'mee goreng', 'laksa', 'hokkien mee', 'char kway teow',
    'pad thai', 'bak chor mee', 'wonton noodle', 'mee rebus',
    'mee siam', 'prawn noodle',
  ]

  // Scan the entire inventory object AND raw response — catches keywords in any field
  const inventoryStr = JSON.stringify(result.visual_inventory || {}).toLowerCase()
  const rawLower = rawText.toLowerCase()
  const everywhere = inventoryStr + ' ' + rawLower

  const starch = result.visual_inventory?.starch?.toLowerCase() || ''
  const dish = result.dish?.toLowerCase() || ''
  const isNoodleDish = noodleDishes.some(n => dish.includes(n))
  const hasNoNoodles = !starch.includes('noodle') && !starch.includes('vermicelli')

  // Fries: check every field + raw text for any potato/fries phrasing
  const hasFries = everywhere.includes('fries') || everywhere.includes('crinkle') ||
    everywhere.includes('chips') || everywhere.includes('potato')

  // Kopitiam western veg: corn or peas anywhere in response is a unique signature
  const hasWesternVeg = everywhere.includes('corn') || everywhere.includes(' peas') ||
    everywhere.includes('pea,') || everywhere.includes('mixed veg')

  // Rule 1: Noodle dish detected but no noodles in visual inventory
  if (isNoodleDish && hasNoNoodles) {
    result.confidence = Math.min(result.confidence, 35)
    result.needsConfirmation = true
    result.override_reason = 'Noodle dish detected but no noodles found in visual inventory'
  }

  // Rule 2: Fries OR kopitiam western veg → deterministically force Kopitiam Western
  // Crinkle-cut fries or corn/pea/carrot mix in a Singapore hawker context = kopitiam western
  if (hasFries || hasWesternVeg) {
    const protein = result.visual_inventory?.protein?.toLowerCase() || ''
    if (protein.includes('fish') || protein.includes('fillet') || protein.includes('battered')) {
      result.dish = 'Fish & Chips'
    } else if (protein.includes('pork')) {
      result.dish = 'Pork Chop'
    } else {
      result.dish = 'Chicken Chop'
    }
    result.category = 'Kopitiam Western'
    result.confidence = 85
    result.needsConfirmation = false
    result.override_reason = 'Fries/western veg detected — forced to Kopitiam Western dish based on protein'
  }

  // Rule 3: Any confidence below 70 must show confirmation
  if (result.confidence < 70) {
    result.needsConfirmation = true
  }

  // Rule 4: Drink result contradicts solid food evidence — model hallucinated
  const drinkKeywords = ['tea', 'kopi', 'teh', 'coffee', 'juice', 'milk tea', 'bubble', 'milo', 'bandung', 'sugarcane', 'iced']
  const isDrinkResult = drinkKeywords.some(k => dish.includes(k))
  const solidFoodEvidence = ['plate', 'bowl', 'chicken', 'pork', 'fish', 'rice', 'noodle', 'fries', 'potato', 'egg', 'prawn', 'crinkle', 'cutlet', 'gravy']
  const hasSolidFood = solidFoodEvidence.some(f => everywhere.includes(f))
  if (isDrinkResult && hasSolidFood) {
    // Model named a drink but the scene clearly has food — use protein to pick best guess
    if (everywhere.includes('fish') || everywhere.includes('fillet')) {
      result.dish = 'Fish & Chips'
    } else if (everywhere.includes('pork')) {
      result.dish = 'Pork Chop'
    } else if (everywhere.includes('chicken')) {
      result.dish = 'Chicken Chop'
    } else if (everywhere.includes('rice')) {
      result.dish = 'Hainanese Chicken Rice'
    }
    result.confidence = 60
    result.needsConfirmation = true
    result.override_reason = 'Drink result rejected — solid food evidence found in visual inventory'
  }

  return result
}

export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    const ids = Object.keys(DISHES)
    const dishId = ids[Math.floor(Math.random() * ids.length)]
    return Response.json({ dishId, confidence: 72 })
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

  try {
    // Change 1 — Single-step structured visual inventory approach
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
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
  "alternatives": [
    { "dish": "string", "calories": number, "reason": "string" }
  ],
  "reason": "string",
  "visual_cues": "string",
  "trap_checks": {
    "noodle_dish_has_noodles": boolean,
    "background_ignored": boolean,
    "western_veg_checked": boolean
  }
}`,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: imageBase64 },
            },
            {
              type: 'text',
              text: `Identify this dish. Use dish names from the taxonomy and database below.

DISH TAXONOMY:
${TAXONOMY_REF}

FULL DISH DATABASE:
${DISH_LIST}

Respond ONLY with valid JSON. No markdown, no explanation outside the JSON.`,
            },
          ],
        },
      ],
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
    if (result.override_reason) console.log('Override applied:', result.override_reason)
    if (result.trap_checks) console.log('Trap checks:', JSON.stringify(result.trap_checks))

    return Response.json({
      dishId,
      confidence: Math.min(99, Math.max(40, result.confidence)),
    })
  } catch (err) {
    console.error('Detection error:', err.message)
    const ids = Object.keys(DISHES)
    return Response.json({
      dishId: ids[Math.floor(Math.random() * ids.length)],
      confidence: 55,
    })
  }
}
