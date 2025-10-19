export interface OrchestratorIntent {
  domain: string
  requires?: string[]
}

export interface ChatResponse {
  intents: OrchestratorIntent[]
  directResponse: string
  metadata: {
    timestamp: string
    originalMessage: string
    [key: string]: unknown
  }
}

export interface MemoryEntry {
  t: number
  role: 'user' | 'assistant'
  content: string
  intents?: OrchestratorIntent[]
}

export interface BackendChatResponse {
  orchestrator: ChatResponse
  memory: MemoryEntry[]
}

export async function postChat(message: string): Promise<BackendChatResponse> {
  try {
    const res = await fetch('/api/orchestrator/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || 'Request failed')
    }
    const data = (await res.json()) as BackendChatResponse
    return data
  } catch (err) {
    throw err
  }
}

export async function getHistory(sessionId: string = 'default', limit: number = 12): Promise<MemoryEntry[]> {
  const qs = new URLSearchParams({ sessionId, limit: String(limit) })
  const res = await fetch(`/api/orchestrator/history?${qs.toString()}`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Failed to load history')
  }
  const data = (await res.json()) as MemoryEntry[]
  return data
}