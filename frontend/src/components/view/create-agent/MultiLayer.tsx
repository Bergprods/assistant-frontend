import React from 'react'

// Multilayer view: horizontal lines for each layer, cards can be placed on each line
export default function MultiLayer({ layers = 4, className = '', style = {} }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none z-40 ${className}`}
      style={{ ...style }}
    >
      <div className="w-full h-full relative">
        {[...Array(layers)].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 w-full"
            style={{
              top: `${((i + 1) / (layers + 1)) * 100}%`,
              borderTop: '2px dashed #24405c',
              opacity: 0.7,
            }}
          >
            {/* Optionally, add a label for each layer */}
            {/* <span className="absolute left-2 -top-4 text-xs text-[#7d92b0]">Layer {i + 1}</span> */}
          </div>
        ))}
      </div>
    </div>
  )
}
