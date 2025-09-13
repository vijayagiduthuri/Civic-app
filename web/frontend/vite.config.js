import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "5af9d72431a4.ngrok-free.app", // 👈 your ngrok domain
    ],
  },
})
