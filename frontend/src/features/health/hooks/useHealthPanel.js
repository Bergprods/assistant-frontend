import { useState, useRef, useEffect } from 'react'
import { HealthClient } from '../../../api/HealthClient'

export function useHealthPanel(autoInterval = 10000) {
	const clientRef = new HealthClient()
	const [showHealth, setShowHealth] = useState(false)
	const [healthLoading, setHealthLoading] = useState(false)
	const [healthError, setHealthError] = useState(null)
	const [healthData, setHealthData] = useState([])
	const [dbHealthData, setDbHealthData] = useState([])
	const [containersOpen, setContainersOpen] = useState(true)
	const [databasesOpen, setDatabasesOpen] = useState(false)
	const [lastHealthTs, setLastHealthTs] = useState(null)
	const [autoRefresh, setAutoRefresh] = useState(true)
	const timer = useRef(null)

	async function fetchHealth() {
		setHealthLoading(true); setHealthError(null)
		try {
			const containers = await clientRef.fetchContainers()
			setHealthData(containers.services || [])
			const db = await clientRef.fetchDatabases()
			setDbHealthData(db.databases || [])
			setLastHealthTs(new Date())
		} catch (e) { setHealthError(String(e)) } finally { setHealthLoading(false) }
	}
	function openHealthModal() { setShowHealth(true); fetchHealth() }
	function closeHealthModal() { setShowHealth(false) }

	useEffect(() => {
		if (showHealth && autoRefresh) {
			timer.current && clearInterval(timer.current)
			timer.current = setInterval(fetchHealth, autoInterval)
		} else if (timer.current) {
			clearInterval(timer.current); timer.current = null
		}
		return () => { timer.current && clearInterval(timer.current) }
	}, [showHealth, autoRefresh, autoInterval])

	return { showHealth, openHealthModal, closeHealthModal, healthLoading, healthError, healthData, dbHealthData,
		containersOpen, setContainersOpen, databasesOpen, setDatabasesOpen, lastHealthTs, fetchHealth, autoRefresh, setAutoRefresh }
}
