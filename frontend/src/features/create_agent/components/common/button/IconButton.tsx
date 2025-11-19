import React from 'react'
import { cn } from '../../../../../lib/cn'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'settings' | 'delete'
}

export function IconButton({ variant = 'settings', className, onPointerDown, ...rest }: IconButtonProps) {
  const base = 'flex h-9 w-9 items-center justify-center rounded-full text-xs transition-colors'
  const variants = {
    settings: 'bg-sky-500/20 text-sky-200 hover:bg-sky-500/35',
    delete: 'bg-red-500/20 text-red-200 hover:bg-red-500/35',
  }
  return (
    <button
      type="button"
      className={cn(base, variants[variant], className)}
      onPointerDown={(e) => { e.stopPropagation(); onPointerDown?.(e) }}
      {...rest}
    >
      {variant === 'settings' ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m19.4 15-.7 1.8a1 1 0 0 1-1.3.6l-1.2-.5a6.3 6.3 0 0 1-1.5.9l-.2 1.3a1 1 0 0 1-1 .8h-2a1 1 0 0 1-1-.8l-.2-1.3a6.3 6.3 0 0 1-1.4-.9l-1.3.5a1 1 0 0 1-1.3-.6l-.7-1.8a1 1 0 0 1 .4-1.3l1.1-.8a5.7 5.7 0 0 1 0-1.8l-1-.7a1 1 0 0 1-.5-1.3l.6-1.9a1 1 0 0 1 1.3-.6l1.2.5a6.3 6.3 0 0 1 1.5-.9l.2-1.3a1 1 0 0 1 1-.8h2a1 1 0 0 1 1 .8l.2 1.3a6.3 6.3 0 0 1 1.4.9l1.3-.5a1 1 0 0 1 1.3.6l.7 1.8a1 1 0 0 1-.4 1.3l-1.1.8a5.7 5.7 0 0 1 0 1.8l1 .7a1 1 0 0 1 .5 1.3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M6 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 7v-.8A1.2 1.2 0 0 1 10.2 5h3.6A1.2 1.2 0 0 1 15 6.2V7m2 0v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7h10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 11v5m4-5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

export default IconButton