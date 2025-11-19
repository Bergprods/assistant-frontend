import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import type {
  ActiveConnectionPreview,
  AgentBlock,
  AgentConnection,
  AnchorPositionRegistry,
  ConnectionAnchorType,
  ConnectionState,
  Point
} from '../../../../types'

interface UseConnectEdgesOptions {
  blocks: AgentBlock[]
  connections: AgentConnection[]
  setConnections: Dispatch<SetStateAction<AgentConnection[]>>
  anchorPositions: AnchorPositionRegistry
  getAnchorPosition: (block: AgentBlock, type: ConnectionAnchorType) => Point | null
  createId: () => string
}

export function useConnectEdges({
  blocks,
  connections,
  setConnections,
  anchorPositions,
  getAnchorPosition,
  createId
}: UseConnectEdgesOptions) {
  const [activeConnection, setActiveConnection] = useState<ActiveConnectionPreview | null>(null)

  const resolveAnchorPoint = useCallback(
    (blockId: string, type: ConnectionAnchorType) => {
      const stored = anchorPositions[blockId]?.[type]
      if (stored) return stored
      const block = blocks.find((candidate) => candidate.id === blockId)
      if (!block) return null
      return getAnchorPosition(block, type)
    },
    [anchorPositions, blocks, getAnchorPosition]
  )

  const handleAnchorPointerDown = useCallback(
    (block: AgentBlock, type: ConnectionAnchorType) => {
      const anchorPoint = resolveAnchorPoint(block.id, type) || getAnchorPosition(block, type)
      if (!anchorPoint) return

      const existingConnection = connections.find(
        (connection) =>
          (connection.from.blockId === block.id && connection.from.type === type) ||
          (connection.to.blockId === block.id && connection.to.type === type)
      )

      if (existingConnection) {
        setConnections((prev) => prev.filter((connection) => connection.id !== existingConnection.id))
        const fixedEndpoint =
          existingConnection.from.blockId === block.id && existingConnection.from.type === type
            ? existingConnection.to
            : existingConnection.from
        const fixedPoint =
          resolveAnchorPoint(fixedEndpoint.blockId, fixedEndpoint.type) ||
          (() => {
            const fixedBlock = blocks.find((candidate) => candidate.id === fixedEndpoint.blockId)
            return fixedBlock ? getAnchorPosition(fixedBlock, fixedEndpoint.type) : null
          })()
        if (!fixedPoint) return
        setActiveConnection({
          originBlockId: fixedEndpoint.blockId,
          originType: fixedEndpoint.type,
          targetType: fixedEndpoint.type === 'input' ? 'output' : 'input',
          startPoint: fixedPoint,
          currentPoint: anchorPoint
        })
        return
      }

      setActiveConnection((prev) => {
        if (!prev) {
          return {
            originBlockId: block.id,
            originType: type,
            targetType: type === 'input' ? 'output' : 'input',
            startPoint: anchorPoint,
            currentPoint: anchorPoint
          }
        }

        if (type !== prev.targetType || block.id === prev.originBlockId) {
          return null
        }

        setConnections((existing) => {
          const filtered = existing.filter(
            (connection) =>
              !(
                (connection.from.blockId === prev.originBlockId && connection.from.type === prev.originType) ||
                (connection.to.blockId === prev.originBlockId && connection.to.type === prev.originType) ||
                (connection.from.blockId === block.id && connection.from.type === type) ||
                (connection.to.blockId === block.id && connection.to.type === type)
              )
          )
          return [
            ...filtered,
            {
              id: createId(),
              from: { blockId: prev.originBlockId, type: prev.originType },
              to: { blockId: block.id, type }
            }
          ]
        })

        return null
      })
    },
    [blocks, connections, createId, getAnchorPosition, resolveAnchorPoint, setConnections]
  )

  const updateActiveConnectionPoint = useCallback((point: Point) => {
    setActiveConnection((prev) => (prev ? { ...prev, currentPoint: point } : prev))
  }, [])

  const cancelActiveConnection = useCallback(() => {
    setActiveConnection(null)
  }, [])

  const connectionMap = useMemo(() => {
    const map = new Map<string, ConnectionState>()
    connections.forEach((connection) => {
      const fromEntry = map.get(connection.from.blockId) || { hasInput: false, hasOutput: false }
      if (connection.from.type === 'output') {
        fromEntry.hasOutput = true
      } else {
        fromEntry.hasInput = true
      }
      map.set(connection.from.blockId, fromEntry)

      const toEntry = map.get(connection.to.blockId) || { hasInput: false, hasOutput: false }
      if (connection.to.type === 'input') {
        toEntry.hasInput = true
      } else {
        toEntry.hasOutput = true
      }
      map.set(connection.to.blockId, toEntry)
    })
    return map
  }, [connections])

  return {
    activeConnection,
    connectionMap,
    handleAnchorPointerDown,
    updateActiveConnectionPoint,
    cancelActiveConnection,
    resolveAnchorPoint
  }
}
