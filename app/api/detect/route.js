import Anthropic from '@anthropic-ai/sdk'
import { DISHES } from '@/lib/mockData'

// Richer dish list: id | name | description snippet | tags
const DISH_LIST = Object.values(DISHES)
  .map(d => {
    const name = `${d.name}${d.nameLocal ? ` (${d.nameLocal})` : ''}`
    const desc = d.description ? d.description.slice(0, 120) : ''
    const tags = d.tags?.slice(0, 4).join(', ') || ''
    return `${d.id}: ${name} | ${desc} | [${tags}]`
  })
  .join('\n')

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
    // Step 1: Structured visual analysis — no dish list, no constraints
    const identifyResponse = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 400,
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
              text: `You are a Southeast Asian hawker food expert. Analyse this photo and fill in every field below. Be precise — wrong container or colour will cause a mismatch.

TYPE: <DRINK or FOOD>
DISH: <exact dish name, e.g. "Hainanese Chicken Rice" not just "rice">
CONTAINER: <e.g. round white plate / styrofoam box / ceramic bowl / paper bag / styrofoam cup / glass / wok>
COLOURS: <2–3 dominant colours of the food itself, e.g. "white rice, pale yellow chicken, clear broth">
SAUCE: <colour and texture of any sauce, e.g. "thick dark brown pepper sauce" or "none">
PROTEIN: <main protein, e.g. "poached chicken slices", "pork chop cutlet", "fish fillet", "tofu">
SIDES: <all sides visible, e.g. "crinkle-cut fries, mixed corn-peas-carrot veg" or "none">
FEATURES: <1–2 unique visual identifiers that distinguish this from similar dishes>

Critical cues:
- Warm opaque brown liquid in a cup/mug = DRINK (kopi or teh), never a food
- Large bone-in PORK RIBS submerged in a clear or pale yellow/milky broth in a deep white ceramic bowl = BAK KUT TEH — NOT bun cha, not any noodle dish
- Flat pan-fried chicken + brown sauce + crinkle fries + mixed veg on round white plate = Chicken Chop (kopitiam western)
- Crumbed pork cutlet + fries on white plate = Pork Chop
- Battered/crumbed flat fish fillet + fries = Fish and Chips
- White coconut rice mound + bright red sambal + ikan bilis + half egg = Nasi Lemak
- Dark soy braised chicken/pork on white rice = Soy Sauce Chicken Rice or Char Siew Rice
- Dry red chilli-oil coated stir-fry in box with no rice = Mala Xiang Guo
- Noodles in clear/milky broth with fishballs = Fishball Noodles / Mee Pok
- Bun Cha = Vietnamese dish with grilled pork patties + rice noodles + dipping broth — NOT a bowl of pork ribs in soup`,
            },
          ],
        },
      ],
    })

    const description = identifyResponse.content[0].text.trim()

    // Step 2: Semantic match against enriched dish database
    const matchResponse = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: `A food photo was analysed and produced this structured report:
"${description}"

Match this to the SINGLE best dish from the list below. Each entry is:
  id: Name | description | [tags]

${DISH_LIST}

Instructions:
- Match semantically — compare the CONTAINER, COLOURS, SAUCE, PROTEIN and SIDES against each dish's description and tags
- A DRINK report (TYPE: DRINK) must match kopi, teh, milo, teh-tarik, thai-milk-tea, or bandung — never a food dish
- A round white plate + flat chicken + brown sauce + fries = chicken-chop, not any rice/noodle dish
- Poached/steamed pale chicken on fragrant white rice = chicken-rice
- Dark soy braised chicken on rice = soy-sauce-chicken-rice
- Char siew (red-glazed pork) on rice = char-siew-rice
- Crumbed pork + fries = pork-chop; battered fish + fries = fish-and-chips
- Large bone-in pork ribs in a clear or pale broth in a deep ceramic bowl = bak-kut-teh (never bun-cha or any Vietnamese dish)
- Dry red chilli stir-fry in box (no rice, no broth) = mala-xiang-guo
- Do NOT match a plated western meal to any noodle, rice, or curry dish
- Do NOT match a soup bowl with large pork ribs to any Vietnamese dish
- Set confidence lower (40–60) when the report is ambiguous or the photo is unclear

Reply with ONLY valid JSON, no markdown:
{"dishId": "the-exact-id", "confidence": 88}`,
        },
      ],
    })

    const matchText = matchResponse.content[0].text.trim()
    const jsonMatch = matchText.match(/\{[^}]+\}/)
    if (!jsonMatch) throw new Error('No JSON in match response')

    const result = JSON.parse(jsonMatch[0])
    if (!DISHES[result.dishId]) throw new Error('Unknown dishId: ' + result.dishId)

    console.log('Detection report:\n', description)
    console.log('Match:', result.dishId, result.confidence + '%')

    return Response.json({
      dishId: result.dishId,
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
