import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// base: './' keeps asset paths relative, so the site works under /speen-the-wheel/ on GitHub Pages.
export default defineConfig({
  base: './',
  plugins: [preact()],
})
