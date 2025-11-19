// Integration test hitting the real conversator service inside docker compose
// Requires the test to run inside the frontend container (npm test) with the compose stack up.

async function postConversator(body) {
  const params = new URLSearchParams({ includeRaw: 'false' })
  const url = `http://conversator:8082/api/conversator/respond?${params.toString()}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(body)
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`)
  try { return JSON.parse(text) } catch { return { raw: text } }
}

describe('Conversator Redis cache integration', () => {
  it('returns cacheHit=false first, then cacheHit=true on identical request', async () => {
    const sessionId = 'test-' + Date.now() + '-' + Math.random().toString(36).slice(2,8)
    const message = 'Testar cache från frontend '
    const language = 'sv-SE'

    const first = await postConversator({ sessionId, message, language })
  expect(first).toBeTruthy()
  expect([false, null, undefined]).toContain(first.cacheHit)

    const second = await postConversator({ sessionId, message, language })
    expect(second).toBeTruthy()
    expect(second.cacheHit).toBe(true)
    // Response payloads should be the same logically
    expect(JSON.stringify(second.payload)).toBe(JSON.stringify(first.payload))
  }, 30000)
})
