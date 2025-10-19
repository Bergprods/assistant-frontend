require('ts-node').register({
  transpileOnly: true,
})

const { DESIGN_TOKENS } = require('./src/shared/theme/tokens.ts')

const spacing = Object.fromEntries(
  Object.entries(DESIGN_TOKENS.spacing).map(([key, value]) => [key, value])
)

const borderRadius = Object.fromEntries(
  Object.entries(DESIGN_TOKENS.radius).map(([key, value]) => [key, value])
)

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: DESIGN_TOKENS.colors.surface,
        text: DESIGN_TOKENS.colors.text,
        accent: DESIGN_TOKENS.colors.accent,
        border: DESIGN_TOKENS.colors.border,
      },
      spacing,
      borderRadius,
      boxShadow: DESIGN_TOKENS.shadow,
      fontFamily: DESIGN_TOKENS.fontFamily,
    },
  },
  plugins: [],
}
