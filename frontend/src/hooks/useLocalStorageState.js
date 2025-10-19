import { useState, useEffect, useRef } from 'react'

// Generic persistent state hook with optional revive/serialize
export function useLocalStorageState(key, initialValue, reviveFn) {
  const revive = typeof reviveFn === 'function' ? reviveFn : v => v
  const initialized = useRef(false)
  const [state, setState] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw != null) return revive(JSON.parse(raw))
    } catch {}
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })
  useEffect(() => {
    if (!initialized.current) { initialized.current = true; return }
    try { window.localStorage.setItem(key, JSON.stringify(state)) } catch {}
  }, [key, state])
  return [state, setState]
}
