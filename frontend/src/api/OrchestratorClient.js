// Lightweight client for assistant-backend orchestrator endpoints using relative URLs
export class OrchestratorClient {
  async chat(sessionId, message, { waitFor = null, historyLimit = 12 } = {}) {
    const res = await fetch('/api/orchestrator/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ message, sessionId, waitFor, historyLimit })
    })
    const text = await res.text()
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0,200)}`)
    try { return JSON.parse(text) } catch { return { raw: text } }
  }

  async history(sessionId, limit = 12) {
    const params = new URLSearchParams()
    if (sessionId) params.set('sessionId', sessionId)
    if (limit) params.set('limit', String(limit))
    const res = await fetch('/api/orchestrator/history?' + params.toString(), { headers: { 'Accept': 'application/json' } })
    const text = await res.text()
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0,200)}`)
    try { return JSON.parse(text) } catch { return [] }
  }
}
