import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Set base to '/' for custom domain or '/<repo-name>/' for GitHub Pages
// e.g. '/rabih-driving-school/' if that's your repo name
export default defineConfig({
  plugins: [vue()],
  base: '/school/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
  },
})
