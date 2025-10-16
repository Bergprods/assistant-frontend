import { useState } from 'react'
import { postChat, ChatResponse } from '../api/chat'

export function useChat() {
  const [messages, setMessages] = useState<Array<{ from: 'user' | 'assistant'; text: string }>>( [])
  const [loading, setLoading] = useState(false)

  async function send(text: string) {
    if (!text.trim()) return
    setMessages((m) => [...m, { from: 'user', text }])
    setLoading(true)
    const res: ChatResponse = await postChat(text)
    setLoading(false)
    if (res.ok) {
      setMessages((m) => [...m, { from: 'assistant', text: res.directResponse || '' }])
      if (res.intents && res.intents.length > 0) {
        setMessages((m) => [...m, { from: 'assistant', text: 'Detected intents: ' + res.intents.join(', ') }])
      }
    } else {
      setMessages((m) => [...m, { from: 'assistant', text: 'Error: ' + (res.error || 'Unknown') }])
    }
  }

  return { messages, loading, send }
}