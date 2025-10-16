import React from 'react'

export default function ChatBubble({from, text}: {from: 'user'|'assistant', text: string}){
  const isUser = from === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] px-4 py-2 rounded-lg ${isUser ? 'bg-indigo-500 text-white' : 'bg-white text-black'}`}>
        {text}
      </div>
    </div>
  )
}
