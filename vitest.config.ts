import { defineConfig } from 'vitest/config'

// Kept separate from vite.config.ts so Vitest's bundled Vite types don't clash
// with the app's Vite version. The game logic is pure, so no plugins are needed.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
