import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "0140cafbaff7.ngrok-free.app", // 👈 your ngrok domain
    ],
  },
})
