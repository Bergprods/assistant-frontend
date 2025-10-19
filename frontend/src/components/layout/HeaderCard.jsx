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

  const navItems = [
    { to: '/health', key: 'nav.health', label: t('nav.health') || 'Hälsa' },
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
    <Card className="mb-3 header-card-dark header-card-rel">
      <Card.Body className="py-3 d-flex flex-column gap-2 position-relative">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          {isMobile && (
            <button
              className={`mobile-menu-btn${sidebarOpen ? ' open': ''}`}
              aria-label={sidebarOpen ? (t('nav.close_menu')||'Stäng meny') : (t('nav.open_menu')||'Öppna meny')}
              onClick={toggleSidebar}
            >
              <span className="bar" /><span className="bar" /><span className="bar" />
            </button>
          )}
          <h3 className="m-0 d-flex align-items-center gap-3" style={{flexWrap:'wrap'}}>
            <span>My Assistant</span>
            <Form.Select ref={modelRef} size="sm" className="assistant-model-select" style={{width: 'auto', minWidth: 170}} value={model} onChange={e=>setModel(e.target.value)}>
              {models.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </Form.Select>
            <Form.Select size="sm" className="assistant-model-select" style={{width: 'auto', minWidth: 160}} value={engine} onChange={e=>onEngineChange?.(e.target.value)}>
              <option value="orchestrator">Orchestrator</option>
              <option value="router">RouterGPT</option>
            </Form.Select>
          </h3>
        </div>
        {isMobile ? (
          (()=>{
            const indentPx = 54; // menu button (38) + gap (~16)
            return (
              <div className="mobile-chat-nav-row d-flex align-items-center flex-nowrap mt-2" style={{ marginLeft: indentPx }}>
                <div className="small text-muted me-4" style={{letterSpacing:'.5px'}}>Chat</div>
                <div
                  className="d-flex align-items-center gap-2 header-nav ms-auto justify-content-end"
                  style={modelWidth ? { width: modelWidth, maxWidth: modelWidth } : {}}
                >
                  {navItems.map(item => (
                    <button
                      key={item.to}
                      className={`nav-pill-btn${current === item.to ? ' active': ''}`}
                      onClick={()=>navigate(item.to)}
                    >{item.label}</button>
                  ))}
                </div>
              </div>
            )
          })()
        ) : (
          <>
            <div className="small text-muted" style={{letterSpacing:'.5px'}}>Chat</div>
            <div className="header-nav header-nav-bottom-right">
              {navItems.map(item => (
                <button
                  key={item.to}
                  className={`nav-pill-btn${current === item.to ? ' active': ''}`}
                  onClick={()=>navigate(item.to)}
                >{item.label}</button>
              ))}
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  )
}
