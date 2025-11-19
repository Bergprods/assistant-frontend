import React from 'react'
import { cn } from '../../lib/cn'

type DangerButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function DangerButton({ className = '', type = 'button', children, ...rest }: DangerButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'rounded-full bg-red-500/80 px-4 py-2 text-white transition-colors hover:bg-red-500',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export default DangerButton
