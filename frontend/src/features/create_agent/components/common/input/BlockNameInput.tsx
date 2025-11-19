import React from 'react'

export function BlockNameInput({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-1 text-sm text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none"
      placeholder="Name"
    />
  )
}

export default BlockNameInput