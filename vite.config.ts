import { defineConfig } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: '.',
  build: {
    lib: {
      entry: resolve(rootDir, 'src/index.ts'),
      name: 'Glare',
      formats: ['es', 'umd'],
      // ESM for bundlers; plain .js UMD for <script> / CDN
      fileName: (format) => (format === 'es' ? 'glare.esm.js' : 'glare.js'),
    },
    rollupOptions: {
      output: {
        assetFileNames: 'glare.[ext]',
        exports: 'named',
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
    emptyOutDir: true,
    minify: 'esbuild',
  },
  server: {
    open: '/demo/index.html',
  },
})
