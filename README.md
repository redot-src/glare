# Glare

A lightbox for the web that opens anything: images, video, YouTube and Vimeo, maps, iframes, nodes from the page, fetched fragments, and plain HTML. Vanilla TypeScript, zero dependencies, MIT.

**[Docs and live demo →](https://redot-src.github.io/glare/)**

## Why Glare

Most lightboxes were built for one job, images, and everything else got bolted on: a jQuery dependency here, a video plugin there, a second library for touch gestures. Glare starts from the other end. It is one small class with a single way to describe a slide, and the slide can be any kind of content.

- **One API for every content type.** Point it at a URL and it works out whether that is an image, a video, a YouTube watch page, or a PDF. Set `type` for the cases it cannot guess.
- **Touch-first.** Swipe to change slides, swipe down to close, pinch to zoom, drag to pan. Mouse and keyboard get the same behavior.
- **Accessible by default.** A real `role="dialog"`, focus trap, restored focus on close, slide announcements in a live region, translatable labels, and `prefers-reduced-motion` support.
- **Yours to style.** Colors, radius, blur, and fonts are CSS variables. State classes cover every mode. Every piece of markup is a template you can replace.
- **Small and dependency-free.** About 16 kB of JavaScript and 3 kB of CSS, gzipped. No jQuery, no framework, no peer dependencies.
- **Typed.** Written in TypeScript, shipped as ESM and UMD with declaration files.

## What it does

| Feature      | Details                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------- |
| Galleries    | Group links with `data-glare="name"`, or pass an array. Loop, arrows, counter, captions. |
| Content      | `image`, `video`, `embed`, `iframe`, `inline`, `ajax`, `html`. Providers for YouTube, Vimeo, Google Maps. |
| Zoom         | Click or pinch to zoom, drag to pan, mouse wheel to change slides.                       |
| Modules      | Thumbnail strip, slideshow with progress bar, fullscreen, share overlay, URL hash deep links. |
| Toolbar      | Configurable buttons that collapse into a menu on small screens.                        |
| Events       | Lifecycle and per-slide callbacks; `beforeClose` can cancel.                             |

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
<a data-glare="trip" href="lake.jpg" data-caption="Alpine lake at dusk">
  <img src="lake-thumb.jpg" alt="Alpine lake at dusk" />
</a>
<a data-glare="trip" href="https://www.youtube.com/watch?v=XXXXXXXXXXX">
  <img src="video-thumb.jpg" alt="Trip video" />
</a>
```

Or from code:

```js
Glare.open([{ src: 'lake.jpg', caption: 'Alpine lake at dusk' }, { src: 'dunes.jpg' }], { loop: true })
```

No bundler? Load it from a CDN and use the global `Glare`:

```html
<link rel="stylesheet" href="https://unpkg.com/@redot-src/glare/dist/glare.css" />
<script src="https://unpkg.com/@redot-src/glare/dist/glare.js"></script>
```

The [Getting started](https://redot-src.github.io/glare/guide/getting-started.html) guide continues from here.

## Built by Redot

Glare is created by [Redot](https://redot.dev). Building a Laravel app? Redot ships production-ready admin dashboards with auth, roles, CRUD, and datatables.

## Development

```bash
npm install
npm run dev          # docs + interactive demo with live reload
npm run build        # typecheck + library build → dist/
npm run docs:build   # static site, as deployed to GitHub Pages
```

Inside the docs, `@/` resolves to `src/`, so the demo imports the library the same way users do.

```
src/
  index.ts        public API and type exports
  esm.ts          ESM build entry: the API plus the stylesheet
  umd.ts          UMD/CDN build entry: exposes the class as window.Glare
  types.ts        public types
  defaults.ts     default options
  i18n.ts         built-in strings
  templates.ts    HTML templates for the dialog and buttons
  core/           the Glare class and its collaborators (lifecycle, DOM, loaders, zoom, bind)
  media/          URL type detection, providers (YouTube, Vimeo, Maps), item normalization
  modules/        optional features: fullscreen, gestures, hash, share, slideshow, thumbs, wheel
  styles/         stylesheet split by concern; tokens.css holds the public CSS variables
  utils/          small DOM, object, environment, and template helpers
docs/
  index.md        the demo page: prose in markdown, interactive parts as components
  guide/, api/    documentation
  .vitepress/
    config.ts       site config and the `@` alias
    theme/          restyled default theme; demo/ holds the demo data and components
  public/demo/    static files the demo fetches
```

## License

[MIT](./LICENSE)
