import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
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
              'You are a creative startup idea generator. Generate startup ideas based on domain names. Return ONLY valid JSON array with no markdown formatting.',
          },
          {
            role: 'user',
            content: `Generate 10 unique startup ideas for the domain "${domain}". Each idea should have:
- name: catchy product name
- tagline: one-line description
- description: 2-3 sentence explanation
- category: (e.g., "AI Tools", "SaaS", "Developer Tools", "Social", "Finance", etc.)
- keywords: array of 3-5 relevant tags

Return as a JSON array of objects. ONLY return the JSON array, no other text or markdown formatting.`,
          },
        ],
        temperature: 0.8,
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
    const ideas = JSON.parse(content)

    return NextResponse.json({ ideas })
  } catch (error) {
    console.error('Error generating ideas:', error)
    return NextResponse.json(
      { error: 'Failed to generate ideas' },
      { status: 500 }
    )
  }
}
