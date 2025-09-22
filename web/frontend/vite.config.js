import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "f7ebf807dc0d.ngrok-free.app", // 👈 your ngrok domain
    ],
  },
})
