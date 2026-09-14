import { defineConfig } from 'vitepress'

const isGitHubPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  title: 'Glare',
  description: 'Modern, touch-enabled lightbox for the web — zero dependencies.',
  // GitHub Pages has no extensionless-URL rewrite, so production links keep `.html`.
  cleanUrls: !isGitHubPages,
  base: isGitHubPages ? '/glare/' : '/',
  ignoreDeadLinks: ['/demo', '/demo/'],
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/' },
      { text: 'Demo', link: '/demo/', target: '_self' },
      { text: 'GitHub', link: 'https://github.com/redot-src/glare' },
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
    socialLinks: [
      { icon: 'github', link: 'https://github.com/redot-src/glare' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © Glare Contributors',
    },
    search: {
      provider: 'local',
    },
  },
})
