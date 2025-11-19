import React, { useState, useEffect } from 'react'
import { useI18n } from '@i18n'
import { SidebarHeader } from '../../cards/sidebar/SidebarHeader'
import { ProjectCard } from '../../cards/sidebar/ProjectCard'
import { SettingsCard } from '../../cards/sidebar/SettingsCard'

export function Sidebar({
  isMobile, sidebarOpen, toggleSidebar,
  subjects, selectedSubjectId, selectedChatId,
  setSelectedSubjectId, selectChat,
  renameSubject, renameChat, deleteChat,
  createSubject, createChat,
  settingsOpen, toggleSettings,
  hideNav = false
}) {
  const { t } = useI18n()
  const st = (key, fallback) => {
    const v = t ? t(key) : ''
    if (!v) return fallback
    const s = String(v).trim()
    return (!s || s === key || s.toLowerCase() === key.toLowerCase()) ? fallback : s
  }
  const [expanded, setExpanded] = useState({})
  const sidebarClass = [
    'w-[240px] bg-[#081520] border-r border-[#132432] p-[12px_10px_8px_10px] flex flex-col sticky top-0 h-screen self-start',
    sidebarOpen ? '' : '',
    isMobile ? '' : ''
  ].filter(Boolean).join(' ')
  function ensureSubject() {
    if (selectedSubjectId) return selectedSubjectId
    const subj = createSubject(t('projects.default') || 'Project')
    return subj?.id
  }
  function handleNewChat() {
    const subjId = ensureSubject()
    if (!subjId) return
    createChat(subjId, t('prompt.chat.default') || 'Ny chat')
  }
  // Auto-expand the selected subject (if provided)
  useEffect(() => {
    if (selectedSubjectId) {
      setExpanded(prev => ({ ...prev, [selectedSubjectId]: true }))
    }
  }, [selectedSubjectId])
  return (
    <>
      {isMobile && sidebarOpen && <div className="sidebar-backdrop" onClick={toggleSidebar} />}
      <aside className={sidebarClass} aria-hidden={!sidebarOpen && isMobile}>
        <SidebarHeader
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          st={st}
          onNewChat={handleNewChat}
        />
        <div className="sidebar-section subjects flex-1 overflow-y-auto overflow-x-hidden min-h-0 flex flex-col">
          <div className="flex items-center justify-between sticky top-0 bg-[#0b1d27] z-4 p-2">
            <span className="font-semibold text-[0.9rem] uppercase tracking-wide text-[#8db5cf] mb-[6px] flex items-center">{st('nav.projects', 'Projekt')}</span>
            <button className="add-project-btn icon-button bg-transparent border-none p-1 w-[28px] h-[28px] inline-flex items-center justify-center rounded-lg cursor-pointer" aria-label={st('projects.new', 'Nytt projekt')} title={st('projects.new', 'Nytt projekt')} onClick={createSubject}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                <path d="M12 5v14M5 12h14" stroke="#cfe8ff" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {subjects.length === 0 && (
            <div className="text-[0.75rem] opacity-60 p-1 pb-2 pt-1">{t('projects.empty') || 'Inga projekt att visa'}</div>
          )}
          {subjects.map(subj => (
            <ProjectCard
              key={subj.id}
              subject={subj}
              isOpen={!!expanded[subj.id]}
              selectedSubjectId={selectedSubjectId}
              selectedChatId={selectedChatId}
              onToggle={(id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))}
              setSelectedSubjectId={setSelectedSubjectId}
              selectChat={selectChat}
              renameSubject={renameSubject}
              createChat={createChat}
              renameChat={renameChat}
              deleteChat={deleteChat}
            />
          ))}
        </div>
        <SettingsCard st={st} settingsOpen={settingsOpen} toggleSettings={toggleSettings} />
      </aside>
    </>
  )
}
