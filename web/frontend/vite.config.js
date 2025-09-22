import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "73f491195a7b.ngrok-free.app", // 👈 your ngrok domain
    ],
  },
})
