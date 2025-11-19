declare module '@i18n' {
  import type { ReactNode } from 'react'

type TranslationVars = Record<string, string | number | boolean>

interface UseI18nResult {
  t: (key: string, vars?: TranslationVars | null, fallback?: string) => string
  lang: string
  setLang: (lang: string) => void
}

  interface I18nProviderProps {
    initial?: string
    children?: ReactNode
  }

  export function useI18n(): UseI18nResult
  export function I18nProvider(props: I18nProviderProps): JSX.Element
}
