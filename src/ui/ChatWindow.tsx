import React, { useState } from 'react'
import ChatBubble from './ChatBubble'

async function postChat(message: string) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })
    if (!res.ok) throw new Error(await res.text())
    return await res.json()
  } catch (err) {
    return { ok: false, error: String(err) }
  }
}

export default function ChatWindow(){
  const [messages, setMessages] = useState<Array<{from: 'user'|'assistant', text: string}>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function send(){
    if(!input.trim()) return
    const text = input.trim()
    setMessages(m => [...m, {from: 'user', text}])
    setInput('')
    setLoading(true)
    const apiRes = await postChat(text)
    setLoading(false)
    if (apiRes && apiRes.ok) {
      const direct = apiRes.directResponse || 'Jag har tagit emot din förfrågan.'
      setMessages(m => [...m, {from: 'assistant', text: direct}])
      // Optionally show detected intents as small assistant notes
      if (apiRes.intents && apiRes.intents.length > 0) {
        setMessages(m => [...m, {from: 'assistant', text: 'Detected intents: ' + apiRes.intents.join(', ')}])
      }
    } else if (apiRes && apiRes.ok === false) {
      setMessages(m => [...m, {from: 'assistant', text: 'Fel: ' + (apiRes.error || 'okänt fel')}])
    } else {
      setMessages(m => [...m, {from: 'assistant', text: 'Inget svar från servern'}])
    }
  }

  return (
    <div className="bg-indigo-800 rounded-lg shadow p-4 h-[70vh] flex flex-col">
      <div className="flex-1 overflow-auto mb-4 space-y-3">
        {messages.map((msg, i) => (
          <ChatBubble key={i} from={msg.from} text={msg.text} />
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <input className="flex-1 rounded px-3 py-2 text-black" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e=>{ if(e.key === 'Enter') send() }} />
        <button className="bg-indigo-500 hover:bg-indigo-600 rounded px-4 py-2" onClick={send} disabled={loading}>{loading ? '...' : 'Skicka'}</button>
      </div>
    </div>
  )
}
