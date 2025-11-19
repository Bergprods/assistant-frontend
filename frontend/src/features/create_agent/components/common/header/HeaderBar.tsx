import React from 'react'

export function HeaderBar({ label, accent, Icon, actions }: { label: string; accent: string; Icon?: React.ComponentType<any> | null; actions?: React.ReactNode }) {
  const IconCmp = Icon || null
  return (
    <div
      className="rounded-t-2xl px-6 py-2"
      style={{
        background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: accent }}>
          {label}
        </div>
        {IconCmp ? (
          <div className="rounded-lg bg-black/20 p-1">
            <IconCmp />
          </div>
        ) : null}
      </div>
      {actions}
    </div>
  )
}

export default HeaderBar