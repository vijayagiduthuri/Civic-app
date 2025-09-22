import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "a08e34c1b201.ngrok-free.app", // 👈 your ngrok domain
    ],
  },
})
