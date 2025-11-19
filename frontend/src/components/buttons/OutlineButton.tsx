import React from 'react'
import { cn } from '../../lib/cn'

type OutlineButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function OutlineButton({ className = '', type = 'button', children, ...rest }: OutlineButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'rounded-full border border-white/30 px-4 py-2 text-white transition-colors hover:bg-white/10',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export default OutlineButton
