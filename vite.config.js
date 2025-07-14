import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: true,
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    allowedHosts: ["4173-iilehiih5lchk102kpvof-c75ee32d.manusvm.computer"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
