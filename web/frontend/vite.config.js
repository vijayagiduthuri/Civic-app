import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "9d10d379827f.ngrok-free.app", // 👈 your ngrok domain
    ],
  },
})
