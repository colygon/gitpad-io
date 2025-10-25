import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { idea } = await request.json()

    if (!idea) {
      return NextResponse.json({ error: 'Idea is required' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a creative domain name generator. Generate catchy, brandable domain names. Return ONLY valid JSON array with no markdown formatting.',
          },
          {
            role: 'user',
            content: `Generate 15-20 potential domain names for this startup idea: "${idea}". 

Requirements:
- Short, brandable, memorable names
- Mix of .com, .io, .ai, .xyz extensions
- Include variations (compound words, portmanteaus, single words)
- Each should have: domain (full domain with extension), extension (.com, .io, etc), score (1-10 for catchiness/relevance)

Return as a JSON array of objects. ONLY return the JSON array, no other text or markdown formatting.`,
          },
        ],
        temperature: 0.9,
      }),
    })

    if (!response.ok) {
      throw new Error('OpenAI API request failed')
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content in response')
    }

    // Parse the JSON response
    const domains = JSON.parse(content)

    return NextResponse.json({ domains })
  } catch (error) {
    console.error('Error generating domains:', error)
    return NextResponse.json(
      { error: 'Failed to generate domains' },
      { status: 500 }
    )
  }
}
