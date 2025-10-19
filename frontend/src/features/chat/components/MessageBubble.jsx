import React from 'react'

export function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const bg = isUser ? 'bg-primary text-white' : 'bg-light'
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
    <div className={`my-2 d-flex ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
      <div style={{ maxWidth: '75%' }}>
        <div className={`p-2 rounded ${bg}`}>
          <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
        </div>
        {ts && (
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4, textAlign: isUser ? 'right' : 'left' }}>
            Skrev: {ts}
          </div>
        )}
      </div>
    </div>
  )
}
