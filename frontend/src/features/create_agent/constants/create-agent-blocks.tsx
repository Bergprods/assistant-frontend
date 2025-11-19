import React from 'react'
import type { ConnectionAnchorType } from '../types'

export interface BlockIconProps {
  color?: string
  className?: string
}

export interface CreateAgentBlock {
  id: string
  label: string
  accent: string
  Icon: React.FC<BlockIconProps> | null
  anchorType?: ConnectionAnchorType
}

export const InputIcon: React.FC<BlockIconProps> = ({ color = '#38bdf8', className = '' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="4" y="8" width="16" height="8" rx="2" stroke={color} strokeWidth="1.6" />
    <path d="M12 4v8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M9 10l3 3 3-3" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const OutputIcon: React.FC<BlockIconProps> = ({ color = '#f472b6', className = '' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="4" y="8" width="16" height="8" rx="2" stroke={color} strokeWidth="1.6" />
    <path d="M12 20v-8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M15 14l-3-3-3 3" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const RouterIcon: React.FC<BlockIconProps> = ({ color = '#3b82f6', className = '' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path d="M4 8h16M9 12h6" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
    <path
      d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="m8 16 4 3 4-3" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const AssistantIcon: React.FC<BlockIconProps> = ({ color = '#8b5cf6', className = '' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M6 7v6a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V7"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.7"
    />
    <path d="M8 5h8M12 17v4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="11" r="2" stroke={color} strokeWidth="1.6" />
  </svg>
)

const ServiceIcon: React.FC<BlockIconProps> = ({ color = '#10b981', className = '' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="4" y="5" width="16" height="5" rx="1.5" stroke={color} strokeWidth="1.6" />
    <rect x="4" y="14" width="16" height="5" rx="1.5" stroke={color} strokeWidth="1.6" />
    <path d="M8 9h.01M8 18h.01M12 9h.01M12 18h.01" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const ToolIcon: React.FC<BlockIconProps> = ({ color = '#f97316', className = '' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M13.6 3.5a4 4 0 0 0 5.9 5.3l-4.7 4.7a3 3 0 0 1-3.7.4l-1.2-1.2a3 3 0 0 1 .4-3.7l4.7-4.7a4 4 0 0 0-1.4-.8Z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="m4.5 19.5 4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6" cy="19.5" r="1.5" fill={color} opacity="0.7" />
  </svg>
)

const AgentIcon: React.FC<BlockIconProps> = ({ color = '#facc15', className = '' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="1.6" opacity="0.85" />
    <path
      d="M6.5 18.5c0-3.6 2.6-5.5 5.5-5.5s5.5 1.9 5.5 5.5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m6 9-3 3 3 3m12-6 3 3-3 3"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.8"
    />
  </svg>
)

const ProviderIcon: React.FC<BlockIconProps> = ({ color = '#06b6d4', className = '' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 3v4m0 10v4m7-7h-4m-6 0H5m13.8-6.2-2.8 2.8m-7 7L6.2 18.8m11.6 0-2.8-2.8m-7-7L6.2 6.2"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.8"
    />
    <circle cx="12" cy="12" r="3.4" stroke={color} strokeWidth="1.6" />
    <circle cx="12" cy="12" r="1.2" fill={color} />
  </svg>
)

export const CREATE_AGENT_BLOCKS: CreateAgentBlock[] = [
  { id: 'input', label: 'Input', accent: '#22c55e', Icon: InputIcon, anchorType: 'output' },
  { id: 'agent', label: 'Agent', accent: '#06b6d4', Icon: ProviderIcon },
  { id: 'memory', label: 'ORCHESTRATOR', accent: '#facc15', Icon: AgentIcon },
  { id: 'router', label: 'Router', accent: '#3b82f6', Icon: RouterIcon },
  { id: 'assistant', label: 'Assistant', accent: '#8b5cf6', Icon: AssistantIcon },
  { id: 'service', label: 'Service', accent: '#10b981', Icon: ServiceIcon },
  { id: 'tool', label: 'Tool', accent: '#f97316', Icon: ToolIcon },
  { id: 'output', label: 'Output', accent: '#ef4444', Icon: OutputIcon, anchorType: 'input' }
]

export const CREATE_AGENT_BLOCK_MAP = CREATE_AGENT_BLOCKS.reduce<Record<string, CreateAgentBlock>>((acc, block) => {
  acc[block.id] = block
  return acc
}, {})
