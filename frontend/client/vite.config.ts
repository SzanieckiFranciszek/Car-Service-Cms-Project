import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // "/api": "http://localhost:8080"
      "/api": "http://host.docker.internal:8080"
    },
    host: true,
    port: 5174
  }, 
  plugins: [react()],
})
