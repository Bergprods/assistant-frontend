import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Proxy '/router/*' calls in dev to the backend service (works inside docker-compose)
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@i18n': path.resolve(__dirname, 'src/i18n'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@services': path.resolve(__dirname, 'src/api')
    }
  },
  server: {
    port: 5173,
    proxy: {
      // forward API calls to the backend service name inside the compose network
      '/router': {
        target: 'http://router-gpt:8000',
        changeOrigin: true,
        secure: false,
        ws: false,
      },
      '/ha': {
        target: 'http://router-gpt:8000',
        changeOrigin: true,
        secure: false,
      },
      '/tasks': {
        target: 'http://router-gpt:8000',
        changeOrigin: true,
        secure: false,
      },
      '/events': {
        target: 'http://router-gpt:8000',
        changeOrigin: true,
        secure: false,
      },
      '/agents': {
        target: 'http://agents-connector:8700',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

