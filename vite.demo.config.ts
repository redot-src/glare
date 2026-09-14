import { copyFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const rootDir = dirname(fileURLToPath(import.meta.url))
const pagesBase = process.env.GITHUB_PAGES === 'true' ? '/glare/' : '/'
const outDir = resolve(rootDir, 'docs/.vitepress/dist/demo')

export default defineConfig({
  root: resolve(rootDir, 'demo'),
  base: `${pagesBase}demo/`,
  build: {
    outDir,
    emptyOutDir: true,
  },
  plugins: [
    {
      name: 'copy-ajax-snippet',
      closeBundle() {
        copyFileSync(resolve(rootDir, 'demo/ajax-snippet.html'), resolve(outDir, 'ajax-snippet.html'))
      },
    },
  ],
})
