import { useCallback, useEffect, useRef, useState } from 'react'
import { useCardDrag } from './useCardDrag'
import { useLassoSelect } from './useLassoSelect'
import type { ActiveConnectionPreview, Point } from '../../../../types'

const MIN_ZOOM = 0.5
const MAX_ZOOM = 1.75
const ZOOM_STEP = 0.08

const INITIAL_DRAG_STATE = { active: false, lastX: 0, lastY: 0, raf: 0 }

function extractClientPoint(event: React.MouseEvent | React.TouchEvent) {
  if ('touches' in event) {
    const touch = event.touches[0] ?? event.changedTouches?.[0]
    return {
      clientX: touch?.clientX ?? 0,
      clientY: touch?.clientY ?? 0
    }
  }
  return {
    clientX: event.clientX ?? 0,
    clientY: event.clientY ?? 0
  }
}

interface UseWorkspaceNavigationOptions {
  cancelActiveConnection: () => void
  activeConnection: ActiveConnectionPreview | null
  updateActiveConnectionPoint: (point: Point) => void
}

export function useWorkspaceNavigation({
  cancelActiveConnection,
  activeConnection,
  updateActiveConnectionPoint
}: UseWorkspaceNavigationOptions) {
  // Block workspace drag if a card was just dragged
  const blockWorkspaceDragRef = useRef(false)
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isWorkspaceDragging, setIsWorkspaceDragging] = useState(false)

  const workspaceRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ active: boolean; lastX: number; lastY: number; raf: number }>({ ...INITIAL_DRAG_STATE })

  const getWorkspacePoint = useCallback(
    (clientX: number, clientY: number): Point => {
      const rect = workspaceRef.current?.getBoundingClientRect()
      if (!rect) return { x: 0, y: 0 }
      return {
        x: (clientX - rect.left - pan.x) / zoom,
        y: (clientY - rect.top - pan.y) / zoom
      }
    },
    [pan.x, pan.y, zoom]
  )

  const { isActive: isLassoActive, beginLasso, updateLasso, endLasso, bounds: lassoBounds } = useLassoSelect({
    getWorkspacePoint
  })

  const { handleDragPointerMove, stopAutoPan, startCardDrag } = useCardDrag({
    workspaceRef,
    setPan,
    workspaceDragState: drag
  })

  useEffect(() => {
    if (typeof document === 'undefined') return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const handleWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    // avoid calling preventDefault here because some browsers may attach passive
    // wheel listeners which cause the warning: "Unable to preventDefault inside passive event listener".
    // Scrolling is already suppressed via document.body.style.overflow = 'hidden' and the workspace
    // container has `touch-action: none` set so touch gestures won't trigger native scrolling.
    const delta = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
    setZoom((prev) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev + delta))
      return Number(next.toFixed(3))
    })
  }, [])

  // Timestamp guard: last card-drag end time and how long to block background drags
  const lastCardDragEndRef = useRef(0)
  const DRAG_BLOCK_MS = 200
  // Optional: remember the pointerId of the last card drag so we can ignore a background pointerdown with the same id
  const consumedPointerIdRef = useRef<number | null>(null)

  const handleBackgroundPointerDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      if ('button' in event && event.button !== 0) return
      const target = event.target as HTMLElement
      const now = Date.now()
      try {
        console.debug('[workspace] bg pointerdown', {
          now,
          target: (target && (target.tagName || (target.className as any))) || null,
          lastCardDragEnd: lastCardDragEndRef.current,
          blockFlag: blockWorkspaceDragRef.current
        })
      } catch (e) {}

      // If a recent card drag ended, ignore the first background pointerdown (timestamp guard)
      if (blockWorkspaceDragRef.current) {
        try {
          console.debug('[workspace] bg pointerdown ignored due to blockWorkspaceDragRef')
        } catch (e) {}
        blockWorkspaceDragRef.current = false
        return
      }

      // If the incoming event has a pointerId and matches the last consumed pointer, ignore it
      const incomingPointerId = (event as any)?.pointerId ?? (event as any)?.nativeEvent?.pointerId ?? null
      if (consumedPointerIdRef.current && incomingPointerId && consumedPointerIdRef.current === incomingPointerId) {
        try { console.debug('[workspace] bg pointerdown ignored because pointerId matches recently consumed pointer', { incomingPointerId, consumed: consumedPointerIdRef.current }) } catch (e) {}
        // Clear consumed pointer -- we've handled the suppression
        consumedPointerIdRef.current = null
        return
      }

      if (now - (lastCardDragEndRef.current ?? 0) < DRAG_BLOCK_MS) {
        try {
          console.debug('[workspace] bg pointerdown ignored due to recent card drag', { delta: now - lastCardDragEndRef.current })
        } catch (e) {}
        // Consume this background pointerdown because it likely belongs to the prior card drag
        return
      }
      if (target.closest('.create-agent-bottom-menu') || target.closest('.agent-workspace-card')) return
      if ('shiftKey' in event && event.shiftKey) {
        cancelActiveConnection()
        const { clientX, clientY } = extractClientPoint(event)
        beginLasso(clientX, clientY)
        return
      }
      cancelActiveConnection()
      drag.current.active = true
      setIsWorkspaceDragging(true)
      const { clientX, clientY } = extractClientPoint(event)
      drag.current.lastX = clientX
      drag.current.lastY = clientY
    },
    [beginLasso, cancelActiveConnection]
  )

  const handleBackgroundPointerMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      if (activeConnection) {
        const { clientX, clientY } = extractClientPoint(event)
        updateActiveConnectionPoint(getWorkspacePoint(clientX, clientY))
        return
      }

      if (isLassoActive) {
        const { clientX, clientY } = extractClientPoint(event)
        updateLasso(clientX, clientY)
        return
      }

      if (!drag.current.active) return
      const { clientX, clientY } = extractClientPoint(event)
      const dx = clientX - drag.current.lastX
      const dy = clientY - drag.current.lastY
      drag.current.lastX = clientX
      drag.current.lastY = clientY
      if (!drag.current.raf) {
        drag.current.raf = requestAnimationFrame(() => {
          setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
          drag.current.raf = 0
        })
      }
    },
    [activeConnection, getWorkspacePoint, isLassoActive, updateActiveConnectionPoint, updateLasso]
  )

  const handleBackgroundPointerUp = useCallback(() => {
    drag.current.active = false
          try { console.debug('[workspace] clearing blockWorkspaceDragRef after timeout') } catch (e) {}
    setIsWorkspaceDragging(false)
    if (isLassoActive) {
      endLasso()
    }
  }, [endLasso, isLassoActive])

  const onCardDragPointerEndPatched = (pointerId?: number | null) => {
    // Temporarily block workspace drag for a short window to avoid race with pointer events
    const ts = Date.now()
    try { console.debug('[workspace] cardDrag end patched', { ts, pointerId }) } catch (e) {}
    blockWorkspaceDragRef.current = true
    lastCardDragEndRef.current = ts
    // record consumed pointer id so that the immediate background pointerdown with the same id is ignored
    if (pointerId != null) consumedPointerIdRef.current = pointerId
    stopAutoPan()
    // Keep the block for a short time (ms)
    window.setTimeout(() => {
      try { console.debug('[workspace] clearing blockWorkspaceDragRef after timeout') } catch (e) {}
      blockWorkspaceDragRef.current = false
      consumedPointerIdRef.current = null
    }, DRAG_BLOCK_MS)
  }

  const onCardPointerDownWrapped = useCallback(
    (block: any, downEvent: PointerEvent | React.PointerEvent, opts?: any) => {
      // ensure the workspace-level patched end handler runs after card drag
      startCardDrag(block, downEvent as any, { ...(opts || {}), onDragEnd: onCardDragPointerEndPatched })
    },
    [startCardDrag, onCardDragPointerEndPatched]
  )

  return {
    pan,
    zoom,
    workspaceRef,
    getWorkspacePoint,
    lassoBounds,
    isWorkspaceDragging,
    blockWorkspaceDragRef,
    handlers: {
      onBackgroundPointerDown: handleBackgroundPointerDown,
      onBackgroundPointerMove: handleBackgroundPointerMove,
      onBackgroundPointerUp: handleBackgroundPointerUp,
      onWheel: handleWheel,
      onCardDragPointerMove: handleDragPointerMove,
      onCardDragPointerEnd: onCardDragPointerEndPatched,
      onCardPointerDown: onCardPointerDownWrapped
    }
  }
}
