import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4004',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // Add specific proxy for your logo upload endpoint
      '/admin': {
        target: 'http://localhost:4004',
        changeOrigin: true,
        secure: false
      }
    }
  }
})