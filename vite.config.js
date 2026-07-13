import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Separa o build do frontend do build do backend (TypeScript → dist/)
    outDir: 'dist/public',
    emptyOutDir: true,
  },
  server: {
    // Em desenvolvimento, redireciona chamadas /api para o Express (porta 3000)
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
