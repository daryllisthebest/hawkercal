import Anthropic from '@anthropic-ai/sdk'
import { DISHES } from '@/lib/mockData'

const DISH_LIST = Object.values(DISHES)
  .map(d => `${d.id}: ${d.name}${d.nameLocal ? ` (${d.nameLocal})` : ''}`)
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

  const prompt = `You are a Southeast Asian hawker food expert. Identify what is shown in this photo.

FIRST: determine if this is a DRINK or a FOOD item.

Match it to exactly one dish ID from this list:
${DISH_LIST}

Reply with ONLY valid JSON — no markdown, no explanation:
{"dishId": "the-exact-id", "confidence": 88}

Rules:
- dishId must be one of the IDs listed above (left of the colon)
- confidence is 0–100 (your certainty level)
- If unclear, pick the closest match and set confidence below 65

DRINKS — identify these first before considering food:
- KOPI (use "kopi"): warm brown milky coffee in a white styrofoam cup or ceramic mug at a kopitiam. The liquid is opaque, warm brown/caramel colour. This is the MOST COMMON kopitiam drink.
- TEH (use "teh"): similar to kopi but slightly more golden/amber, also in styrofoam or ceramic cup. Milk tea.
- TEH TARIK (use "teh-tarik"): frothy pulled milk tea, often with a foamy top, usually in a tall glass or cup.
- MILO DINOSAUR (use "milo-dinosaur"): dark brown iced drink with dry chocolate powder heaped on top.
- BUBBLE TEA (use "bubble-tea"): clear plastic sealed cup with tapioca pearls visible at the bottom.
- BANDUNG (use "bandung"): bright pink/rose-coloured cold drink.
- SUGARCANE JUICE (use "sugarcane-juice"): pale yellow-green juice in a plastic cup.
- THAI ICED TEA (use "thai-milk-tea"): bright orange iced drink with milk layer.

KEY RULE: A white styrofoam cup with warm brown/caramel opaque liquid = KOPI or TEH. Never YOU TIAO. Never any food item.

FOOD visual guide:
- NASI LEMAK: white coconut rice + bright red sambal + ikan bilis + egg; often in styrofoam box.
- RENDANG: dark brown dry meat coated in thick spice paste. Almost no liquid.
- CARROT CAKE: dark or white cubes of radish cake stir-fried with egg on a flat plate.
- CHICKEN RICE: chicken slices on white rice with clear broth and chilli on the side.
- BAK CHOR MEE: dry noodles with minced pork, mushrooms and vinegar-chilli sauce.
- LAKSA: creamy orange coconut soup with thick noodles, tofu puffs and prawns.
- YOU TIAO: long golden-brown deep-fried dough sticks. A solid fried food item, NOT any liquid.
- CHWEE KUEH: small white steamed rice cups topped with preserved radish.
- WANTON MEE: thin yellow noodles dry-tossed with char siew slices.`

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 120,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: imageBase64 },
            },
            { type: 'text', text: prompt },
          ],
        },
      ],
    })

    const text = response.content[0].text.trim()
    const jsonMatch = text.match(/\{[^}]+\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    const result = JSON.parse(jsonMatch[0])
    if (!DISHES[result.dishId]) throw new Error('Unknown dishId: ' + result.dishId)

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
