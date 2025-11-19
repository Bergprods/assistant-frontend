import React, { Dispatch, SetStateAction, useState } from 'react'
import { LayersIcon } from '../../../../../components/icons/LayersIcon'
import LlmToolboxCard from '../../cards/llm-toolbox-card'
import { setDraggingCardType } from '../../../views/multilayer/interaction_layer/state/dragState'
interface TopMenuCreateAgentProps {
  className?: string
  layersActive: boolean
  setLayersActive: Dispatch<SetStateAction<boolean>>
}
export function TopMenuCreateAgent({ className = '', layersActive, setLayersActive }: TopMenuCreateAgentProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'tools' | 'settings'>('general')
  const [expanded, setExpanded] = useState(true)
  const CARD_TYPES = [
    { type: "INPUT", label: "INPUT", color: "#22c55e", icon: <span>INPUT</span> },
    { type: "AGENT", label: "AGENT", color: "#38bdf8", icon: <span>AGENT</span> },
    { type: "ORCHESTRATOR", label: "ORCHESTRATOR", color: "#facc15", icon: <span>ORCHESTRATOR</span> },
    { type: "ROUTER", label: "ROUTER", color: "#2563eb", icon: <span>ROUTER</span> },
    { type: "ASSISTANT", label: "ASSISTANT", color: "#a78bfa", icon: <span>ASSISTANT</span> },
    { type: "SERVICE", label: "SERVICE", color: "#14b8a6", icon: <span>SERVICE</span> },
    { type: "TOOL", label: "TOOL", color: "#fb923c", icon: <span>TOOL</span> },
    { type: "OUTPUT", label: "OUTPUT", color: "#ef4444", icon: <span>OUTPUT</span> },
  ]
  return (
    <div
      className={`create-agent-top-menu fixed top-0 left-[240px] z-50 w-[calc(100%-240px)] transition-all duration-300 m-0 p-0 flex flex-col justify-start ${className}`}
      role="region"
      aria-label="Create Agent top menu"
    >
      <div className="w-full bg-[#0b2036] shadow-lg border-b border-[#24405c] flex flex-col m-0 p-0">
        <div className="flex items-center justify-between px-8 pt-2 pb-1 gap-6">
          <div className="flex items-center gap-4 text-[#e6eef8]">
            <span className="text-base font-semibold tracking-wide">Agent Creator</span>
            <span className="text-[#375d82] text-lg">|</span>
            <div className="flex gap-1">
              <button
                className={`px-2 py-1 rounded-b-lg font-medium text-sm text-[#e6eef8] bg-transparent border-t-2 transition-all duration-150 ${
                  activeTab === 'general' ? 'border-[#3778aa]' : 'border-transparent opacity-70'
                }`}
                onClick={() => setActiveTab('general')}
                type="button"
              >
                General
              </button>
              <button
                className={`px-2 py-1 rounded-b-lg font-medium text-sm text-[#e6eef8] bg-transparent border-t-2 transition-all duration-150 ${
                  activeTab === 'tools' ? 'border-[#3778aa]' : 'border-transparent opacity-70'
                }`}
                onClick={() => setActiveTab('tools')}
                type="button"
              >
                Tools
              </button>
              <button
                className={`px-2 py-1 rounded-b-lg font-medium text-sm text-[#e6eef8] bg-transparent border-t-2 transition-all duration-150 ${
                  activeTab === 'settings' ? 'border-[#3778aa]' : 'border-transparent opacity-70'
                }`}
                onClick={() => setActiveTab('settings')}
                type="button"
              >
                Settings
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`px-2 py-1 text-xs bg-transparent rounded group ${
                layersActive ? 'shadow-[0_0_16px_#7d92b0] text-[#b5eaff]' : ''
              }`}
              aria-label="Visa lager"
              onClick={() => setLayersActive((prev) => !prev)}
              type="button"
            >
              <LayersIcon
                className={`w-6 h-6 transition-shadow ${
                  layersActive
                    ? 'text-[#b5eaff] shadow-[0_0_16px_#7d92b0]'
                    : 'text-[#7d92b0] group-hover:text-[#b5eaff] group-hover:shadow-[0_0_12px_#7d92b0]'
                }`}
              />
            </button>
            <button
              className="px-2 py-1 text-xs text-[#b5c7db] bg-[#071726] rounded hover:bg-[#24405c] transition-all duration-150"
              onClick={() => setExpanded((prev) => !prev)}
              aria-label={expanded ? 'Fäll ihop meny' : 'Expandera meny'}
              type="button"
            >
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>
      </div>
      {expanded ? (
        <div className="flex-1 px-8 py-6 bg-[#071726] rounded-t-xl overflow-auto">
          {activeTab === 'tools' }
          {activeTab === 'general' ? <LlmToolboxCard /> : null}
        </div>
      ) : null}
    </div>
  )
}
export default TopMenuCreateAgent
