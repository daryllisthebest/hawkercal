import Anthropic from '@anthropic-ai/sdk'

if (typeof process !== 'undefined') {
  console.log('[detect/route] API key present at startup:', !!process.env.ANTHROPIC_API_KEY)
}

const SYSTEM_PROMPT = `You are a calorie estimator specialising in Singapore and Malaysia hawker food.

CRITICAL: Return ONLY the JSON object. No markdown code blocks. No backticks. No explanation. Just the raw JSON object.

{
  "what_i_see": "Describe everything on the plate in one sentence. E.g. 'A large breaded fried chicken cutlet with french fries, buttered toast, baked beans and tomato sauce'",
  "components": [
    {
      "name": "What you see visually (not a dish name). E.g. 'Breaded fried chicken cutlet'",
      "emoji": "🍗",
      "weight_g": 280,
      "calories": 420,
      "protein_g": 38,
      "carbs_g": 12,
      "fat_g": 20,
      "portion_note": "Large piece, roughly 280g"
    }
  ],
  "calories_total": 855,
  "calories_min": 950,
  "calories_max": 1050,
  "protein_g": 38,
  "carbs_g": 74,
  "fat_g": 42,
  "confidence": 85,
  "honest_note": "Oil absorption in frying may add 50-150 kcal depending on cooking method"
}

Do NOT add markdown backticks. Do NOT explain. Return only the JSON object above.

Rules:
- Never include dish names as the primary result
- If food is partially eaten, estimate what remains visible
- For mixed plates, treat each component separately
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

    console.log('[detect POST] Received image:', imageFile ? `${imageFile.name} (${imageFile.size} bytes)` : 'null')

    if (!imageFile) {
      console.error('[detect POST] No image file in request')
      return Response.json({ error: 'No image provided' }, { status: 400 })
    }

    const buffer = await imageFile.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const mediaType = imageFile.type || 'image/jpeg'

    console.log('[detect POST] Image converted to base64:', base64.length, 'chars, type:', mediaType)

    const client = new Anthropic()
    console.log('[detect POST] Calling Claude API...')
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

    console.log('[detect POST] Claude responded:', response.content[0]?.type)
    const text = response.content[0].text.trim()
    console.log('[detect POST] Response text length:', text.length)

    // Try to extract JSON from markdown code blocks first
    let jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
    let jsonText = jsonMatch ? jsonMatch[1] : null

    // Fall back to simple regex if no markdown code blocks
    if (!jsonText) {
      jsonMatch = text.match(/\{[\s\S]*\}/)
      jsonText = jsonMatch ? jsonMatch[0] : null
    }

    if (!jsonText) {
      console.error('[detect POST] No JSON found in response.')
      console.error('[detect POST] First 500 chars:', text.substring(0, 500))
      throw new Error('Claude did not return valid JSON. Response: ' + text.substring(0, 100))
    }

    console.log('[detect POST] Found JSON, parsing...')
    const estimate = JSON.parse(jsonText)
    console.log('[detect POST] Parsed estimate:', {
      what_i_see: estimate.what_i_see?.substring(0, 50) + '...',
      components_count: estimate.components?.length,
      calories_total: estimate.calories_total,
    })

    return Response.json({
      success: true,
      estimate,
      _meta: {
        model: 'claude-opus-4-8',
        tokens_used: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0),
      },
    })
  } catch (error) {
    console.error('[detect POST] Error:', error.message, error.stack?.substring(0, 200))
    return Response.json(
      { error: error.message || 'Estimation failed' },
      { status: 500 }
    )
  }
}
