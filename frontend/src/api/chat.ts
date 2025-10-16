export interface ChatResponse {
  ok: boolean
  directResponse?: string
  intents?: string[]
  error?: string
}

export async function postChat(message: string): Promise<ChatResponse> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    if (!res.ok) {
      const text = await res.text()
      return { ok: false, error: text }
    }
    const data = (await res.json()) as ChatResponse
    return data
  } catch (err) {
    return { ok: false, error: String(err) }
  }
}