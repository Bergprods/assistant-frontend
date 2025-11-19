import React from 'react'
import { cn } from '../../../../../lib/cn'

interface CardFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  x?: number
  y?: number
  width?: number
  height?: number
  accent?: string
}

export function CardFrame({
  x = 0,
  y = 0,
  width = 240,
  height = 218,
  accent = '#3b82f6',
  className,
  style,
  children,
  ...rest
}: CardFrameProps) {
  return (
    <div
      className={cn(
        'agent-workspace-card absolute select-none rounded-2xl text-white backdrop-blur-sm',
        'transition-shadow',
        className,
      )}
      style={{
        left: x,
        top: y,
        width,
        height,
        boxSizing: 'border-box',
        border: `1px solid ${accent}55`,
        background: `linear-gradient(145deg, ${accent}1f, #050b16f0)`,
        boxShadow: `0 16px 38px ${accent}33`,
        ...(style || {}),
      }}
      {...rest}
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl">
        {children}
      </div>
    </div>
  )
}

export default CardFrame