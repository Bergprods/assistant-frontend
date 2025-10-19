import React from 'react'

export function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const bg = isUser ? 'bg-primary text-white' : 'bg-light'
  return (
    <div className={`my-2 d-flex ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
      <div className={`p-2 rounded ${bg}`} style={{ maxWidth: '75%' }}>
        <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
      </div>
    </div>
  )
}
