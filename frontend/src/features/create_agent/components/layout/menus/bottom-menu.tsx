import React, { Dispatch, SetStateAction, useState } from 'react'
import { LayersIcon } from '../../../../components/icons/LayersIcon'
import LlmToolboxCard from '../cards/llm-toolbox-card'

interface BottomMenuCreateAgentProps {
  className?: string
  layersActive: boolean
  setLayersActive: Dispatch<SetStateAction<boolean>>
}

export function BottomMenuCreateAgent({ className = '', layersActive, setLayersActive }: BottomMenuCreateAgentProps) {
  const [activeTab, setActiveTab] = useState<'general'>('general')
  const [expanded, setExpanded] = useState(true)

  return (
    <div
      className={`create-agent-bottom-menu fixed bottom-0 left-[240px] z-50 w-[calc(100%-240px)] ${
        expanded ? 'max-h-[90vh] min-h-[18rem]' : 'h-[5rem]'
      } transition-all duration-300 m-0 p-0 overflow-hidden flex flex-col justify-end ${className}`}
      role="region"
      aria-label="Create Agent bottom menu"
    >
      <div className="w-full bg-[#0b2036] shadow-lg border-t border-[#24405c] flex flex-col m-0 p-0">
        <div className="flex items-center justify-between px-8 pt-2 pb-1 gap-6">
          <div className="flex items-center gap-4 text-[#e6eef8]">
            <span className="text-base font-semibold tracking-wide">Agent Creator</span>
            <span className="text-[#375d82] text-lg">|</span>
            <div className="flex gap-1">
              <button
                className={`px-2 py-1 rounded-t-lg font-medium text-sm text-[#e6eef8] bg-transparent border-b-2 transition-all duration-150 ${
                  activeTab === 'general' ? 'border-[#3778aa]' : 'border-transparent opacity-70'
                }`}
                onClick={() => setActiveTab('general')}
                type="button"
              >
                General
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
        <div className="flex-1 px-8 py-6 bg-[#071726] rounded-b-xl overflow-auto">
          {activeTab === 'general' ? <LlmToolboxCard /> : null}
        </div>
      ) : null}
    </div>
  )
}

export default BottomMenuCreateAgent
