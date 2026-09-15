import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type UserConfig } from 'vite'

// Library builds only. The docs and demo site is built by VitePress (see docs/.vitepress/config.ts).
const root = dirname(fileURLToPath(import.meta.url))

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

export default defineConfig(({ mode }) => (mode === 'umd' ? umd : esm))
