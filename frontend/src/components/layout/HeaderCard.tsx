import React, { useState, useEffect, useRef } from 'react'
import { Card, Form } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'

const MODEL_KEY = 'assistant_selected_model'
const DEFAULT_MODELS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'o3-mini', label: 'O3 Mini (Reasoning)' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
]

export function HeaderCard({
  models = DEFAULT_MODELS,
  onModelChange,
  engine = 'orchestrator',
  onEngineChange,
  onNewChat,
  t = (k)=>k,
  isMobile = false,
  sidebarOpen = false,
  toggleSidebar
}) {
  const [model, setModel] = useState(() => localStorage.getItem(MODEL_KEY) || models[0].value)
  const modelRef = useRef(null)
  const [modelWidth, setModelWidth] = useState(null)
  const loc = useLocation()
  const navigate = useNavigate()
  const current = loc.pathname || '/chat'

  // Only keep Inställningar
  const navItems = [
    { to: '/settings', key: 'nav.settings', label: t('nav.settings') || 'Inställningar' }
  ]

  useEffect(() => { localStorage.setItem(MODEL_KEY, model); onModelChange?.(model) }, [model, onModelChange])
  useEffect(()=>{
    const measure = () => { if(modelRef.current) setModelWidth(modelRef.current.offsetWidth) }
    measure()
    window.addEventListener('resize', measure)
    return ()=> window.removeEventListener('resize', measure)
  },[])

  return (
  <div className="mb-3 rounded-t-2xl relative ml-8">
      <Card.Body className="py-3 d-flex flex-column gap-2 position-relative">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          {isMobile && (
            <button
              aria-label={sidebarOpen ? (t('nav.close_menu')||'Stäng meny') : (t('nav.open_menu')||'Öppna meny')}
              onClick={toggleSidebar}
              className={
                `bg-[#0b2533] border border-[#1c3747] px-2 py-1.5 rounded-lg cursor-pointer flex flex-col gap-1 w-[38px] h-[36px] justify-center items-center transition-all duration-300 ${sidebarOpen ? '' : ''}`
              }
            >
              <span className={`block w-[20px] h-[2px] bg-[#cfe8ff] transition-all duration-300 ${sidebarOpen ? 'transform translate-y-[6px] rotate-45' : ''}`} />
              <span className={`block w-[20px] h-[2px] bg-[#cfe8ff] transition-all duration-300 ${sidebarOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-[20px] h-[2px] bg-[#cfe8ff] transition-all duration-300 ${sidebarOpen ? 'transform -translate-y-[6px] -rotate-45' : ''}`} />
            </button>
          )}
          <h3 className="m-0 flex items-center gap-4 flex-wrap text-[#e6eef8] text-lg font-semibold">
            <span>My Assistant</span>
            <select ref={modelRef} className="bg-[#0f2732] border border-[#224457] text-[#cfe8ff] rounded-lg px-2 py-1 text-sm min-w-[170px]" value={model} onChange={e=>setModel(e.target.value)}>
              {models.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </h3>
        </div>
        {/* Inställningar button in top right */}
        <div className="absolute top-3 right-4">
          <button
            key={navItems[0].to}
            onClick={()=>navigate(navItems[0].to)}
            className="px-4 py-2 rounded-full bg-[#0f2732] border border-[#224457] text-[#cfe8ff] text-base font-semibold shadow-none"
          >
            {navItems[0].label}
          </button>
        </div>
        {isMobile && (()=>{
          const indentPx = 54; // menu button (38) + gap (~16)
          return (
            <div className="mobile-chat-nav-row d-flex align-items-center flex-nowrap mt-2" style={{ marginLeft: indentPx }}>
              <div className="text-xs text-[#8ea6b8] mr-4 tracking-[.5px]">Chat</div>
              {/* Old Inställningar button removed, nothing else here */}
            </div>
          );
        })()}
      </Card.Body>
    </div>
  );
}
