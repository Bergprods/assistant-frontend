// Integration test for simple session memory: remember a word and recall it.
// Runs inside frontend container against conversator service in compose.

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

describe('Conversator session memory (remember/recall)', () => {
  it('remembers a word and recalls it on follow-up', async () => {
    const sessionId = 'mem-' + Date.now() + '-' + Math.random().toString(36).slice(2,8)
    const language = 'sv-SE'

    // Ask to remember a word
    const r1 = await postConversator({ sessionId, language, message: 'Kan du komma ihåg ordet "banan" åt mig?' })
    expect(r1).toBeTruthy()
    expect((r1.generated_response || '').toLowerCase()).toContain('banan')

    // Ask what word you were asked to remember
    const r2 = await postConversator({ sessionId, language, message: 'Vilket ord bad jag dig komma ihåg?' })
    expect(r2).toBeTruthy()
    expect((r2.generated_response || '').toLowerCase()).toContain('banan')
  }, 40000)
})
