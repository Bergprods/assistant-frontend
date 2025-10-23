// Conversator client: calls the conversator service via vite proxy (/conversator -> conversator:8082/api/conversator)
export class OrchestratorClient {
  async chat(sessionId, message, { language = 'sv-SE' } = {}) {
    const url = '/conversator/respond?includeRaw=false'
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ sessionId, message, language })
    })
    const text = await res.text()
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0,200)}`)
    let data
    try { data = JSON.parse(text) } catch { data = { raw: text } }
    // Normalize to a shape the chat hook already expects
    return {
      orchestrator: { direct_response: data?.generated_response ?? null },
      payload: data?.payload ?? null,
      raw: data,
      errors: data?.errors || []
    }
  }

  // Optional: keep history as a no-op or future wiring if needed
  async history(sessionId, limit = 12) {
    return []
  }
}
