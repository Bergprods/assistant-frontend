import { useEffect } from 'react'
import { useLocalStorageState } from '@hooks/useLocalStorageState'
import { TasksClient } from '@services/TasksClient'
import { cleanDescription } from '@utils/textHelpers'

function revive(tasks) {
	return (tasks || []).map(t => {
		try {
			const details = t.details || {}
			t.description = cleanDescription(t.description || '')
			const replyText = (t.description || '').toString()
			const hasBullets = /(^|\n)-\s+([a-zA-Z0-9_\.\/\-]+)/.test(replyText)
			const mentionsLamp = /lampa|lampor|lampan|light\./i.test(replyText)
			const isHaCandidate = !!(t.entity || details.entity_id || details.ha_result || hasBullets || mentionsLamp)
			if (isHaCandidate && !(t.agent && t.agent.toLowerCase() === 'ha')) t = { ...t, agent: 'HA' }
			if (!t.taskgiver && (details.requester || details.taskgiver)) t = { ...t, taskgiver: details.requester || details.taskgiver }
		} catch {}
		return t
	})
}

export function useTasksData(options = {}) {
	const { enableServerTasks = true } = options
	const [tasks, setTasks] = useLocalStorageState('routergpt_tasks', [], revive)
	const clientRef = new TasksClient()
	useEffect(() => {
		if (!enableServerTasks) return
		let abort = false
		clientRef.list().then(serverTasks => {
			if (abort || !Array.isArray(serverTasks)) return
			setTasks(prev => {
				const map = new Map(prev.map(t => [t.id, t]))
				serverTasks.forEach(t => { if (t?.id) map.set(t.id, { ...(map.get(t.id) || {}), ...t }) })
				return Array.from(map.values()).sort((a,b)=>(b.ts||'').localeCompare(a.ts||''))
			})
		}).catch(()=>{})
		return () => { abort = true }
	}, [enableServerTasks])
	useEffect(() => {
		if (!enableServerTasks) return () => {}
		const unsubscribe = clientRef.subscribe(evt => {
			const { event, task } = evt || {}
			if (!task?.id) return
			setTasks(prev => {
				const map = new Map(prev.map(t => [t.id, t]))
				if (event === 'task_added' && !map.has(task.id)) map.set(task.id, task)
				else if (event === 'task_updated') map.set(task.id, { ...(map.get(task.id)||{}), ...task })
				return Array.from(map.values()).sort((a,b)=>(b.ts||'').localeCompare(a.ts||''))
			})
		})
		return () => { unsubscribe && unsubscribe() }
	}, [enableServerTasks])
	return { tasks, setTasks }
}
