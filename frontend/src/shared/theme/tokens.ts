export const DESIGN_TOKENS = {
  colors: {
    surface: {
      base: '#071820',
      raised: '#0b1d27',
      highlight: '#133142',
    },
    text: {
      primary: '#f6fbff',
      secondary: '#cfe8ff',
      muted: '#8ea5b9',
    },
    accent: {
      primary: '#3995ff',
      success: '#2ecc71',
      warning: '#f2c94c',
      danger: '#ff5f73',
    },
    border: {
      subtle: '#1f3a4b',
      strong: '#23485c',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
  },
  radius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '999px',
  },
  fontFamily: {
    sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
    mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', '"Roboto Mono"', 'monospace'],
  },
  shadow: {
    card: '0 10px 30px rgba(7, 24, 32, 0.35)',
    focus: '0 0 0 3px rgba(57, 149, 255, 0.35)',
  },
} as const

export type DesignTokens = typeof DESIGN_TOKENS

export default DESIGN_TOKENS
