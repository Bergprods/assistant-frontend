import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar/Sidebar'
import { useSubjectsAndChats, useResponsiveSidebar } from '../../hooks'

export default function AppLayout(){
  const { subjects, selectedSubjectId, selectedChatId, conversationId,
    createSubject, createChat, selectChat, deleteChat, renameSubject, renameChat } = useSubjectsAndChats()

  const { isMobile, sidebarOpen, toggleSidebar } = useResponsiveSidebar(900)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const toggleSettings = () => setSettingsOpen(o => !o)

  // Provided to child pages via Outlet context
  const ctx = {
    subjects, selectedSubjectId, selectedChatId, conversationId,
    createSubject, createChat, selectChat, deleteChat, renameSubject, renameChat,
    isMobile, sidebarOpen, toggleSidebar
  }

  return (
  <div className={`app-layout${isMobile ? ' mobile' : ''} h-screen flex`}> 
      <Sidebar
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        subjects={subjects}
        selectedSubjectId={selectedSubjectId}
        selectedChatId={selectedChatId}
        setSelectedSubjectId={()=>{}}
        selectChat={selectChat}
        renameSubject={renameSubject}
        renameChat={renameChat}
        deleteChat={deleteChat}
        createSubject={createSubject}
        createChat={createChat}
        settingsOpen={settingsOpen}
        toggleSettings={toggleSettings}
        hideNav={true}
      />
  <main className="main-content flex-1 flex flex-col min-h-screen relative">
        <Outlet context={ctx} />
      </main>
    </div>
  )
}
