import React from 'react'
import ChatWindow from '../ui/ChatWindow'

export default function ChatPage(){
  return (
    <div className="min-h-screen bg-indigo-900 text-white">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">BergProds AI Assistant</h1>
        <ChatWindow />
      </div>
    </div>
  )
}
