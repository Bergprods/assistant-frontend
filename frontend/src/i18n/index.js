import React, { createContext, useContext, useState, useMemo, useCallback } from 'react'
import sv from './sv.json'
import en from './en.json'

const dictionaries = { sv, en }

const I18nContext = createContext({ t: (k, vars) => k, lang: 'sv', setLang: () => {} })

function interpolate(str, vars) {
  if (!vars) return str
  return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`))
}

export function I18nProvider({ initial = 'sv', children }) {
  const [lang, setLang] = useState(initial)
  const dict = dictionaries[lang] || dictionaries.sv
  const t = useCallback((key, arg1, arg2) => {
    const hasVars = arg1 && typeof arg1 === 'object' && !Array.isArray(arg1)
    const vars = hasVars ? arg1 : undefined
    const fallback = hasVars ? (typeof arg2 === 'string' ? arg2 : undefined) : typeof arg1 === 'string' ? arg1 : undefined
    const template = dict[key] || fallback || key
    return interpolate(template, vars)
  }, [dict])
  const value = useMemo(() => ({ t, lang, setLang }), [t, lang])
  return React.createElement(I18nContext.Provider, { value }, children)
}

export function useI18n() { return useContext(I18nContext) }
