import React from 'react'
import { cn } from '../../../../lib/cn'

interface LlmToolBtnProps {
  label: string
  icon?: React.ReactNode
  accent?: string
  size?: number
  description?: string
  draggable?: boolean
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  onDragStart?: (event: React.DragEvent<HTMLButtonElement>) => void
}

export function LlmToolBtn({
  label,
  icon,
  accent = '#3b82f6',
  size = 88,
  description = '',
  draggable = true,
  className = '',
  onClick,
  onDragStart
}: LlmToolBtnProps) {
  const dimension = `${size}px`

  return (
    <button
      type="button"
      className={cn(
        'tool-btn group relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#101c2b] bg-[#040a13] px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-[#d5e2fb] transition-all duration-200 hover:-translate-y-1 hover:border-[#4b91ff] hover:text-white hover:shadow-[0_8px_18px_rgba(18,65,120,.45)]',
        className
      )}
      style={{ width: dimension, height: dimension }}
      title={description || `Skapa ${label}`}
      draggable={draggable}
      onDragStart={(event) => {
        if (!draggable) return
        event.dataTransfer.effectAllowed = 'copy'
        onDragStart?.(event)
      }}
      onClick={onClick}
      aria-label={description || label}
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#0d1827] bg-[#071021] text-white shadow-[0_0_12px_rgba(0,0,0,.45)] transition-transform duration-200 group-hover:scale-105"
        style={{
          background: `linear-gradient(150deg, ${accent}, #0b1524)`
        }}
      >
        {icon ?? label?.[0]}
      </span>
      <span className="text-[10px] leading-tight text-center">{label}</span>
      <span className="pointer-events-none absolute -bottom-1 text-[7px] font-semibold uppercase tracking-[0.3em] text-[#7daeff] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        Drag
      </span>
    </button>
  )
}

export default LlmToolBtn
