import React from 'react'

export function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  // User: blue bubble, right aligned, margin-right. Assistant: dark bubble, left aligned, margin-left.
  const bubbleClass = isUser
    ? 'bg-[#0b5cff] text-white rounded-xl px-4 py-2 shadow-md'
    : 'bg-[#192c3a] text-[#e6eef8] rounded-xl px-4 py-2 shadow-md'
  let dt = null
  if (message.t) {
    if (typeof message.t === 'number') {
      // seconds vs ms
      const ms = message.t < 1e12 ? message.t * 1000 : message.t
      dt = new Date(ms)
    } else {
      dt = new Date(message.t)
    }
  }
  const ts = dt ? `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}, ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}` : null
  return (
    <div className="mt-4 flex w-full px-[42px]">
      <div className={`max-w-[600px] w-fit ${isUser ? 'ml-auto' : ''}`}>
        <div className={bubbleClass} style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
        {ts && (
          <div className={`text-xs opacity-70 mt-2 ${isUser ? 'text-right' : 'text-left'}`}>Skrev: {ts}</div>
        )}
      </div>
    </div>
  )
}
