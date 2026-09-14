import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type UserConfig } from 'vite'

const root = dirname(fileURLToPath(import.meta.url))
const pagesBase = process.env.GITHUB_PAGES === 'true' ? '/glare/' : '/'

/** ESM build for bundlers, with named exports and one extracted stylesheet. */
const esm: UserConfig = {
  build: {
    lib: {
      entry: resolve(root, 'src/esm.ts'),
      formats: ['es'],
      fileName: () => 'glare.esm.js',
    },
    rollupOptions: {
      output: { assetFileNames: 'glare.[ext]' },
    },
    cssCodeSplit: false,
    sourcemap: true,
    emptyOutDir: true,
  },
}

/** UMD build for <script> / CDN usage; `window.Glare` is the class itself. */
const umd: UserConfig = {
  build: {
    lib: {
      entry: resolve(root, 'src/umd.ts'),
      name: 'Glare',
      formats: ['umd'],
      fileName: () => 'glare.js',
    },
    rollupOptions: {
      output: { assetFileNames: 'glare.[ext]', exports: 'default' },
    },
    cssCodeSplit: false,
    sourcemap: true,
    emptyOutDir: false,
  },
}

/** Demo site: served in dev, and built into the VitePress output for GitHub Pages. */
const demo: UserConfig = {
  root: resolve(root, 'demo'),
  base: `${pagesBase}demo/`,
  build: {
    outDir: resolve(root, 'docs/.vitepress/dist/demo'),
    emptyOutDir: true,
  },
}

const configs: Record<string, UserConfig> = { demo, umd }

export default defineConfig(({ mode }) => configs[mode] ?? esm)
