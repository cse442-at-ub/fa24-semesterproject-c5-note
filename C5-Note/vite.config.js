import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/CSE442/2024-Fall/cmolkows/", //"/CSE442/2024-Fall/cse-442al/", // /CSE442/2024-Fall/amarteag/
  plugins: [react()],
})
