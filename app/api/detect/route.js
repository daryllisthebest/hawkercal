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

  try {
    // Step 1: Let Claude freely identify what it sees — no list, no constraints
    const identifyResponse = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 300,
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
              text: `You are a Southeast Asian food and drink expert. Look at this photo carefully.

Describe exactly what you see in 2-3 sentences:
1. Is this a DRINK or a FOOD item?
2. What is the dish or drink called? Use the local name if you know it.
3. What are the key visual clues — container type, colour, ingredients, how it is presented?

Be specific and honest. If it is a cup of coffee or tea, say so clearly.`,
            },
          ],
        },
      ],
    })

    const description = identifyResponse.content[0].text.trim()

    // Step 2: Match the free-text description to the closest dish in the database
    const matchResponse = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: `A food photo was described as:
"${description}"

Match this to exactly one dish ID from this list:
${DISH_LIST}

Reply with ONLY valid JSON, no markdown:
{"dishId": "the-exact-id", "confidence": 88}

Rules:
- dishId must be one of the IDs above (the part before the colon)
- confidence is 0–100
- If the description mentions coffee or tea in a cup, use "kopi" or "teh"
- If the description mentions a drink, use the closest drink ID`,
        },
      ],
    })

    const matchText = matchResponse.content[0].text.trim()
    const jsonMatch = matchText.match(/\{[^}]+\}/)
    if (!jsonMatch) throw new Error('No JSON in match response')

    const result = JSON.parse(jsonMatch[0])
    if (!DISHES[result.dishId]) throw new Error('Unknown dishId: ' + result.dishId)

    console.log('Detection:', description, '→', result.dishId, result.confidence + '%')

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
