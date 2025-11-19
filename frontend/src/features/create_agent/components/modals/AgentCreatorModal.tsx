import React, { useEffect, useMemo, useState } from 'react'
import { cn } from '../../../../lib/cn'
import type { AgentBlock } from '../../types'

interface AgentCreatorModalProps {
  open?: boolean
  onClose?: () => void
  block: AgentBlock | null
}

export function AgentCreatorModal({ open = false, onClose, block }: AgentCreatorModalProps) {
  const sections = useMemo(
    () => [
      { id: 'overview', label: 'Overview' },
      { id: 'behavior', label: 'Behavior' },
      { id: 'io', label: 'Inputs & Outputs' },
      { id: 'advanced', label: 'Advanced' }
    ],
    []
  )

  const [activeSection, setActiveSection] = useState(sections[0].id)

  useEffect(() => {
    if (open) {
      setActiveSection(sections[0].id)
    }
  }, [open, sections])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-6 py-8">
      <div className="relative flex w-full max-w-5xl h-[80vh] overflow-hidden rounded-[32px] border border-white/10 bg-[#030916] text-white shadow-[0_40px_120px_rgba(0,0,0,.65)]">
        <aside className="w-64 border-r border-white/5 bg-[#050f22] p-6">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Editing</p>
            <p className="mt-2 text-lg font-semibold text-white">{block?.name || block?.label || block?.type}</p>
          </div>
          <nav className="flex flex-col gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={cn(
                  'rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors',
                  activeSection === section.id ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white/80'
                )}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>
        <section className="flex-1 flex flex-col p-8 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/5 pb-5">
            <div>
              <h3 className="text-lg font-semibold">{sections.find((s) => s.id === activeSection)?.label}</h3>
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Agent configuration</p>
            </div>
            <button
              type="button"
              className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-white/70 transition hover:bg-white/10"
              onClick={onClose}
            >
              Close
            </button>
          </div>
          <div className="mt-6 text-sm text-white/70 flex-1">
            <p>
              This is the foundational editor surface for <span className="text-white font-medium">{block?.label || block?.name || 'Agent'}</span>.{' '}
              Use the navigation on the left to access specialized settings for each agent block type. Content for{' '}
              <span className="text-white font-medium">{sections.find((s) => s.id === activeSection)?.label}</span> will live here.
            </p>
            <div className="mt-6 rounded-2xl border border-white/5 bg-white/5 p-4 text-xs text-white/60">
              <p className="font-semibold text-white">Coming next</p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                <li>Render block-type specific forms</li>
                <li>Persist configuration into block state</li>
                <li>Preview runtime capabilities per section</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AgentCreatorModal
