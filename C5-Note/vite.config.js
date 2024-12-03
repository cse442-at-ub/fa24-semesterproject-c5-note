import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base:"/CSE442/2024-Fall/cse442al/", // /CSE442/2024-Fall/amarteag/ || /CSE442/2024-Fall/cse-442al/
  plugins: [react()],
})
