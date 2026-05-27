// Vercel serverless function: summarize open-ended survey responses with Claude.
// Requires the ANTHROPIC_API_KEY environment variable (set in Vercel project settings).

const MODEL = 'claude-haiku-4-5-20251001'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(503).json({ error: 'not_configured' })
  }

  const responses = Array.isArray(req.body?.responses) ? req.body.responses : []
  const clean = responses.map(t => String(t || '').trim()).filter(Boolean)
  if (clean.length === 0) {
    return res.status(200).json({ summary: '' })
  }

  const list = clean.map((t, i) => `${i + 1}. ${t}`).join('\n')
  const prompt =
    `Below are open-ended written responses from a student ministry brand survey ` +
    `(people reacting to a new visual brand). Summarize the collective feedback: the overall ` +
    `sentiment plus the most common themes — what people like, any concerns, and notable ` +
    `suggestions.\n\n` +
    `Respond with ONLY 2-3 plain sentences. No heading, no title, no markdown, no bullet ` +
    `points, no preamble like "Here is a summary". Be neutral and specific, and synthesize ` +
    `rather than restating individual responses.\n\nResponses:\n${list}`

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await r.json()
    if (!r.ok) {
      return res.status(502).json({ error: 'ai_failed' })
    }
    const summary = data?.content?.[0]?.text?.trim() || ''
    return res.status(200).json({ summary })
  } catch (e) {
    return res.status(500).json({ error: 'request_failed' })
  }
}
