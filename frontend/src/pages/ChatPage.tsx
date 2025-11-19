import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Container, Row, Col, Form, Button, Card, Collapse } from 'react-bootstrap'
import { useI18n } from '../i18n'
import { HeaderCard } from '../components/layout/HeaderCard'
import { ChatWindow } from '@features/chat/components/ChatWindow'
import { TaskTable } from '@features/tasks/components/TaskTable'
import { HealthModal } from '@features/health/components/HealthModal'
import { useMessages, useChatSend, useTasksData, useHealthPanel } from '../hooks'

export function ChatPage() {
  const { t } = useI18n()
  // Engine selection needs to be available before hooks that depend on it
  const [engine, setEngine] = useState(() => localStorage.getItem('assistant_engine') || 'orchestrator')
  useEffect(()=>{ localStorage.setItem('assistant_engine', engine) }, [engine])

  const {
    subjects, selectedSubjectId, selectedChatId, conversationId,
    createSubject, createChat, selectChat, deleteChat, renameSubject, renameChat,
    isMobile, sidebarOpen, toggleSidebar
  } = useOutletContext()
  const { messages, append, appendTo, clearChat, endRef } = useMessages(selectedChatId)
  // Model selection (synced with HeaderCard localStorage key)
  const MODEL_KEY = 'assistant_selected_model'
  const [model, setModel] = useState(()=> localStorage.getItem(MODEL_KEY) || 'gpt-4o-mini')
  useEffect(()=>{ localStorage.setItem(MODEL_KEY, model) }, [model])
  const { tasks, setTasks } = useTasksData({ enableServerTasks: engine !== 'orchestrator' })
  const { showHealth, openHealthModal, closeHealthModal, healthLoading, healthError, healthData, dbHealthData,
    containersOpen, setContainersOpen, databasesOpen, setDatabasesOpen, lastHealthTs, fetchHealth, autoRefresh, setAutoRefresh } = useHealthPanel()
  const [agentFilter, setAgentFilter] = useState('all')
  const [sortBy, setSortBy] = useState('time_desc')
  const [hideSmalltalkTasks, setHideSmalltalkTasks] = useState(() => localStorage.getItem('hide_smalltalk_tasks') === '1')
  useEffect(()=>{ localStorage.setItem('hide_smalltalk_tasks', hideSmalltalkTasks ? '1' : '0') }, [hideSmalltalkTasks])
  const [showTasks, setShowTasks] = useState(false)
  const { sendMessage, loading, error } = useChatSend({ conversationId, selectedChatId, append, appendTo, addTask: task => setTasks(t => [task, ...t]), t, model, engine })

  // Ensure a subject & chat exist when user first sends a message
  function ensureChat() {
    if (selectedChatId) return selectedChatId
    // Create a subject if none
    let subjId = selectedSubjectId
    if (!subjId) {
      const newSubject = createSubject(t('prompt.subject.default') || 'Allmänt')
      subjId = newSubject?.id
    }
    // Create chat in that subject
    const chatId = createChat(subjId, t('prompt.chat.first') || 'Första konversation')
    return chatId
  }

  function handleSend(text){
    const chatId = ensureChat()
    if (!chatId) return
    sendMessage(text, chatId)
  }
  function handleCreateSubject(){ const name = prompt(t('prompt.subject.name') || 'Subject name:'); if(name) createSubject(name) }
  function handleCreateChat(subjId){ const name = prompt(t('prompt.chat.name') || 'Chat name:') || t('prompt.chat.default') || 'Ny chat'; if(name) createChat(subjId, name) }
  function handleDeleteChat(subjId, chatId){ if(confirm(t('confirm.chat.delete') || 'Ta bort chat?')) deleteChat(subjId, chatId) }
  function handleRenameSubject(subjId){ const subj = subjects.find(s=>s.id===subjId); if(!subj) return; const name = prompt(t('prompt.subject.rename') || 'Nytt namn för subject:', subj.name); if(name) renameSubject(subjId, name) }
  function handleRenameChat(subjId, chatId){ const subj = subjects.find(s=>s.id===subjId); if(!subj) return; const ch = subj.chats.find(c=>c.id===chatId); if(!ch) return; const name = prompt(t('prompt.chat.rename') || 'Nytt namn för chat:', ch.name); if(name) renameChat(subjId, chatId, name) }
  return (
    <>
  <div className="flex flex-col h-full w-full min-h-0">
        <HeaderCard
          onModelChange={(m)=> setModel(m)}
          engine={engine}
          onEngineChange={setEngine}
          t={t}
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 flex flex-col min-h-0 bg-[#071726]">
              <ChatWindow
                messages={messages}
                loading={loading}
                onSend={handleSend}
                onClear={clearChat}
                canSend={true}
                t={t}
                endRef={endRef}
                onOpenChatActions={() => setShowTasks(s=>!s)}
                tasksActive={showTasks}
              />
            </div>
          </div>
          {showTasks && (
            <div className="mt-4">
              <div className="bg-[#0f2732] border border-[#22313e] rounded-2xl shadow-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <strong>{t('tasks.title')}</strong>
                </div>
                <div className="flex flex-wrap gap-2 items-center mb-2">
                  <select className="bg-[#071726] text-[#e6eef8] border border-[#1f3646] rounded-lg px-2 py-1 text-sm" value={agentFilter} onChange={e=>setAgentFilter(e.target.value)} style={{ width: 180 }}>
                    <option value="all">{t('tasks.filter.agent.all')}</option>
                    {Array.from(new Set(tasks.map(t => t.agent))).map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <select className="bg-[#071726] text-[#e6eef8] border border-[#1f3646] rounded-lg px-2 py-1 text-sm" value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ width: 170 }}>
                    <option value="time_desc">{t('tasks.sort.time_desc')}</option>
                    <option value="time_asc">{t('tasks.sort.time_asc')}</option>
                    <option value="agent_asc">Agent (A→Z)</option>
                  </select>
                  <button className="px-3 py-1 rounded-lg border border-[#22313e] bg-[#13313f] text-[#cfe8ff] text-sm hover:bg-[#123a4a] hover:border-[#2a6a86] transition-colors" onClick={()=>setShowTasks(s=>!s)}>
                    {showTasks ? t('tasks.toggle.hide') : t('tasks.toggle.show')}
                  </button>
                </div>
                <div>
                  <TaskTable tasks={tasks} agentFilter={agentFilter} sortBy={sortBy} hideSmalltalk={hideSmalltalkTasks} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <HealthModal
        t={t}
        show={showHealth}
        onClose={closeHealthModal}
        data={healthData}
        dbData={dbHealthData}
        loading={healthLoading}
        error={healthError}
        containersOpen={containersOpen}
        setContainersOpen={setContainersOpen}
        databasesOpen={databasesOpen}
        setDatabasesOpen={setDatabasesOpen}
        fetchHealth={fetchHealth}
        lastHealthTs={lastHealthTs}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
      />
    </>
  )
}
