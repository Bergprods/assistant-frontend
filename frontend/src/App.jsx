import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
import { ChatPage } from './pages/ChatPage'
import { NotFound } from './pages/NotFound'
import { HealthPage } from './pages/HealthPage'
import { SettingsPage } from './pages/SettingsPage'

// App: central router only. Add new routes here as you create more pages.
function GlobalLoader(){
  return (
    <div className="global-loader" role="status" aria-label="Loading application">
      <div className="loader-orbit">
        <div className="ring ring-a" />
        <div className="ring ring-b" />
        <div className="ring ring-c" />
        <div className="pulse" />
        <div className="pulse delayed" />
      </div>
      <div className="loader-text">Laddar...</div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}









