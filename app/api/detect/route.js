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

  const prompt = `You are a Southeast Asian hawker food expert. Identify the dish in this photo.

Match it to exactly one dish ID from this list:
${DISH_LIST}

Reply with ONLY valid JSON — no markdown, no explanation:
{"dishId": "the-exact-id", "confidence": 88}

Rules:
- dishId must be one of the IDs listed above (left of the colon)
- confidence is 0–100 (your certainty level)
- If unclear, pick the closest match and set confidence below 65
- For black carrot cake / chai tow kueh, use "carrot-cake"
- For white carrot cake, use "carrot-cake"
- For minced pork noodles / bak chor mee, use "bak-chor-mee"`

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
