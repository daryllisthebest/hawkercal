import { estimateFood } from '@/lib/estimateFood'

export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: 'No API key' },
      { status: 503 }
    )
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

  try {
    const { estimate, tokensUsed } = await estimateFood(imageBase64, mediaType)
    return Response.json({
      ...estimate,
      _meta: {
        model: 'claude-opus-4-7',
        tokens_used: tokensUsed,
      },
    })
  } catch (err) {
    return Response.json(
      { error: err.message, stack: err.stack },
      { status: 500 }
    )
  }
}
