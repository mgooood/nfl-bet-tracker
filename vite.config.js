import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages project pages, set base to the repository name.
// If your repo is username.github.io, you can remove the base option.
export default defineConfig({
  base: '/nfl-bet-tracker/',
  plugins: [react()],
})
