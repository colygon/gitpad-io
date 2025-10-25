import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    const claudeKey = process.env.CLAUDE_API_KEY
    const openaiKey = process.env.OPENAI_API_KEY

    if (!claudeKey && !openaiKey) {
      return NextResponse.json(
        { error: 'No AI API key configured' },
        { status: 500 }
      )
    }

    // Prefer Claude if available
    if (claudeKey) {
      const anthropic = new Anthropic({ apiKey: claudeKey })
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `Generate 10 unique startup ideas for the domain "${domain}". Each idea should have:\n- name\n- tagline\n- description (2-3 sentences)\n- category\n- keywords (3-5)\nReturn only a JSON array (no markdown). Start with [ and end with ].`,
          },
        ],
      })

      const content = message.content[0]?.type === 'text' ? message.content[0].text : ''
      if (!content) throw new Error('Empty response from Claude')
      const clean = content.replace(/```json\n?|```\n?/g, '').trim()
      const ideas = JSON.parse(clean)
      return NextResponse.json({ ideas })
    }

    // Fallback to OpenAI if Claude not configured
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
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
            content: `Generate 10 unique startup ideas for the domain "${domain}". Each idea should have:\n- name\n- tagline\n- description (2-3 sentences)\n- category\n- keywords (3-5)\nReturn only a JSON array (no markdown).`,
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
