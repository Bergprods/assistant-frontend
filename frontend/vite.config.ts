import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  // If running locally (not in Docker), you can set VITE_BACKEND_URL=http://localhost:8001
  const target = (globalThis as any)?.process?.env?.VITE_BACKEND_URL || 'http://assistant-backend:8000'
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@features': path.resolve(__dirname, 'src/features'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@i18n': path.resolve(__dirname, 'src/i18n'),
        '@services': path.resolve(__dirname, 'src/api'),
        '@shared': path.resolve(__dirname, 'src/shared'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api/orchestrator': {
          target,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
  }
})
