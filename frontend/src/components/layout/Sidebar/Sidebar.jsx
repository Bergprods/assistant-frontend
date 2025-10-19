import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useI18n } from '@i18n'

export function Sidebar({
  isMobile, sidebarOpen, toggleSidebar,
  subjects, selectedSubjectId, selectedChatId,
  setSelectedSubjectId, selectChat,
  renameSubject, renameChat, deleteChat,
  createSubject, createChat,
  settingsOpen, toggleSettings,
  openHealthModal,
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
  const sidebarClass = `sidebar${sidebarOpen ? ' open' : ''}${isMobile ? ' mobile' : ''}`
  const navItems = [
    { key: 'nav_chat', label: t('nav.chat') || 'Chat', to: '/chat' },
    { key: 'nav_health', label: t('nav.health') || 'Health', to: '/health' },
    { key: 'nav_settings', label: t('nav.settings') || 'Settings', to: '/settings' }
  ]
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
        {isMobile && sidebarOpen && (
          <button className="sidebar-close-btn" aria-label={t('nav.close_menu')||'Stäng meny'} onClick={toggleSidebar}>×</button>
        )}
        {/* Actions (moved here as per new design) */}
        <div className="sidebar-section actions" aria-label="Chat actions">
          <div className="nav-item" onClick={handleNewChat}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <path d="M4.5 6.5a4 4 0 0 1 4-4h7a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4h-4.6c-.37 0-.73.13-1.01.37l-2.6 2.2c-.82.69-2.05.1-2.05-.96V16.5a1 1 0 0 0-1-1 4 4 0 0 1-4-4v-5Z" stroke="#cfe8ff" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
            <span>{st('nav.new_chat', 'Ny chat')}</span>
          </div>
          <div className="nav-item" onClick={() => alert(st('feature.soon.search', 'Sökfunktionen kommer snart'))}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <circle cx="11" cy="11" r="6.5" stroke="#cfe8ff" strokeWidth="1.8" />
              <path d="M16.5 16.5L21 21" stroke="#cfe8ff" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span>{st('nav.search_chats', 'Sök i chattar')}</span>
          </div>
          <div className="nav-item" onClick={() => alert(st('feature.soon.library', 'Bibliotek kommer snart'))}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <rect x="3" y="3" width="4" height="18" rx="1" stroke="#cfe8ff" strokeWidth="1.4" />
              <rect x="10" y="3" width="4" height="18" rx="1" stroke="#cfe8ff" strokeWidth="1.4" />
              <rect x="17" y="3" width="4" height="18" rx="1" stroke="#cfe8ff" strokeWidth="1.4" />
            </svg>
            <span>{st('nav.library', 'Bibliotek')}</span>
          </div>
        </div>
        <div className="sidebar-section subjects">
          <div className="section-header d-flex justify-content-between align-items-center">
            <span>{st('nav.projects', 'Projekt')}</span>
            <button className="add-project-btn icon-button" aria-label={st('projects.new', 'Nytt projekt')} title={st('projects.new', 'Nytt projekt')} onClick={createSubject}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                <path d="M12 5v14M5 12h14" stroke="#cfe8ff" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {subjects.length === 0 && (
            <div className="empty-note">{t('projects.empty') || 'Inga projekt att visa'}</div>
          )}
          {subjects.map(subj => {
            const isOpen = !!expanded[subj.id]
            return (
              <div key={subj.id} className={`subject-block ${selectedSubjectId === subj.id ? 'active' : ''}`}>
                <div className="subject-header">
                  <span className="arrow">{isOpen ? '▾' : '▸'}</span>
                  <span
                    className="subject-title"
                    role="button"
                    aria-expanded={isOpen}
                    onClick={() => { setSelectedSubjectId?.(subj.id); setExpanded(prev => ({ ...prev, [subj.id]: !isOpen })) }}
                  >{subj.name}</span>
                  <div className="subject-actions">
                    <span title="Byt namn" onClick={() => renameSubject(subj.id)}>✎</span>
                    <span title="Ny chat" onClick={() => createChat(subj.id)}>＋</span>
                  </div>
                </div>
                {isOpen && (
                  <div className="chat-list">
                    {(subj.chats||[]).map(ch => (
                      <div key={ch.id} className={`chat-item ${selectedChatId === ch.id ? 'selected' : ''}`} onClick={() => selectChat(subj.id, ch.id)}>
                        <span className="chat-name" title={ch.name}>{ch.name}</span>
                        <span className="chat-actions">
                          <span title="Byt namn" onClick={(e) => { e.stopPropagation(); renameChat(subj.id, ch.id) }}>✎</span>
                          <span title="Ta bort" onClick={(e) => { e.stopPropagation(); deleteChat(subj.id, ch.id) }}>✕</span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className="sidebar-footer">
          <div className={`nav-item settings-toggle ${settingsOpen ? 'open': ''}`} onClick={toggleSettings} aria-expanded={settingsOpen}>{st('nav.settings', 'Inställningar')} {settingsOpen ? '▾' : '▸'}</div>
          {settingsOpen && (
            <div className="settings-menu" role="menu">
              <div className="settings-item" role="menuitem" onClick={openHealthModal}>{st('nav.health', 'Hälsa')}</div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
