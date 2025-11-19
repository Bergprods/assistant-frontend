import { useCallback, useLayoutEffect, useRef } from 'react'
import type { AgentBlock, ConnectionAnchorType, Point } from '../../../../types'

interface UseAnchorPositionsOptions {
  block: AgentBlock
  getWorkspacePoint?: (clientX: number, clientY: number) => Point
  onAnchorPositionChange?: (blockId: string, type: ConnectionAnchorType, point: Point) => void
}

export function useAnchorPositions({ block, getWorkspacePoint, onAnchorPositionChange }: UseAnchorPositionsOptions) {
  const inputRef = useRef<HTMLSpanElement | null>(null)
  const outputRef = useRef<HTMLSpanElement | null>(null)

  const report = useCallback(() => {
    if (!getWorkspacePoint || !onAnchorPositionChange) return
    const anchors: Array<[ConnectionAnchorType, HTMLSpanElement | null]> = [
      ['input', inputRef.current],
      ['output', outputRef.current]
    ]
    anchors.forEach(([type, element]) => {
      if (!element) return
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const point = getWorkspacePoint(centerX, centerY)
      onAnchorPositionChange(block.id, type, point)
    })
  }, [block.id, getWorkspacePoint, onAnchorPositionChange])

  useLayoutEffect(() => {
    report()
  }, [report])

  return {
    inputRef,
    outputRef,
    report
  }
}
