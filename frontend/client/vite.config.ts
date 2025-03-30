import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  server: {
    // proxy: {
    //   // "/api": "http://localhost:8080"
    //   "/api": "http://host.docker.internal:8080"
    // },
    host: true,
    port: 5174,
    watch: {
      usePolling: true
    }
  }, 
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
    },
  }
})
