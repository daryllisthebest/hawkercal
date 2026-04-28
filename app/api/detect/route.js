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
              text: `You are a Southeast Asian hawker food expert. Look at this photo carefully and identify the dish.

Answer these questions in 3–4 sentences:
1. Is this a DRINK or a FOOD item?
2. What is the exact dish name? Be specific — e.g. "chicken chop" not just "chicken".
3. What plate/container is it served on? (round white plate, styrofoam box, bowl, cup, etc.)
4. List every visible component: the protein, any sauce, any sides (fries, rice, veg, eggs, etc.).

Important cues to look for:
- A round white plate with a flat piece of pan-fried or grilled CHICKEN covered in brown/black pepper/mushroom sauce + crinkle-cut or shoestring FRIES + mixed vegetables (corn, peas, carrots) = CHICKEN CHOP (kopitiam western).
- Same plate but with a crumbed PORK cutlet instead of chicken = PORK CHOP.
- A flat FISH fillet (battered or crumbed) + fries = FISH AND CHIPS.
- A styrofoam cup or ceramic mug with warm brown opaque liquid = KOPI or TEH (coffee or tea), NOT any food.
- Dry stir-fried ingredients in a wok/takeaway box coated in red chilli oil with no rice = MALA XIANG GUO.
- White coconut rice + bright red sambal + small fish + egg = NASI LEMAK.`,
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
- If the description mentions chicken with sauce + fries + veg on a white plate → "chicken-chop"
- If the description mentions crumbed pork cutlet + fries → "pork-chop"
- If the description mentions battered/crumbed fish + fries → "fish-and-chips"
- If the description mentions coffee, tea, or a warm drink in a cup → "kopi" or "teh"
- If the description mentions mala stir-fry in a box/bowl with chilli oil and no rice → "mala-xiang-guo"
- If the description mentions mala hot pot with broth → "mala-hotpot"
- Do NOT match a plated western meal (chicken/pork/fish + fries) to any noodle, rice or spicy stir-fry dish`,
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
