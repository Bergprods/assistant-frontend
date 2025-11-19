import React from 'react'
import { NavLink } from 'react-router-dom'

export function SettingsCard({ st, settingsOpen, toggleSettings }) {
  return (
    <div className="mt-auto pt-2 border-t border-[#132432] sticky bottom-0 bg-[#081520]">
      <div className={`font-semibold flex justify-between items-center cursor-pointer ${settingsOpen ? '' : ''}`} onClick={toggleSettings} aria-expanded={settingsOpen}>
        {st('nav.settings', 'Inställningar')} {settingsOpen ? '▾' : '▸'}
      </div>
      {settingsOpen && (
        <div className="flex flex-col gap-1 p-2 relative animate-[slideUp_0.22s_ease]" role="menu">
          <NavLink className="p-2 rounded cursor-pointer text-[0.85rem] bg-[#0c2632] text-[#cfe8ff] hover:bg-[#123846]" role="menuitem" to="/health" onClick={toggleSettings}>
            {st('nav.health', 'Hälsa')}
          </NavLink>
          <NavLink className="p-2 rounded cursor-pointer text-[0.85rem] bg-[#0c2632] text-[#cfe8ff] hover:bg-[#123846]" role="menuitem" to="/create-agent" onClick={toggleSettings}>
            {st('nav.create_agent', 'Create Agent')}
          </NavLink>
        </div>
      )}
    </div>
  );
}

