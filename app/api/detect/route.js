import Anthropic from '@anthropic-ai/sdk'

if (typeof process !== 'undefined') {
  console.log('[detect/route] API key present at startup:', !!process.env.ANTHROPIC_API_KEY)
}

const SYSTEM_PROMPT = `You are a calorie estimator specialising in Singapore and Malaysia hawker food.

When shown a food photo, do NOT try to name the dish. Instead:

1. Describe each visible food component in plain English
2. Estimate the weight of each component
3. Calculate calories for each component
4. Return the total

You must return this exact JSON:

{
  "what_i_see": "Plain English description of everything visible on the plate in one sentence. E.g. 'A large breaded fried chicken cutlet with french fries, a slice of buttered toast, baked beans and tomato sauce on a white speckled plate.'",

  "components": [
    {
      "name": "string — what you see, not a dish name. E.g. 'Breaded fried chicken cutlet' not 'Chicken Chop'",
      "emoji": "string",
      "weight_g": number,
      "calories": number,
      "protein_g": number,
      "carbs_g": number,
      "fat_g": number,
      "portion_note": "string — e.g. 'Large piece, roughly 300g'"
    }
  ],

  "calories_total": number,
  "calories_min": number,
  "calories_max": number,
  "protein_g": number,
  "carbs_g": number,
  "fat_g": number,

  "confidence": number,

  "honest_note": "string — one sentence about what might affect accuracy. E.g. 'Oil absorption in frying adds 50-150 kcal uncertainty.' or 'Portion size is estimated — adjust if your serving looks larger or smaller than average.'"
}

Important rules:
- Never return a dish name as the primary result
- Always describe what you physically see
- If food is partially eaten, estimate what REMAINS visible
- For mixed plates, treat each component separately
- When unsure about weight, give a range in calories_min and calories_max
- Singapore and Malaysia portions tend to be larger than Western reference sizes`

export async function POST(request) {
  console.log('[detect POST] Checking API key...', !!process.env.ANTHROPIC_API_KEY)
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[detect POST] ANTHROPIC_API_KEY is missing!')
    return Response.json({ error: 'No API key' }, { status: 503 })
  }
  console.log('[detect POST] API key present, proceeding...')

  try {
    const formData = await request.formData()
    const imageFile = formData.get('image')

    if (!imageFile) {
      return Response.json({ error: 'No image provided' }, { status: 400 })
    }

    const buffer = await imageFile.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const mediaType = imageFile.type || 'image/jpeg'

    const client = new Anthropic()
    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64 },
            },
            {
              type: 'text',
              text: 'Analyze this food photo. Break it down into components, estimate weights and calories for each, and provide a calorie total.',
            },
          ],
        },
      ],
    })

    const text = response.content[0].text.trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    const estimate = JSON.parse(jsonMatch[0])

    return Response.json({
      success: true,
      estimate,
      _meta: {
        model: 'claude-opus-4-8',
        tokens_used: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0),
      },
    })
  } catch (error) {
    console.error('[detect POST] Error:', error.message)
    return Response.json(
      { error: error.message || 'Estimation failed' },
      { status: 500 }
    )
  }
}
