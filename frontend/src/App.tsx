import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
import { ChatPage } from './pages/ChatPage'
import { NotFound } from './pages/NotFound'
import { HealthPage } from './pages/HealthPage'
import { SettingsPage } from './pages/SettingsPage'
import { CreateAgentPage } from './pages/CreateAgentPage'
import AppLayout from './components/layout/AppLayout'

// App: central router only. Add new routes here as you create more pages.
function GlobalLoader(){
  return (
    <div
      role="status"
      aria-label="Loading application"
      className="fixed inset-0 flex flex-col justify-center items-center bg-[#060f17] z-[9999]"
    >
      <div className="relative w-[180px] h-[180px] flex justify-center items-center">
        <div className="absolute rounded-full border-4 border-transparent w-full h-full box-border" style={{ maskImage: 'radial-gradient(circle at center, black 52%, transparent 53%)', borderTopColor: '#0b5cff', borderRightColor: '#0b5cff', animation: 'spinCW 3.5s linear infinite' }} />
        <div className="absolute rounded-full border-4 border-transparent w-[72%] h-[72%] box-border" style={{ maskImage: 'radial-gradient(circle at center, black 52%, transparent 53%)', borderBottomColor: '#36b5ff', borderLeftColor: '#36b5ff', animation: 'spinCCW 2.4s linear infinite' }} />
        <div className="absolute rounded-full border-4 border-transparent w-[44%] h-[44%] box-border" style={{ maskImage: 'radial-gradient(circle at center, black 52%, transparent 53%)', borderTopColor: '#5fd4ff', borderLeftColor: '#5fd4ff', animation: 'spinCW 1.8s linear infinite' }} />
        <div className="absolute w-[10px] h-[10px] bg-[#0b5cff] rounded-full shadow-[0_0_10px_3px_rgba(11,92,255,0.55)] animate-[pulseOut_3s_ease-out_infinite]" />
        <div className="absolute w-[10px] h-[10px] bg-[#36b5ff] rounded-full shadow-[0_0_12px_3px_rgba(54,181,255,0.5)] animate-[pulseOut_3s_ease-out_infinite]" style={{ animationDelay: '1.5s' }} />
      </div>
      <div className="mt-6 text-[0.9rem] tracking-wide text-[#d4e9f7] opacity-85">Laddar...</div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route element={<AppLayout />}>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/create-agent" element={<CreateAgentPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}









