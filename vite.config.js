import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Needed for PWA/Mobile testing (exposes to network)
    port: 5173,  // Default port
  }
})
