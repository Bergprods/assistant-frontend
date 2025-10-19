import { useMemo } from 'react'

export function useFilteredTasks(tasks, agentFilter, sortBy, hideSmalltalk = false) {
	return useMemo(() => {
		let list = Array.isArray(tasks) ? [...tasks] : []
		// Agent filter: treat 'all'/'ALL' (and empty) as no filter
		const af = (agentFilter || '').toString().toLowerCase()
		if (af && af !== 'all') {
			list = list.filter(t => (t.agent || (t.details && t.details.routed_to) || '').toLowerCase().includes(af))
		}
		if (hideSmalltalk) {
			list = list.filter(t => !(String(t.agent).toLowerCase() === 'orchestrator' && t?.details && String(t.details.intent).toLowerCase() === 'smalltalk'))
		}
		// Sorting options used by ChatPage: time_desc, time_asc, agent_asc
		if (sortBy === 'agent_asc') list.sort((a,b)=>(a.agent||'').localeCompare(b.agent||''))
		else if (sortBy === 'time_asc') list.sort((a,b)=>(a.ts||'').localeCompare(b.ts||''))
		else /* time_desc */ list.sort((a,b)=>(b.ts||'').localeCompare(a.ts||''))
		return list
	}, [tasks, agentFilter, sortBy, hideSmalltalk])
}