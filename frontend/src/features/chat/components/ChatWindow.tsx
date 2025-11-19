import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { MessageBubble } from './MessageBubble'

/**
 * ChatWindow component
 * Props:
 *  - messages: array of { role, content }
 *  - loading: boolean (sending state)
 *  - onSend: function(text)
 *  - onClear: function()
 *  - canSend: boolean (enabled if a chat is selected)
 *  - t: translation function
 *  - endRef: ref placed after last message for auto-scroll
 *  - onOpenChatActions?: function() - open chat actions menu/panel
 */
export function ChatWindow({ messages, loading, onSend, onClear, canSend, t, endRef, onOpenChatActions, tasksActive }) {
  const [input, setInput] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const actionsRef = useRef(null)
  const blockRef = useRef(null)
  const touchMapRef = useRef(new WeakMap())

  const triggerSend = useCallback(() => {
    const text = input.trim()
    if (!text) return
    setInput('')
    onSend(text)
  }, [input, onSend])

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      triggerSend()
    }
  }
  // Long-press tooltip support (mobile)
  const showTipTemp = (el) => {
    if (!el) return
    el.classList.add('tip-show')
    setTimeout(() => el.classList.remove('tip-show'), 1500)
  }
  const handleTouchStart = (e) => {
    const el = e.currentTarget
    const entry = { triggered: false, timer: null }
    entry.timer = setTimeout(() => { entry.triggered = true; showTipTemp(el) }, 500)
    touchMapRef.current.set(el, entry)
  }
  const handleTouchEnd = (e) => {
    const el = e.currentTarget
    const entry = touchMapRef.current.get(el)
    if (!entry) return
    clearTimeout(entry.timer)
    if (entry.triggered) {
      // consume click after long-press so only tooltip shows
      e.preventDefault()
      e.stopPropagation()
    }
    touchMapRef.current.delete(el)
  }

  // Close actions menu on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return
    const onDocClick = (e) => {
      if (!menuRef.current || !blockRef.current) return
      // If clicking inside the menu, ignore
      if (menuRef.current.contains(e.target)) return
      // If clicking on the actions trigger or its wrap, ignore so the button can toggle
      if (actionsRef.current && actionsRef.current.contains(e.target)) return
      // Otherwise, close on any other area
      setMenuOpen(false)
    }
    const onKeyDown = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <div className="w-full h-full flex flex-col bg-[#071726] rounded-2xl shadow-lg p-0 overflow-hidden">
      <div className="relative flex-1 flex flex-col px-0 py-0 min-h-[220px]">
        <div className="w-full flex justify-center">
          <div className="w-1/2 flex flex-col">
            <div className="output-area w-full h-full">
              {messages.length === 0 && (
                <div
                  aria-live="polite"
                  className="flex items-center justify-center text-center px-10 text-[1.35rem] font-semibold leading-tight text-[#7fa4b8] pointer-events-none min-h-[220px]"
                  style={{ minHeight: '220px', height: '100%' }}
                >
                  <div className="w-full flex items-center justify-center h-full">
                    {t('chat.empty')}
                  </div>
                </div>
              )}
              {messages.map((m, i) => <MessageBubble key={i} message={m} />)}
              {/* Typing indicator left-aligned as assistant bubble while loading */}
              {loading && (
                <div className="w-full flex justify-start my-4">
                  <div className="flex gap-1 items-center px-4 py-1.5 bg-[#1a2d3a] border border-[#3778aa73] rounded-xl shadow-md backdrop-blur-sm max-w-[70%] text-left"
                    style={{ boxShadow: '0 0 6px 2px rgba(30,110,190,0.18), 0 0 0 1px rgba(70,150,210,0.18) inset' }}>
                    <span className="text-[0.98rem] font-semibold text-[#e1f4ff] mr-1 pb-[1px] opacity-95" style={{ letterSpacing: '.45px', textShadow: '0 0 4px rgba(80,170,255,0.45)' }}>{t('chat.typing')}</span>
                    <span className="w-[10px] h-[10px] rounded-full bg-[#0b5cff] animate-bounce" style={{ animationDuration: '1s', animationIterationCount: 'infinite' }} />
                    <span className="w-[10px] h-[10px] rounded-full bg-[#36b5ff] animate-bounce" style={{ animationDelay: '.2s', animationDuration: '1s', animationIterationCount: 'infinite' }} />
                    <span className="w-[10px] h-[10px] rounded-full bg-[#5fd4ff] animate-bounce" style={{ animationDelay: '.4s', animationDuration: '1s', animationIterationCount: 'infinite' }} />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </div>
        </div>
      </div>
      {/* Separator */}
      <div className="w-full flex items-center justify-center mb-6 mt-0">
        <div className="w-2/3 h-[2px] bg-[#224457] opacity-40 rounded-full" />
      </div>
      <div className="w-full flex flex-col px-0 bg-[#071726] pb-4">
        <div className="flex-grow flex justify-center">
          <div className="w-1/2 block flex flex-col items-center">
            <div className="relative w-full">
              <textarea
                rows={3}
                placeholder={t('chat.placeholder')}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                disabled={loading}
                onInput={e => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 15 * 16) + 'px';
                }}
                style={{ minHeight: '3rem', maxHeight: '15rem', overflow: 'auto' }}
                className="w-full block rounded-xl bg-[#13283a] text-[#e6eef8] placeholder:text-[#7f9ba8] px-4 py-3 pr-12 text-base focus:outline-none focus:ring-0 focus:border-0 resize-none transition-all duration-150"
              />
              <button
                type="button"
                aria-label={t('button.send')}
                data-tip={t('button.send')}
                disabled={loading || !canSend || input.trim().length === 0}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                onClick={triggerSend}
                className="absolute top-1/2 right-3 -translate-y-1/2 p-0 m-0 bg-transparent border-none flex items-center justify-center w-8 h-8 cursor-pointer z-10 transition-colors duration-200 hover:scale-110 disabled:opacity-60"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M3.2 11.3l16.5-7.1c.7-.3 1.4.4 1.1 1.1l-7.1 16.5c-.3.7-1.3.7-1.6 0l-2.4-5.1-5.1-2.4c-.7-.3-.7-1.3 0-1.6Z" fill="#cfd8df"/>
                  <path d="M10.7 13.3l2.5 5.3 6.1-14.1-14.1 6.1 5.3 2.5 5.1-5.1-4.9 5.3Z" fill="#cfd8df" opacity=".12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
