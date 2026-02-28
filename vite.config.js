import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ganti '/kalkulator-kriptografi/' dengan nama repositori GitHub milikmu yang sebenarnya!
  // Jangan lupa awalan dan akhiran garis miring (slash)
  base: '/kalkulator-kriptografi/', 
})