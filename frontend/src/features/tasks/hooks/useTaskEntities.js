import { useState } from 'react'

export function useTaskEntities(tasks) {
	const [expanded, setExpanded] = useState({})
	const [loadingEntity, setLoadingEntity] = useState({})
	const [entityDetails, setEntityDetails] = useState({})

	function isHaTask(t) {
		if (!t) return false
		const d = t.details || {}
		return t.agent === 'HA' || !!(t.entity || d.entity_id || d.entities || d.ha_result || d.ha_injected || d.routed_to === 'home_assistant')
	}

	async function fetchEntityDetails(task) {
		setLoadingEntity(le => ({ ...le, [task.id]: true }))
		try {
			// Placeholder: expect backend endpoint later. For now derive from details.
			const d = task.details || {}
			const data = d.entities || d.ha_result || d.entity_list || []
			const arr = Array.isArray(data) ? data : (data ? [data] : [])
			setEntityDetails(ed => ({ ...ed, [task.id]: arr }))
		} catch (e) {
			setEntityDetails(ed => ({ ...ed, [task.id]: [] }))
		} finally {
			setLoadingEntity(le => ({ ...le, [task.id]: false }))
		}
	}

	function handleRowClick(task) {
		if (!task || !(task.status === 'error' || (task.status === 'info' && isHaTask(task)))) return
		setExpanded(ex => ({ ...ex, [task.id]: !ex[task.id] }))
		if (!entityDetails[task.id] && !loadingEntity[task.id]) fetchEntityDetails(task)
	}

	return { expanded, loadingEntity, entityDetails, handleRowClick, isHaTask }
}