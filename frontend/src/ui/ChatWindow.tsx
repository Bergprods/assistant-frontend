import React, { useState } from 'react'
import ChatBubble from './ChatBubble'

import { useChat } from '../hooks/useChat'

export default function ChatWindow(){
  const { messages, loading, send } = useChat()
  const [input, setInput] = useState('')
  
  const handleSend = async () => {
    if (!input.trim()) return
    const text = input.trim()
    setInput('')
    await send(text)
  }

  return (
    <div className="bg-indigo-800 rounded-lg shadow p-4 h-[70vh] flex flex-col">
      <div className="flex-1 overflow-auto mb-4 space-y-3">
        {messages.map((msg, i) => (
          <ChatBubble key={i} from={msg.from} text={msg.text} />
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <input
          className="flex-1 rounded px-3 py-2 text-black"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button
          className="bg-indigo-500 hover:bg-indigo-600 rounded px-4 py-2"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? '...' : 'Skicka'}
        </button>
      </div>
    </div>
  )
}
