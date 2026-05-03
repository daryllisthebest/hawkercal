#!/usr/bin/env node
// One-time batch population script
// Run: node scripts/generate-dishes.mjs

import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const client = new Anthropic()

// ── Country / color mappings ─────────────────────────────────────────────────

const COUNTRY_MAP = {
  SG: { origin: 'Singapore', flag: '🇸🇬' },
  MY: { origin: 'Malaysia',  flag: '🇲🇾' },
  TH: { origin: 'Thailand',  flag: '🇹🇭' },
  ID: { origin: 'Indonesia', flag: '🇮🇩' },
  VN: { origin: 'Vietnam',   flag: '🇻🇳' },
  PH: { origin: 'Philippines', flag: '🇵🇭' },
  CN: { origin: 'China',     flag: '🇨🇳' },
  IN: { origin: 'India',     flag: '🇮🇳' },
}

const CATEGORY_COLORS = {
  Rice:     { color: '#F59E0B', bgColor: '#FEF3C7' },
  Noodles:  { color: '#EA580C', bgColor: '#FFEDD5' },
  Soup:     { color: '#0891B2', bgColor: '#CFFAFE' },
  Western:  { color: '#B45309', bgColor: '#FEF3C7' },
  Indian:   { color: '#DC2626', bgColor: '#FEE2E2' },
  Malay:    { color: '#16A34A', bgColor: '#DCFCE7' },
  'Dim Sum':{ color: '#BE185D', bgColor: '#FCE7F3' },
  Congee:   { color: '#6B7280', bgColor: '#F3F4F6' },
  Snack:    { color: '#D97706', bgColor: '#FEF3C7' },
  Dessert:  { color: '#EC4899', bgColor: '#FCE7F3' },
  Drink:    { color: '#2563EB', bgColor: '#DBEAFE' },
  Seafood:  { color: '#0284C7', bgColor: '#E0F2FE' },
  BBQ:      { color: '#B91C1C', bgColor: '#FEE2E2' },
  Salad:    { color: '#15803D', bgColor: '#DCFCE7' },
}

// ── Dishes to generate ───────────────────────────────────────────────────────

const DISHES_TO_GENERATE = [
  // Kopitiam Western
  'Grilled Chicken Set', 'Hainanese Beef Steak', 'Lamb Chop Kopitiam',
  'Chicken Cutlet Rice', 'Mushroom Chicken Chop',

  // Indian & Mamak
  'Thosai Plain', 'Thosai Egg', 'Murtabak Chicken', 'Murtabak Mutton',
  'Briyani Chicken', 'Briyani Mutton', 'Fish Head Curry',
  'Curry Chicken', 'Dal Curry', 'Tandoori Chicken',
  'Chapati', 'Naan', 'Lassi',

  // Dim Sum & Yum Cha
  'Har Gow', 'Siu Mai', 'Char Siew Bao Steamed', 'Char Siew Bao Baked',
  'Cheung Fun', 'Lo Mai Gai', 'Egg Tart', 'Lo Bak Go',
  'Taro Dumpling', 'Xiao Long Bao',

  // Congee & Porridge
  'Plain Congee', 'Sampan Porridge', 'Frog Leg Porridge',
  'Century Egg Porridge', 'Chicken Congee', 'Fish Congee',

  // Malay Hawker
  'Nasi Padang', 'Mee Rebus', 'Mee Siam', 'Rojak',
  'Popiah Fresh', 'Otah Otah', 'Nasi Goreng Kampung',
  'Kuih Tutu', 'Putu Piring', 'Epok Epok',
  'Mee Bandung', 'Soto Betawi',

  // Chinese Hawker
  'Prawn Noodle Soup', 'Yong Tau Foo',
  'Braised Duck Noodles', 'Lor Mee', 'Kway Chap',
  'Claypot Rice', 'Oyster Omelette',
  'Muah Chee', 'Tang Yuan',

  // Additional Malaysian
  'Asam Laksa', 'Curry Laksa', 'Penang Char Kway Teow',
  'Wonton Noodle Soup', 'Pan Mee', 'Hakka Mee',
  'Nasi Kandar', 'Roti Canai', 'Banana Leaf Rice',
  'Cendol Malaysian', 'ABC Air Batu Campur',

  // Additional Vietnamese
  'Bun Bo Hue', 'Mi Quang', 'Banh Xeo', 'Goi Cuon',
  'Hu Tieu', 'Com Ga Hoi An',

  // Beverages
  'Kopi O', 'Kopi C', 'Teh O', 'Teh C',
  'Barley Water', 'Chrysanthemum Tea', 'Soya Bean Milk',
  'Coconut Water', 'Calamansi Juice', 'Watermelon Juice',

  // Desserts
  'Tau Huay', 'Grass Jelly Cincau',
  'Red Bean Soup', 'Peanut Soup', 'Bubur Cha Cha',
  'Durian Pengat', 'Kueh Lapis', 'Angku Kueh',
]

// ── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a Southeast Asian food expert and nutritionist specialising in Singapore and Malaysia hawker cuisine.

For each dish name provided, generate a complete dish profile in this exact JSON format:
{
  "name": "string — official English dish name",
  "localName": "string — local language name or romanised name (empty string if none)",
  "emoji": "string — single most appropriate food emoji",
  "country": "SG | MY | TH | ID | VN | PH | CN | IN",
  "category": "Rice | Noodles | Soup | Western | Indian | Malay | Dim Sum | Congee | Snack | Dessert | Drink | Seafood | BBQ | Salad",
  "tags": ["2-4 short descriptive tags"],
  "description": "1-2 sentence description for a food app. Factual and concise.",
  "calories": number,
  "calories_min": number,
  "calories_max": number,
  "protein_g": number,
  "carbs_g": number,
  "fat_g": number,
  "fiber_g": number,
  "visual_detection": {
    "protein": "exact description of protein (e.g. 'grilled chicken thigh, skin-on, char marks, no batter') or 'none'",
    "starch": "exact starch type (e.g. 'thick wedge fries' or 'flat rice noodles' or 'white jasmine rice' or 'none')",
    "sauce": "sauce color and texture (e.g. 'brown pepper gravy poured over protein' or 'clear broth')",
    "sides": "accompaniments (e.g. 'garden salad with cherry tomatoes' or 'none')",
    "plating": "serving vessel and style (e.g. 'black oval plate' or 'bowl with broth' or 'banana leaf')",
    "key_identifiers": ["3-5 visual features that make this dish unique"],
    "common_lookalikes": ["2-3 dishes this is commonly confused with"],
    "differentiators": "exactly how to tell this dish apart from its lookalikes"
  }
}

Return a JSON array of all dish objects. Return ONLY valid JSON — no markdown fences, no explanation outside the array.
Be precise with visual_detection — it is used by an AI vision model to identify dishes from photos.`

// ── Helpers ──────────────────────────────────────────────────────────────────

function toId(name) {
  return name.toLowerCase()
    .replace(/[()]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function convertToEntry(dish) {
  const loc   = COUNTRY_MAP[dish.country] || COUNTRY_MAP.SG
  const col   = CATEGORY_COLORS[dish.category] || CATEGORY_COLORS.Rice
  const id    = toId(dish.name)
  const cal   = dish.calories
  const fiber = dish.fiber_g ?? 2

  return {
    id,
    name: dish.name,
    ...(dish.localName ? { nameLocal: dish.localName } : {}),
    origin:      loc.origin,
    flag:        loc.flag,
    emoji:       dish.emoji,
    color:       col.color,
    bgColor:     col.bgColor,
    description: dish.description,
    baseCalories: cal,
    calorieRange: { min: dish.calories_min, max: dish.calories_max },
    macros: {
      protein: dish.protein_g,
      carbs:   dish.carbs_g,
      fat:     dish.fat_g,
      fiber,
    },
    tags: dish.tags,
    visual_detection: dish.visual_detection,
    questions: [
      {
        id: 'portion',
        question: 'How big was your portion?',
        subtitle: 'Portion size is the biggest calorie variable',
        type: 'single',
        options: [
          { id: 'small',   label: 'Small',   desc: 'Light / half portion', icon: '🤏', modifier: -Math.round(cal * 0.2) },
          { id: 'regular', label: 'Regular', desc: 'Standard serving',     icon: '👌', modifier: 0 },
          { id: 'large',   label: 'Large',   desc: 'Generous portion',     icon: '👐', modifier:  Math.round(cal * 0.25) },
        ],
      },
    ],
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  const BATCH = 8
  const entries = {}
  const ids = []

  for (let i = 0; i < DISHES_TO_GENERATE.length; i += BATCH) {
    const batch = DISHES_TO_GENERATE.slice(i, i + BATCH)
    const batchNum = Math.floor(i / BATCH) + 1
    const total = Math.ceil(DISHES_TO_GENERATE.length / BATCH)
    process.stdout.write(`\nBatch ${batchNum}/${total}: ${batch.join(', ')} … `)

    try {
      const res = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: `Generate dish profiles for: ${batch.join(', ')}` }],
      })

      const raw = res.content[0].text.trim()
      const jsonStr = raw.match(/\[[\s\S]*\]/)?.[0]
      if (!jsonStr) throw new Error('No JSON array in response')
      const dishes = JSON.parse(jsonStr)

      for (const dish of dishes) {
        const entry = convertToEntry(dish)
        entries[entry.id] = entry
        ids.push(entry.id)
        process.stdout.write(`\n  ✓ ${dish.name} → ${entry.id} (${dish.calories} kcal)`)
      }
    } catch (err) {
      process.stderr.write(`\n  ✗ Batch ${batchNum} failed: ${err.message}`)
    }

    if (i + BATCH < DISHES_TO_GENERATE.length) {
      await new Promise(r => setTimeout(r, 1500))
    }
  }

  // Write raw JSON output for inspection
  const outPath = join(__dirname, 'generated-dishes.json')
  writeFileSync(outPath, JSON.stringify({ entries, ids }, null, 2))
  console.log(`\n\n✅ Generated ${ids.length} dishes → scripts/generated-dishes.json`)

  // Patch mockData.js
  patchMockData(entries, ids)
}

function patchMockData(entries, ids) {
  const mockPath = join(__dirname, '..', 'lib', 'mockData.js')
  let src = readFileSync(mockPath, 'utf8')

  // Find the closing brace of the DISHES object (the line before FEATURED_DISH_IDS export)
  const insertMarker = '}\n\nexport const FEATURED_DISH_IDS'
  const markerIdx = src.indexOf(insertMarker)
  if (markerIdx === -1) {
    console.error('Could not find insertion point in mockData.js')
    process.exit(1)
  }

  // Build the new entries as JS source
  const newEntries = Object.values(entries).map(entry => {
    const json = JSON.stringify(entry, null, 2)
    // Convert JSON to JS object literal (remove outer braces, keep indent)
    const inner = json.slice(1, -1)
    return `  '${entry.id}': ${inner.trim().replace(/^{/, '{\n  ').replace(/}$/, '  }')},\n`
  }).join('\n')

  // Better: serialize each entry as a proper JS entry
  const jsEntries = Object.values(entries).map(entry => entryToJs(entry)).join('\n\n')

  const patched = src.slice(0, markerIdx) + '\n' + jsEntries + '\n' + src.slice(markerIdx)

  // Also add new IDs to FEATURED_DISH_IDS array
  const featuredMarker = "// Kopitiam Drinks\n  'kopi'"
  const newFeaturedIds = ids.map(id => `  '${id}'`).join(',\n')
  const patchedWithFeatured = patched.replace(
    "// Kopitiam Drinks\n  'kopi'",
    `// Generated dishes\n${newFeaturedIds},\n  // Kopitiam Drinks\n  'kopi'`
  )

  writeFileSync(mockPath, patchedWithFeatured)
  console.log(`✅ Patched lib/mockData.js with ${ids.length} new dishes`)
}

function entryToJs(entry) {
  const lines = []
  const e = entry

  lines.push(`  '${e.id}': {`)
  lines.push(`    id: '${e.id}',`)
  lines.push(`    name: ${JSON.stringify(e.name)},`)
  if (e.nameLocal) lines.push(`    nameLocal: ${JSON.stringify(e.nameLocal)},`)
  lines.push(`    origin: '${e.origin}',`)
  lines.push(`    flag: '${e.flag}',`)
  lines.push(`    emoji: '${e.emoji}',`)
  lines.push(`    color: '${e.color}',`)
  lines.push(`    bgColor: '${e.bgColor}',`)
  lines.push(`    description: ${JSON.stringify(e.description)},`)
  lines.push(`    baseCalories: ${e.baseCalories},`)
  lines.push(`    calorieRange: { min: ${e.calorieRange.min}, max: ${e.calorieRange.max} },`)
  lines.push(`    macros: { protein: ${e.macros.protein}, carbs: ${e.macros.carbs}, fat: ${e.macros.fat}, fiber: ${e.macros.fiber} },`)
  lines.push(`    tags: ${JSON.stringify(e.tags)},`)

  // visual_detection
  const vd = e.visual_detection
  if (vd) {
    lines.push(`    visual_detection: {`)
    lines.push(`      protein: ${JSON.stringify(vd.protein)},`)
    lines.push(`      starch: ${JSON.stringify(vd.starch)},`)
    lines.push(`      sauce: ${JSON.stringify(vd.sauce)},`)
    lines.push(`      sides: ${JSON.stringify(vd.sides)},`)
    lines.push(`      plating: ${JSON.stringify(vd.plating)},`)
    lines.push(`      key_identifiers: ${JSON.stringify(vd.key_identifiers)},`)
    lines.push(`      common_lookalikes: ${JSON.stringify(vd.common_lookalikes)},`)
    lines.push(`      differentiators: ${JSON.stringify(vd.differentiators)},`)
    lines.push(`    },`)
  }

  // questions
  lines.push(`    questions: [`)
  for (const q of e.questions) {
    lines.push(`      {`)
    lines.push(`        id: '${q.id}',`)
    lines.push(`        question: ${JSON.stringify(q.question)},`)
    if (q.subtitle) lines.push(`        subtitle: ${JSON.stringify(q.subtitle)},`)
    lines.push(`        type: '${q.type}',`)
    lines.push(`        options: [`)
    for (const opt of q.options) {
      lines.push(`          { id: '${opt.id}', label: ${JSON.stringify(opt.label)}, desc: ${JSON.stringify(opt.desc)}, icon: '${opt.icon}', modifier: ${opt.modifier} },`)
    }
    lines.push(`        ],`)
    lines.push(`      },`)
  }
  lines.push(`    ],`)
  lines.push(`  },`)

  return lines.join('\n')
}

run().catch(err => { console.error(err); process.exit(1) })
