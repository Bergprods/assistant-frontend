import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Card, Collapse } from 'react-bootstrap'
import { useI18n } from '../i18n'
import { Sidebar } from '../components/layout/Sidebar/Sidebar'
import { HeaderCard } from '../components/layout/HeaderCard'
import { ChatWindow } from '@features/chat/components/ChatWindow'
import { TaskTable } from '@features/tasks/components/TaskTable'
import { HealthModal } from '@features/health/components/HealthModal'
import { useSubjectsAndChats, useMessages, useChatSend, useTasksData, useResponsiveSidebar, useHealthPanel } from '../hooks'

export function ChatPage() {
  const { t } = useI18n()
  // Engine selection needs to be available before hooks that depend on it
  const [engine, setEngine] = useState(() => localStorage.getItem('assistant_engine') || 'orchestrator')
  useEffect(()=>{ localStorage.setItem('assistant_engine', engine) }, [engine])

  const { subjects, selectedSubjectId, selectedChatId, conversationId,
    createSubject, createChat, selectChat, deleteChat, renameSubject, renameChat } = useSubjectsAndChats()
  const { messages, append, appendTo, clearChat, endRef } = useMessages(selectedChatId)
  // Model selection (synced with HeaderCard localStorage key)
  const MODEL_KEY = 'assistant_selected_model'
  const [model, setModel] = useState(()=> localStorage.getItem(MODEL_KEY) || 'gpt-4o-mini')
  useEffect(()=>{ localStorage.setItem(MODEL_KEY, model) }, [model])
  const { tasks, setTasks } = useTasksData({ enableServerTasks: engine !== 'orchestrator' })
  const { isMobile, sidebarOpen, toggleSidebar } = useResponsiveSidebar(900)
  const { showHealth, openHealthModal, closeHealthModal, healthLoading, healthError, healthData, dbHealthData,
    containersOpen, setContainersOpen, databasesOpen, setDatabasesOpen, lastHealthTs, fetchHealth, autoRefresh, setAutoRefresh } = useHealthPanel()
  const [agentFilter, setAgentFilter] = useState('all')
  const [sortBy, setSortBy] = useState('time_desc')
  const [hideSmalltalkTasks, setHideSmalltalkTasks] = useState(() => localStorage.getItem('hide_smalltalk_tasks') === '1')
  useEffect(()=>{ localStorage.setItem('hide_smalltalk_tasks', hideSmalltalkTasks ? '1' : '0') }, [hideSmalltalkTasks])
  const [showTasks, setShowTasks] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
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
  const toggleSettings = ()=> setSettingsOpen(o=>!o)

  return (
  <div className={`app-layout${isMobile ? ' mobile' : ''}${!showTasks ? ' tasks-hidden' : ''}`}>
      <Sidebar
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        subjects={subjects}
        selectedSubjectId={selectedSubjectId}
        selectedChatId={selectedChatId}
        setSelectedSubjectId={()=>{}}
        selectChat={selectChat}
        renameSubject={handleRenameSubject}
        renameChat={handleRenameChat}
        deleteChat={handleDeleteChat}
        createSubject={handleCreateSubject}
        createChat={handleCreateChat}
        settingsOpen={settingsOpen}
        toggleSettings={toggleSettings}
        openHealthModal={openHealthModal}
        hideNav={true}
      />
      <main className="main-content">
        <Container className="py-3">
          <HeaderCard
            onModelChange={(m)=> setModel(m)}
            engine={engine}
            onEngineChange={setEngine}
            t={t}
            isMobile={isMobile}
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          <Row>
            <Col>
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
              {showTasks && <div className="mb-3" />}
              {showTasks && (<Card className="mb-3 task-panel-card">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>{t('tasks.title')}</strong>
                  </div>
                  <div className="d-flex flex-wrap gap-2 align-items-center task-filters">
                    <Form.Select size="sm" value={agentFilter} onChange={e=>setAgentFilter(e.target.value)} style={{ width: 180 }}>
                      <option value="all">{t('tasks.filter.agent.all')}</option>
                      {Array.from(new Set(tasks.map(t => t.agent))).map(a => <option key={a} value={a}>{a}</option>)}
                    </Form.Select>
                    <Form.Select size="sm" value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ width: 170 }}>
                      <option value="time_desc">{t('tasks.sort.time_desc')}</option>
                      <option value="time_asc">{t('tasks.sort.time_asc')}</option>
                      <option value="agent_asc">Agent (A→Z)</option>
                    </Form.Select>
                    <Form.Check
                      type="checkbox"
                      id="hide-smalltalk"
                      label="Dölj smalltalk"
                      checked={hideSmalltalkTasks}
                      onChange={e=>setHideSmalltalkTasks(e.target.checked)}
                    />
                    <Button size="sm" variant="outline-secondary" onClick={()=>setShowTasks(s=>!s)}>
                      {showTasks ? t('tasks.toggle.hide') : t('tasks.toggle.show')}
                    </Button>
                  </div>
                </Card.Header>
                <Collapse in={showTasks}>
                  <div><Card.Body><TaskTable tasks={tasks} agentFilter={agentFilter} sortBy={sortBy} hideSmalltalk={hideSmalltalkTasks} /></Card.Body></div>
                </Collapse>
              </Card>)}
            </Col>
          </Row>
        </Container>
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
      </main>
    </div>
  )
}
