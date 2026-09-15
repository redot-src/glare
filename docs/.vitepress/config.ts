import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

// The site is served from the custom domain glare.redot.dev, at the root.
const isGitHubPages = process.env.GITHUB_PAGES === 'true'
const base = '/'

// Archivo (display), IBM Plex Sans (body), IBM Plex Mono (code and labels).
const fontsHref =
  'https://fonts.googleapis.com/css2' +
  '?family=Archivo:wdth,wght@112..125,500..700' +
  '&family=IBM+Plex+Sans:wght@400;500;600' +
  '&family=IBM+Plex+Mono:wght@400;500' +
  '&display=swap'

export default defineConfig({
  title: 'Glare',
  description: 'Modern, touch-enabled lightbox for the web — zero dependencies.',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: fontsHref }],
  ],
  // GitHub Pages has no extensionless-URL rewrite, so production links keep `.html`.
  cleanUrls: !isGitHubPages,
  base,
  vite: {
    resolve: {
      // `@/…` points at the library source, so the demo imports what users import.
      alias: { '@': resolve(repoRoot, 'src') },
    },
    define: {
      __GLARE_VERSION__: JSON.stringify(version),
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Demo', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Galleries', link: '/guide/galleries' },
          { text: 'Content types', link: '/guide/content-types' },
          { text: 'Options', link: '/guide/options' },
          { text: 'Toolbar & UI', link: '/guide/toolbar' },
          { text: 'Gestures & zoom', link: '/guide/gestures' },
          { text: 'Modules', link: '/guide/modules' },
          { text: 'Events', link: '/guide/events' },
          { text: 'Styling', link: '/guide/styling' },
          { text: 'Accessibility', link: '/guide/accessibility' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'Overview', link: '/api/' },
          { text: 'Glare', link: '/api/glare' },
          { text: 'Instance', link: '/api/instance' },
          { text: 'Types', link: '/api/types' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/redot-src/glare' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright:
        'Created by <a href="https://redot.dev" target="_blank" rel="noopener noreferrer">Redot</a>',
    },
    search: { provider: 'local' },
  },
})
