# Glare

Modern, touch-enabled lightbox for the web. **Zero dependencies.** MIT licensed.

Open images, HTML5 video, YouTube/Vimeo, maps, iframes, inline nodes, AJAX fragments, and custom HTML — with galleries, zoom, thumbnails, slideshow, fullscreen, deep links, and a polished toolbar.

## Features

- **Vanilla JS / TypeScript** — no jQuery, no framework lock-in
- **Galleries** with loop, arrows, keyboard, mouse wheel, and swipe
- **Content types**: image, video, iframe, inline, AJAX, HTML
- **Media helpers** for YouTube, Vimeo, and Google Maps URLs
- **Pinch-zoom & pan**, click-to-zoom, protect mode
- **Thumbnails**, **slideshow**, **fullscreen**, **share**, **hash** deep-linking
- **Accessible** dialog: focus trap, ARIA, Escape, restored focus
- **Theming** via CSS custom properties
- ESM + UMD builds, full type declarations

## Quick start

```bash
npm install glare
```

```js
import Glare from 'glare'
import 'glare/style.css'

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
<link rel="stylesheet" href="https://unpkg.com/glare/dist/glare.css" />
<script src="https://unpkg.com/glare/dist/glare.js"></script>
<script>
  Glare.bind('[data-glare]', { loop: true })
</script>
```

## Demo & docs

Repository: [github.com/redot-src/glare](https://github.com/redot-src/glare)

```bash
npm install
npm run dev          # interactive demo
npm run docs:dev     # VitePress documentation
npm run build        # library build → dist/
```

## License

[MIT](./LICENSE)
