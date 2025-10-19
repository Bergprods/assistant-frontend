import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  // If running locally (not in Docker), you can set VITE_BACKEND_URL=http://localhost:8001
  const target = (globalThis as any)?.process?.env?.VITE_BACKEND_URL || 'http://assistant-backend:8000'
  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5174,
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
