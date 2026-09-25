import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Dominio propio (www.carlosdsp.es): el sitio se sirve desde la raíz,
  // por eso la base es '/'. (Si fuese usuario.github.io/repo, sería '/repo/'.)
  base: '/',
  plugins: [react()],
  resolve: {
    // Alias `@/` -> `src/`, igual que `paths` en tsconfig.app.json (lo
    // espera el código copiado de librerías estilo shadcn, p. ej. animate-ui).
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
