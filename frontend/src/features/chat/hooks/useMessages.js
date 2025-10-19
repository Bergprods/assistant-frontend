import { useState, useRef, useEffect } from 'react'
import { useLocalStorageState } from '@hooks/useLocalStorageState'

export function useMessages(selectedChatId) {
	const [messagesMap, setMessagesMap] = useLocalStorageState('routergpt_messages', {})
	const endRef = useRef(null)
	const messages = messagesMap[selectedChatId] || []

	function append(role, content) {
		if (!selectedChatId) return
			const now = new Date().toISOString()
			setMessagesMap(mm => {
			const list = mm[selectedChatId] || []
				return { ...mm, [selectedChatId]: [...list, { role, content, t: now }] }
		})
	}
	function appendTo(chatId, role, content) {
		if (!chatId) return
			const now = new Date().toISOString()
			setMessagesMap(mm => {
			const list = mm[chatId] || []
				return { ...mm, [chatId]: [...list, { role, content, t: now }] }
		})
	}
	function clearChat() {
		if (!selectedChatId) return
		setMessagesMap(mm => ({ ...mm, [selectedChatId]: [] }))
	}
	useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}) }, [messages])
	return { messages, append, appendTo, clearChat, endRef, messagesMap, setMessagesMap }
}
