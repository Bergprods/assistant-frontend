import { useState, useCallback } from 'react'

export interface UseZoomOptions {
  min?: number
  max?: number
  step?: number
  initial?: number
}

export function useZoom(options: UseZoomOptions = {}) {
  const { min = 0.5, max = 1.75, step = 0.08, initial = 1 } = options
  const [zoom, setZoom] = useState(initial)

  const setZoomClamped = useCallback((value: number) => {
    setZoom(Math.min(max, Math.max(min, Number(value.toFixed(3)))));
  }, [min, max])

  const zoomIn = useCallback(() => {
    setZoomClamped(zoom + step)
  }, [zoom, step, setZoomClamped])

  const zoomOut = useCallback(() => {
    setZoomClamped(zoom - step)
  }, [zoom, step, setZoomClamped])

  const handleWheel = useCallback((event: React.WheelEvent) => {
    // Optionally prevent default if not passive
    const delta = event.deltaY > 0 ? -step : step
    setZoomClamped(zoom + delta)
  }, [zoom, step, setZoomClamped])

  return {
    zoom,
    setZoom: setZoomClamped,
    zoomIn,
    zoomOut,
    handleWheel,
  }
}
