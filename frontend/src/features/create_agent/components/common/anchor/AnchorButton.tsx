import React from 'react'
import { cn } from '../../../../../lib/cn'

export type AnchorKind = 'input' | 'output'

interface AnchorButtonProps {
  kind: AnchorKind
  label: string
  className?: string
  onPointerDown?: (e: React.PointerEvent<HTMLButtonElement>) => void
  dotRef?: React.RefObject<HTMLSpanElement>
  active?: boolean
  highlight?: boolean
}

export function AnchorButton({ kind, label, className, onPointerDown, dotRef, active, highlight }: AnchorButtonProps) {
  const isInput = kind === 'input'
  const posClass = isInput
    ? 'absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2'
    : 'absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2'
  return (
    <button
      type="button"
      className={cn(
        posClass,
        'z-10 flex flex-col items-center text-[9px] font-semibold uppercase tracking-[0.35em] text-[#7d92b0]',
        className
      )}
      onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onPointerDown?.(e) }}
    >
      <span
        ref={dotRef as any}
        className={cn(
          'h-4 w-4 rounded-full border transition-all shadow-[0_0_12px_rgba(99,126,255,.45)]',
          active ? (isInput ? 'border-green-300 bg-green-300/70' : 'border-red-300 bg-red-300/70') : (highlight ? 'border-[#6d96ff] bg-[#6d96ff]/40' : 'border-white/40 bg-white/15')
        )}
      />
      <span className="mt-1">{label}</span>
    </button>
  )
}

export default AnchorButton