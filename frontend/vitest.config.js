import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    globals: true
  },
  resolve: {
    alias: {
      '@hooks': path.resolve(__dirname,'src/hooks'),
      '@utils': path.resolve(__dirname,'src/utils'),
      '@i18n': path.resolve(__dirname,'src/i18n'),
      '@features': path.resolve(__dirname,'src/features'),
      '@shared': path.resolve(__dirname,'src/shared'),
      '@services': path.resolve(__dirname,'src/api'),
    }
  }
})

