import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the static build works on any host or sub-path
  // (GitHub Pages project sites, Netlify, Vercel, Cloudflare Pages, ...).
  base: './',
  plugins: [react(), tailwindcss()],
})
