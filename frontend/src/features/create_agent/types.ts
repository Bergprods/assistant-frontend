export type ConnectionAnchorType = 'input' | 'output'

export interface Point {
  x: number
  y: number
}

export interface AgentBlock {
  id: string
  type: string
  name: string
  x: number
  y: number
}

export interface AgentConnectionEndpoint {
  blockId: string
  type: ConnectionAnchorType
}

export interface AgentConnection {
  id: string
  from: AgentConnectionEndpoint
  to: AgentConnectionEndpoint
}

export interface ActiveConnectionPreview {
  originBlockId: string
  originType: ConnectionAnchorType
  targetType: ConnectionAnchorType
  startPoint: Point
  currentPoint: Point
}

export type CardPointerDownHandler = (
  block: AgentBlock,
  event: PointerEvent | React.PointerEvent<HTMLDivElement> | any,
  opts?: {
    onPositionChange?: (id: string, pos: Point) => void
    getWorkspacePoint?: (x: number, y: number) => Point
    zoom?: number
    onDragEnd?: () => void
  }
) => void

export type AnchorPositionRegistry = Record<
  string,
  Partial<Record<ConnectionAnchorType, Point>>
>

export interface ConnectionState {
  hasInput: boolean
  hasOutput: boolean
}
