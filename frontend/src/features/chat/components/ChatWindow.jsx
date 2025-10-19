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
    <div className="chat-component">
      <div className="chat-window">
        {messages.length === 0 && (
          <div className="chat-empty" aria-live="polite">
            {t('chat.empty')}
          </div>
        )}
        {messages.map((m, i) => <MessageBubble key={i} message={m} />)}
        <div ref={endRef} />
        {loading && (
          <div className="chat-typing-indicator" aria-live="polite" aria-label={t('chat.sending')}>
            <span className="label">{t('chat.typing')}</span>
            <span className="dot" /><span className="dot" /><span className="dot" />
          </div>
        )}
      </div>
      <div className="chat-input-block" ref={blockRef}>
        <div className="chat-actions-wrap" ref={actionsRef}>
          <button
            type="button"
            className={`chat-gear-btn has-tip${tasksActive ? ' tasks-active' : ''}`}
            aria-label="Actions"
            aria-expanded={menuOpen}
            data-tip="Actions"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M13 2 4 14h7l-1 8 10-12h-7l1-8Z" fill="#cfe8ff"/>
              <path d="M13 2 4 14h7l-1 8 10-12h-7l1-8Z" fill="none" stroke="#77c4f3" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
          </button>
          {menuOpen && (
            <div ref={menuRef} className="chat-actions-menu" role="menu" aria-label={t('chat.actions') || 'Chat-åtgärder'}>
              <button
                type="button"
                className={`action-icon has-tip${tasksActive ? ' active' : ''}`}
                role="menuitem"
                aria-label="Task List"
                data-tip="Task List"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                onClick={() => { setMenuOpen(false); onOpenChatActions && onOpenChatActions() }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="3" stroke="#2c7ea3" strokeWidth="1.2"/>
                  <circle cx="8" cy="8" r="1.3" fill="#9fd3ff"/>
                  <path d="M10.5 8h6" stroke="#9fd3ff" strokeWidth="1.4" strokeLinecap="round"/>
                  <circle cx="8" cy="12" r="1.3" fill="#9fd3ff"/>
                  <path d="M10.5 12h6" stroke="#9fd3ff" strokeWidth="1.4" strokeLinecap="round"/>
                  <circle cx="8" cy="16" r="1.3" fill="#9fd3ff"/>
                  <path d="M10.5 16h6" stroke="#9fd3ff" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>
        <div className="chat-input-area flex-grow-1">
          <div className="send-wrapper" style={{ position: 'relative' }}>
          <Form.Group className="m-0">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={t('chat.placeholder')}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              disabled={loading}
            />
          </Form.Group>
            <button
              type="button"
              className="chat-send-btn has-tip"
              aria-label={t('button.send')}
              data-tip={t('button.send')}
              disabled={loading || !canSend || input.trim().length === 0}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              onClick={triggerSend}
              style={{ position: 'absolute', right: 16, bottom: 12 }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M3.2 11.3l16.5-7.1c.7-.3 1.4.4 1.1 1.1l-7.1 16.5c-.3.7-1.3.7-1.6 0l-2.4-5.1-5.1-2.4c-.7-.3-.7-1.3 0-1.6Z" fill="#ffffff"/>
                <path d="M10.7 13.3l2.5 5.3 6.1-14.1-14.1 6.1 5.3 2.5 5.1-5.1-4.9 5.3Z" fill="#ffffff" opacity=".12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
