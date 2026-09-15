# Glare

Modern, touch-enabled lightbox for the web. **Zero dependencies.** MIT licensed.

Created by [Redot](https://redot.dev).

Open images, HTML5 video, YouTube/Vimeo, maps, iframes, inline nodes, AJAX fragments, and custom HTML, with galleries, zoom, thumbnails, slideshow, fullscreen, deep links, and a polished toolbar.

## Features

- **Vanilla JS / TypeScript**, no jQuery, no framework lock-in
- **Galleries** with loop, arrows, keyboard, mouse wheel, and swipe
- **Content types**: image, video, responsive embed, iframe, inline, AJAX, HTML
- **Media helpers** for YouTube, Vimeo, and Google Maps URLs
- **Pinch-zoom and pan**, click-to-zoom, protect mode
- **Thumbnails**, **slideshow**, **fullscreen**, **share**, **hash** deep links
- **Accessible** dialog: focus trap, ARIA, Escape, restored focus
- **Theming** via CSS custom properties
- ESM + UMD builds, full type declarations

## Quick start

```bash
npm install @redot-src/glare
```

```js
import Glare from '@redot-src/glare'
import '@redot-src/glare/style.css'

Glare.bind('[data-glare]', { loop: true })
```

```html
<a data-glare="gallery" href="photo-1.jpg" data-caption="Sunset">
  <img src="photo-1-thumb.jpg" alt="Sunset" />
</a>
<a data-glare="gallery" href="photo-2.jpg">
  <img src="photo-2-thumb.jpg" alt="Trail" />
</a>
```

Or open programmatically:

```js
Glare.open(
  [
    { src: 'a.jpg', caption: 'A' },
    { src: 'b.jpg', caption: 'B' },
  ],
  { loop: true },
  0,
)
```

## CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@redot-src/glare/dist/glare.css" />
<script src="https://unpkg.com/@redot-src/glare/dist/glare.js"></script>
<script>
  Glare.bind('[data-glare]', { loop: true })
</script>
```

## Demo & docs

Docs and live demo: [redot-src.github.io/glare](https://redot-src.github.io/glare/)

## Built by Redot

Glare is created by [Redot](https://redot.dev). Building a Laravel app? [Redot Dashboard](https://redot.dev) is a production-ready admin foundation with auth, roles, CRUD, and datatables — so you ship faster.

## Development

```bash
npm install
npm run dev          # docs + interactive demo with live reload
npm run build        # typecheck + library build → dist/
npm run docs:build   # static site, as deployed to GitHub Pages
```

Inside the docs, `@/` resolves to `src/`, so the demo imports the library the same way users do (`import Glare from '@/index'`).

### Project structure

```
src/
  index.ts        public API and type exports
  esm.ts          ESM build entry: the API plus the stylesheet
  umd.ts          UMD/CDN build entry: exposes the class as window.Glare
  types.ts        public types
  defaults.ts     default options
  i18n.ts         built-in strings
  icons.ts        inline SVG icons
  templates.ts    HTML templates for the dialog and buttons
  core/           the Glare class and its collaborators
    glare.ts        lifecycle, navigation, public API
    dom.ts          building and updating the dialog markup
    loaders.ts      one loader per content type
    interactions.ts clicks, keyboard, focus trap
    animation.ts    open animation and slide-transition settings
    zoom.ts         image zoom and pan maths
    idle.ts         idle timer that hides the controls
    options.ts      merges defaults, mobile overrides, and module shorthands
    registry.ts     stack of open instances
    bind.ts         declarative `Glare.bind()` and hash restore
  media/          URL type detection, providers (YouTube, Vimeo, Maps), item normalization
  modules/        optional features: fullscreen, gestures, hash, share, slideshow, thumbs, wheel
  styles/         stylesheet split by concern; tokens.css holds the public CSS variables
  utils/          small DOM, object, environment, and template helpers
docs/             VitePress site: guides, API reference, and the demo home page
  index.md        the demo page; prose in markdown, interactive parts as components
  .vitepress/
    config.ts       site config and the `@` alias
    theme/
      index.ts        extends the default theme and registers the demo components
      styles/         tokens.css (palette, type) and docs.css (default theme adjustments)
      demo/           content.ts (what the demo shows) and the components that render it
  public/demo/    static files the demo fetches
```

## License

[MIT](./LICENSE)
