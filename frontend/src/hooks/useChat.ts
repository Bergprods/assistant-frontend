import { useEffect, useState } from 'react'
import { postChat, BackendChatResponse, getHistory } from '../api/chat'

export function useChat() {
  const [messages, setMessages] = useState<Array<{ from: 'user' | 'assistant'; text: string }>>([])
  const [loading, setLoading] = useState(false)

  // Load history on mount
  useEffect(() => {
    let cancelled = false
    let retryTimer: any

    const applyHistory = (incoming: Array<{ from: 'user'|'assistant'; text: string }>) => {
      // only update if incoming has more items than current to avoid overwriting
      setMessages((current) => incoming.length > current.length ? incoming : current)
    }

    const fetchOnce = async () => {
      try {
        const history = await getHistory('default', 12)
        if (cancelled) return
        const msgs = history.map(h => ({ from: h.role as 'user'|'assistant', text: h.content }))
        applyHistory(msgs)
        // If empty on first try, do a single delayed retry to catch late data
        if (msgs.length === 0 && !cancelled) {
          retryTimer = setTimeout(fetchOnce, 600)
        }
      } catch (_err) {
        // ignore initial history load errors for UX simplicity
      }
    }

    fetchOnce()
    return () => { cancelled = true; if (retryTimer) clearTimeout(retryTimer) }
  }, [])

  async function send(text: string) {
    if (!text.trim()) return
    setMessages((m) => [...m, { from: 'user' as const, text }])
    setLoading(true)
    try {
      const res: BackendChatResponse = await postChat(text)
      // Byt ut hela chatten mot backend-minnet (så vi får historik)
      const newMessages = res.memory.map(entry => ({
        from: entry.role,
        text: entry.content
      }))
      setMessages(newMessages)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setMessages((m) => [...m, { from: 'assistant' as const, text: 'Error: ' + message }])
    } finally {
      setLoading(false)
    }
  }

  return { messages, loading, send }
}