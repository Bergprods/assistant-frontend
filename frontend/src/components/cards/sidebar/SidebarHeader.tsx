import React from 'react'
import { NavLink } from 'react-router-dom'

export function SidebarHeader({ isMobile, sidebarOpen, toggleSidebar, st, onNewChat }) {
  return (
    <>
      {isMobile && sidebarOpen && (
        <button
          aria-label={st('nav.close_menu','Stäng meny')}
          onClick={toggleSidebar}
          className="absolute top-2 right-2 bg-[#0b2533] border border-[#1c3747] text-[#cfe8ff] w-9 h-9 rounded-lg text-[22px] leading-none flex justify-center items-center cursor-pointer hover:bg-[#123646]"
        >
          ×
        </button>
      )}
      <div className="sidebar-section actions mb-[18px]">
        <div className="nav-item p-[6px_10px] rounded cursor-pointer text-[0.92rem] text-[#d0e6f5] flex items-center gap-2 hover:bg-[#112738]" onClick={onNewChat}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path d="M4.5 6.5a4 4 0 0 1 4-4h7a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4h-4.6c-.37 0-.73.13-1.01.37l-2.6 2.2c-.82.69-2.05.1-2.05-.96V16.5a1 1 0 0 0-1-1 4 4 0 0 1-4-4v-5Z" stroke="#cfe8ff" strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
          <span>{st('nav.new_chat', 'Ny chat')}</span>
        </div>
  <div className="nav-item p-[6px_10px] rounded cursor-pointer text-[0.92rem] text-[#d0e6f5] flex items-center gap-2 hover:bg-[#112738]" onClick={() => alert(st('feature.soon.search', 'Sökfunktionen kommer snart'))}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <circle cx="11" cy="11" r="6.5" stroke="#cfe8ff" strokeWidth="1.8" />
            <path d="M16.5 16.5L21 21" stroke="#cfe8ff" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span>{st('nav.search_chats', 'Sök i chattar')}</span>
        </div>
  <div className="nav-item p-[6px_10px] rounded cursor-pointer text-[0.92rem] text-[#d0e6f5] flex items-center gap-2 hover:bg-[#112738]" onClick={() => alert(st('feature.soon.library', 'Bibliotek kommer snart'))}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <rect x="3" y="3" width="4" height="18" rx="1" stroke="#cfe8ff" strokeWidth="1.4" />
            <rect x="10" y="3" width="4" height="18" rx="1" stroke="#cfe8ff" strokeWidth="1.4" />
            <rect x="17" y="3" width="4" height="18" rx="1" stroke="#cfe8ff" strokeWidth="1.4" />
          </svg>
          <span>{st('nav.library', 'Bibliotek')}</span>
        </div>
  <NavLink className="nav-item p-[6px_10px] rounded cursor-pointer text-[0.92rem] text-[#d0e6f5] flex items-center gap-2 hover:bg-[#112738]" to="/create-agent">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path d="M12 2a5 5 0 0 1 5 5v2h1a2 2 0 1 1 0 4h-1v1a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5v-1H5a2 2 0 1 1 0-4h1V7a5 5 0 0 1 5-5h1Z" stroke="#cfe8ff" strokeWidth="1.4" />
            <path d="M12 8v5M9.5 10.5H14.5" stroke="#cfe8ff" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <span>{st('nav.create_agent', 'Create Agent')}</span>
        </NavLink>
      </div>
    </>
  )
}
