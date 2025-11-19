import { useCallback, useMemo, useState, useRef } from 'react'
import { CREATE_AGENT_BLOCK_MAP } from '../../../../constants/create-agent-blocks'
import { useConnectEdges } from './useConnectEdges'
import { useWorkspaceNavigation } from './useWorkspaceNavigation'
import type {
  AgentBlock,
  AgentConnection,
  AnchorPositionRegistry,
  ConnectionAnchorType,
  Point
} from '../../../../types'

const CARD_SIZE = { width: 240, height: 218 }
const ANCHOR_RADIUS = 8

export function useCreateAgentScene() {
  const [layersActive, setLayersActive] = useState(false)
  const [blocks, setBlocks] = useState<AgentBlock[]>([])
  const [connections, setConnections] = useState<AgentConnection[]>([])
  const [deleteTarget, setDeleteTarget] = useState<AgentBlock | null>(null)
  const [settingsTarget, setSettingsTarget] = useState<AgentBlock | null>(null)
  const [anchorPositions, setAnchorPositions] = useState<AnchorPositionRegistry>({})
  const blockWorkspaceDragRef = useRef(false)

  const createId = useCallback(() => {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  }, [])

  const getAnchorPosition = useCallback(
    (block: AgentBlock, anchorType: ConnectionAnchorType): Point => {
      const horizontal = anchorType === 'input' ? -ANCHOR_RADIUS : CARD_SIZE.width + ANCHOR_RADIUS
      return {
        x: block.x + horizontal,
        y: block.y + CARD_SIZE.height / 2
      }
    },
    []
  )

  const {
    activeConnection,
    connectionMap,
    handleAnchorPointerDown,
    updateActiveConnectionPoint,
    cancelActiveConnection,
    resolveAnchorPoint
  } = useConnectEdges({
    blocks,
    connections,
    setConnections,
    anchorPositions,
    getAnchorPosition,
    createId
  })

  const {
    pan,
    zoom,
    workspaceRef,
    getWorkspacePoint,
    lassoBounds,
    isWorkspaceDragging,
    handlers: workspaceHandlers
  } = useWorkspaceNavigation({
    cancelActiveConnection,
    activeConnection,
    updateActiveConnectionPoint
  })

  const handleBlockPositionChange = useCallback((id: string, nextPosition: Point) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id
          ? {
              ...block,
              x: nextPosition.x,
              y: nextPosition.y
            }
          : block
      )
    )
  }, [])

  const handleBlockNameChange = useCallback((id: string, nextName: string) => {
    setBlocks((prev) => prev.map((block) => (block.id === id ? { ...block, name: nextName } : block)))
  }, [])

  const handleAnchorPositionChange = useCallback((blockId: string, type: ConnectionAnchorType, point: Point) => {
    setAnchorPositions((prev) => {
      const prevEntry = prev[blockId]
      const prevPoint = prevEntry?.[type]
      if (prevPoint && Math.abs(prevPoint.x - point.x) < 0.5 && Math.abs(prevPoint.y - point.y) < 0.5) {
        return prev
      }
      return {
        ...prev,
        [blockId]: {
          ...prevEntry,
          [type]: point
        }
      }
    })
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const data = event.dataTransfer?.getData('application/json')
      if (!data) return
      let payload: { type?: string; tool?: string } | null = null
      try {
        payload = JSON.parse(data)
      } catch {
        return
      }
      if (payload?.type !== 'create-tool' || !payload.tool) return
      const blockMeta = CREATE_AGENT_BLOCK_MAP[payload.tool]
      if (!blockMeta) return
      const rect = workspaceRef.current?.getBoundingClientRect()
      if (!rect) return
      const dropX = ((event.clientX ?? 0) - rect.left - pan.x) / zoom
      const dropY = ((event.clientY ?? 0) - rect.top - pan.y) / zoom
      const x = dropX - CARD_SIZE.width / 2
      const y = dropY - CARD_SIZE.height / 2
      const toolId = payload.tool
      setBlocks((prev) => [
        ...prev,
        {
          id: createId(),
          type: toolId,
          name: `${blockMeta.label} ${prev.filter((b) => b.type === toolId).length + 1}`,
          x,
          y
        }
      ])
    },
    [createId, pan.x, pan.y, zoom]
  )

  const renderConnectionPath = useCallback((start: Point, end: Point) => {
    const deltaX = end.x - start.x
    const deltaY = end.y - start.y
    const horizontalCurve = Math.min(160, Math.max(60, Math.abs(deltaX) * 0.45))
    const c1x = start.x + (deltaX >= 0 ? horizontalCurve : -horizontalCurve)
    const c2x = end.x - (deltaX >= 0 ? horizontalCurve : -horizontalCurve)
    const c1y = start.y + deltaY * 0.35
    const c2y = end.y - deltaY * 0.35
    return `M ${start.x} ${start.y} C ${c1x} ${c1y} ${c2x} ${c2y} ${end.x} ${end.y}`
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return
    setBlocks((prev) => prev.filter((block) => block.id !== deleteTarget.id))
    setConnections((prev) =>
      prev.filter((connection) => connection.from.blockId !== deleteTarget.id && connection.to.blockId !== deleteTarget.id)
    )
    setDeleteTarget(null)
  }, [deleteTarget])

  const handleDeleteCancel = useCallback(() => setDeleteTarget(null), [])

  const resolveAnchorPointMemo = useMemo(() => resolveAnchorPoint, [resolveAnchorPoint])

  return {
    layersActive,
    setLayersActive,
    pan,
    zoom,
    workspaceRef,
    blocks,
    blockWorkspaceDragRef,
    connections,
    connectionMap,
    activeConnection,
    lassoBounds,
    settingsTarget,
    setSettingsTarget,
    deleteTarget,
    setDeleteTarget,
    isWorkspaceDragging,
    handlers: {
      ...workspaceHandlers,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      onBlockPositionChange: handleBlockPositionChange,
      onBlockNameChange: handleBlockNameChange,
      onAnchorPositionChange: handleAnchorPositionChange,
      onAnchorPointerDown: handleAnchorPointerDown
    },
    utilities: {
      getWorkspacePoint,
      renderConnectionPath,
      resolveAnchorPoint: resolveAnchorPointMemo
    },
    deleteActions: {
      confirm: handleDeleteConfirm,
      cancel: handleDeleteCancel
    }
  }
}
