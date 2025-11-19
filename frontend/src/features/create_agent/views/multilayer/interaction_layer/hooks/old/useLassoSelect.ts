import { useCallback, useMemo, useState } from 'react'
import type { Point } from '../../../../types'

interface LassoState {
  start: Point
  current: Point
}

export interface LassoBounds {
  x: number
  y: number
  width: number
  height: number
}

interface UseLassoSelectOptions {
  getWorkspacePoint: (clientX: number, clientY: number) => Point
}

export function useLassoSelect({ getWorkspacePoint }: UseLassoSelectOptions) {
  const [lasso, setLasso] = useState<LassoState | null>(null)

  const beginLasso = useCallback(
    (clientX: number, clientY: number) => {
      const point = getWorkspacePoint(clientX, clientY)
      setLasso({ start: point, current: point })
    },
    [getWorkspacePoint]
  )

  const updateLasso = useCallback(
    (clientX: number, clientY: number) => {
      setLasso((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          current: getWorkspacePoint(clientX, clientY)
        }
      })
    },
    [getWorkspacePoint]
  )

  const endLasso = useCallback(() => {
    setLasso(null)
  }, [])

  const bounds = useMemo<LassoBounds | null>(() => {
    if (!lasso) return null
    const minX = Math.min(lasso.start.x, lasso.current.x)
    const minY = Math.min(lasso.start.y, lasso.current.y)
    const maxX = Math.max(lasso.start.x, lasso.current.x)
    const maxY = Math.max(lasso.start.y, lasso.current.y)
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    }
  }, [lasso])

  return {
    isActive: Boolean(lasso),
    beginLasso,
    updateLasso,
    endLasso,
    bounds
  }
}
