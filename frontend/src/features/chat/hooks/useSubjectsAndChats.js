import { useState } from 'react'
import { useLocalStorageState } from '@hooks/useLocalStorageState'

export function useSubjectsAndChats() {
	const [subjects, setSubjects] = useLocalStorageState('routergpt_subjects', [])
	const [selectedSubjectId, setSelectedSubjectId] = useState(() => subjects[0]?.id || null)
	const [selectedChatId, setSelectedChatId] = useState(null)
	const conversationId = selectedChatId || 'default'

	function createSubject(name) {
		if (!name) return null
		const id = 'sub_' + Date.now().toString(36)
		const subject = { id, name: name.trim(), chats: [] }
		setSubjects(s => [...s, subject])
		setSelectedSubjectId(id); setSelectedChatId(null)
		return subject
	}
	function createChat(subjId, name) {
		if (!subjId || !name) return null
		const chatId = 'chat_' + Date.now().toString(36) + Math.random().toString(36).slice(2,8)
		setSubjects(prev => prev.map(s => s.id === subjId ? { ...s, chats: [...(s.chats||[]), { id: chatId, name: name.trim(), created: new Date().toISOString() }] } : s))
		setSelectedSubjectId(subjId); setSelectedChatId(chatId)
		return chatId
	}
	function selectChat(subjId, chatId) { setSelectedSubjectId(subjId); setSelectedChatId(chatId) }
	function deleteChat(subjId, chatId) {
		setSubjects(prev => prev.map(s => s.id === subjId ? { ...s, chats: (s.chats||[]).filter(c=>c.id!==chatId) } : s))
		if (selectedChatId === chatId) setSelectedChatId(null)
	}
	function renameSubject(subjId, newName) {
		if (!newName) return
		setSubjects(prev=>prev.map(ss=>ss.id===subjId?{...ss,name:newName.trim()}:ss))
	}
	function renameChat(subjId, chatId, newName) {
		if (!newName) return
		setSubjects(prev=>prev.map(ss=>ss.id===subjId?{...ss,chats:ss.chats.map(c=>c.id===chatId?{...c,name:newName.trim()}:c)}:ss))
	}
	return { subjects, setSubjects, selectedSubjectId, setSelectedSubjectId, selectedChatId, setSelectedChatId, conversationId,
		createSubject, createChat, selectChat, deleteChat, renameSubject, renameChat }
}
