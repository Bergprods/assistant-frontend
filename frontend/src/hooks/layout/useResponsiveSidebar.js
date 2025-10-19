import { useState, useEffect } from 'react'

export function useResponsiveSidebar(breakpoint = 900) {
	const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint)
	const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= breakpoint)
	useEffect(() => {
		const onResize = () => {
			const mobile = window.innerWidth < breakpoint
			setIsMobile(mobile)
			setSidebarOpen(!mobile)
		}
		window.addEventListener('resize', onResize)
		return () => window.removeEventListener('resize', onResize)
	}, [breakpoint])
	const toggleSidebar = () => setSidebarOpen(o => !o)
	return { isMobile, sidebarOpen, toggleSidebar }
}