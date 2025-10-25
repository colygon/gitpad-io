import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    const { idea } = await request.json()

    if (!idea) {
      return NextResponse.json({ error: 'Idea is required' }, { status: 400 })
    }

    const claudeKey = process.env.CLAUDE_API_KEY
    const openaiKey = process.env.OPENAI_API_KEY

    if (!claudeKey && !openaiKey) {
      return NextResponse.json(
        { error: 'No AI API key configured' },
        { status: 500 }
      )
    }

    if (claudeKey) {
      const anthropic = new Anthropic({ apiKey: claudeKey })
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `Generate 15-20 brandable domain names for this startup idea: "${idea}". \nReturn JSON array of objects with: domain, extension, score (1-10). Prefer .com, .io, .ai, .xyz. Only return JSON array.`,
          },
        ],
      })

      const content = message.content[0]?.type === 'text' ? message.content[0].text : ''
      if (!content) throw new Error('Empty response from Claude')
      const clean = content.replace(/```json\n?|```\n?/g, '').trim()
      const domains = JSON.parse(clean)
      return NextResponse.json({ domains })
    }

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
              'You are a creative domain name generator. Generate catchy, brandable domain names. Return ONLY valid JSON array with no markdown formatting.',
          },
          {
            role: 'user',
            content: `Generate 15-20 potential domain names for this startup idea: "${idea}". \nRequirements: short, brandable, .com/.io/.ai/.xyz, include score. Return only JSON array.`,
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
