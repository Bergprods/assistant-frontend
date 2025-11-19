import { Dispatch, MutableRefObject, RefObject, SetStateAction, useCallback, useEffect, useRef } from 'react'
import type { Point, AgentBlock } from '../../../../types'

const EDGE_TRIGGER = 32
const AUTOPAN_MAX_SPEED = 24

interface UseCardDragOptions {
  workspaceRef: RefObject<HTMLDivElement | null>
  setPan: Dispatch<SetStateAction<Point>>
  workspaceDragState: MutableRefObject<{ active: boolean }>
}

export function useCardDrag({ workspaceRef, setPan, workspaceDragState }: UseCardDragOptions) {
  const autoPanRef = useRef({ raf: 0, vx: 0, vy: 0 })
  const dragStateRef = useRef<{
    id: string
    originX: number
    originY: number
    startX: number
    startY: number
    pointerOffsetX: number
    pointerOffsetY: number
    pointerId?: number
    pointerTarget?: EventTarget | null
  } | null>(null)
  const hasDraggedRef = useRef(false)

  const runAutoPan = useCallback(() => {
    const state = autoPanRef.current
    if (workspaceDragState.current?.active) {
      state.vx = 0
      state.vy = 0
      if (state.raf) {
        cancelAnimationFrame(state.raf)
        state.raf = 0
      }
      return
    }

    // If no velocity, ensure RAF is not left running
    if (!state.vx && !state.vy) {
      if (state.raf) {
        cancelAnimationFrame(state.raf)
        state.raf = 0
      }
      return
    }

  // Apply pan step and schedule next frame
  try { console.debug('[card-drag][autopan] applying step', { vx: state.vx, vy: state.vy }) } catch (e) {}
  setPan((prev) => ({ x: prev.x + state.vx, y: prev.y + state.vy }))
    // Only schedule if not already scheduled
    if (!state.raf) {
      state.raf = requestAnimationFrame(runAutoPan)
    }
  }, [setPan, workspaceDragState])

  const updateAutoPan = useCallback(
    (vx: number, vy: number) => {
      const state = autoPanRef.current
      if (workspaceDragState.current?.active) {
        try { console.debug('[card-drag][autopan] suppressed because workspaceDragState.active') } catch (e) {}
        state.vx = 0
        state.vy = 0
        if (state.raf) {
          cancelAnimationFrame(state.raf)
          state.raf = 0
        }
        return
      }

      state.vx = vx
      state.vy = vy
      try { console.debug('[card-drag][autopan] updateAutoPan', { vx: state.vx, vy: state.vy }) } catch (e) {}

      // Immediate, small-step pan so the user sees movement right away while RAF schedules continuous motion.
      if ((vx || vy) && !workspaceDragState.current?.active) {
        try {
          setPan((prev) => ({ x: prev.x + vx, y: prev.y + vy }))
          console.debug && console.debug('[card-drag][autopan] applied immediate pan step', { vx, vy })
        } catch (e) {}
      }

      if (vx || vy) {
        if (!state.raf) {
          state.raf = requestAnimationFrame(runAutoPan)
        }
      } else if (state.raf) {
        cancelAnimationFrame(state.raf)
        state.raf = 0
      }
    },
    [runAutoPan, workspaceDragState]
  )

  const handleDragPointerMove = useCallback(
    (clientX: number | null | undefined, clientY: number | null | undefined) => {
      if (clientX == null || clientY == null) return
      const rect = workspaceRef.current?.getBoundingClientRect()
      if (!rect) return

      const calcDelta = (distance: number, invert = false) => {
        if (distance >= EDGE_TRIGGER) return 0
        const normalized = (EDGE_TRIGGER - Math.max(distance, 0)) / EDGE_TRIGGER
        const delta = normalized * AUTOPAN_MAX_SPEED
        return invert ? -delta : delta
      }

      const distLeft = clientX - rect.left
      const distRight = rect.right - clientX
      const distTop = clientY - rect.top
      const distBottom = rect.bottom - clientY

      let vx = 0
      if (distLeft < EDGE_TRIGGER) {
        vx = calcDelta(distLeft, false)
      } else if (distRight < EDGE_TRIGGER) {
        vx = calcDelta(distRight, true)
      }

      let vy = 0
      if (distTop < EDGE_TRIGGER) {
        vy = calcDelta(distTop, false)
      } else if (distBottom < EDGE_TRIGGER) {
        vy = calcDelta(distBottom, true)
      }

      updateAutoPan(vx, vy)
    },
    [updateAutoPan, workspaceRef]
  )

  const stopAutoPan = useCallback(() => {
    updateAutoPan(0, 0)
  }, [updateAutoPan])

  // Start a card drag: attaches global pointer listeners and updates position
  const startCardDrag = useCallback(
    (
      block: AgentBlock,
      downEvent: PointerEvent | React.PointerEvent,
      opts: {
        onPositionChange: (id: string, pos: Point) => void
        getWorkspacePoint?: (clientX: number, clientY: number) => Point
        zoom?: number
        onDragEnd?: (pointerId?: number) => void
      }
    ) => {
      const { onPositionChange, getWorkspacePoint, zoom = 1, onDragEnd } = opts || {}
      const ev = downEvent as PointerEvent
      try {
        console.debug('[card-drag] start', { id: block.id, clientX: ev.clientX, clientY: ev.clientY, pointerId: (ev as any).pointerId })
      } catch (e) {}
      const pointerPoint = getWorkspacePoint ? getWorkspacePoint(ev.clientX, ev.clientY) : null
      dragStateRef.current = {
        id: block.id,
        startX: ev.clientX,
        startY: ev.clientY,
        originX: block.x,
        originY: block.y,
        pointerOffsetX: pointerPoint ? pointerPoint.x - block.x : 0,
        pointerOffsetY: pointerPoint ? pointerPoint.y - block.y : 0
      }
      hasDraggedRef.current = false

  const handleMove = (e: PointerEvent) => {
        const ds = dragStateRef.current
        if (!ds) return
        let nextPosition = null
        if (getWorkspacePoint) {
          const wp = getWorkspacePoint(e.clientX, e.clientY)
          if (wp) {
            nextPosition = { x: wp.x - ds.pointerOffsetX, y: wp.y - ds.pointerOffsetY }
          }
        }
        if (!nextPosition) {
          const dx = (e.clientX - ds.startX) / zoom
          const dy = (e.clientY - ds.startY) / zoom
          nextPosition = { x: ds.originX + dx, y: ds.originY + dy }
        }
        if (!hasDraggedRef.current && (Math.abs(e.clientX - ds.startX) > 2 || Math.abs(e.clientY - ds.startY) > 2)) {
          hasDraggedRef.current = true
          try {
            console.debug('[card-drag] moved', { id: ds.id, clientX: e.clientX, clientY: e.clientY, dx: e.clientX - ds.startX, dy: e.clientY - ds.startY })
          } catch (err) {}
        }
        onPositionChange(ds.id, nextPosition)
        // feed auto-pan logic
        handleDragPointerMove(e.clientX, e.clientY)
      }

  const handleUp = (e: PointerEvent) => {
        // call end handler synchronously to avoid event-order races with background handlers
        try {
          const ds = dragStateRef.current
          if (ds && hasDraggedRef.current) {
            // compute a final position using workspace coordinates if available
            let finalPosition = null
            if (getWorkspacePoint) {
              try {
                const wp = getWorkspacePoint(e.clientX, e.clientY)
                finalPosition = { x: wp.x - ds.pointerOffsetX, y: wp.y - ds.pointerOffsetY }
              } catch (er) {
                // ignore
              }
            }
            if (!finalPosition) {
              const dx = (e.clientX - ds.startX) / (zoom || 1)
              const dy = (e.clientY - ds.startY) / (zoom || 1)
              finalPosition = { x: ds.originX + dx, y: ds.originY + dy }
            }
            try {
              onPositionChange(ds.id, finalPosition)
            } catch (er) {}

            const pid = dragStateRef.current?.pointerId
            try { console.debug('[card-drag] end (onDragEnd sync)', { id: dragStateRef.current?.id, clientX: e.clientX, clientY: e.clientY, pointerId: (e as any).pointerId }) } catch (er) {}
            onDragEnd?.(pid)
          }
        } catch (err) {
          // swallow errors from consumer
        }

        // release pointer capture if we captured it
        try {
          const ds = dragStateRef.current
          if (ds?.pointerId && ds?.pointerTarget && (ds.pointerTarget as Element)?.releasePointerCapture) {
            try {
              ;(ds.pointerTarget as Element).releasePointerCapture(ds.pointerId)
            } catch (e) {
              // ignore failures
            }
          }
        } catch (e) {
          // ignore
        }

        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
        hasDraggedRef.current = false
        dragStateRef.current = null
        stopAutoPan()
      }

      // try to capture the pointer on the original target (best-effort)
      try {
        const pid = (ev as any).pointerId ?? (ev as any).nativeEvent?.pointerId
        const target = (ev as any).target ?? (ev as any).nativeEvent?.target
        // Prefer capturing on the workspace container if possible so pointer events
        // are delivered in a consistent coordinate space. Fallback to original target.
        const workspaceEl = workspaceRef?.current ?? null
        const targetToUse: Element | null = (workspaceEl as Element) ?? (target as Element | null)
        if (dragStateRef.current) {
          dragStateRef.current.pointerId = pid
          dragStateRef.current.pointerTarget = targetToUse
        }
        if (pid && targetToUse && (targetToUse as Element).setPointerCapture) {
          try {
            ;(targetToUse as Element).setPointerCapture(pid)
          } catch (e) {
            // ignore capture failures
          }
        }
      } catch (e) {
        // ignore
      }

  // Use capture listeners so we receive pointer events even if propagation is stopped
  window.addEventListener('pointermove', handleMove, { capture: true })
  window.addEventListener('pointerup', handleUp, { capture: true })
  window.addEventListener('pointercancel', handleUp, { capture: true })
    },
    [handleDragPointerMove, stopAutoPan]
  )

  useEffect(() => {
    return () => {
      const state = autoPanRef.current
      if (state.raf) {
        cancelAnimationFrame(state.raf)
      }
    }
  }, [])

  return {
    handleDragPointerMove,
    stopAutoPan,
    startCardDrag
  }
}
