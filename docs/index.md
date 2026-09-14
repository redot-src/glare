---
layout: home

hero:
  name: Glare
  text: Modern lightbox for the web
  tagline: Touch-first media lightbox. Zero dependencies. MIT.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Live demo
      link: /demo/
      target: _self
    - theme: alt
      text: API reference
      link: /api/

features:
  - title: Any media
    details: Images, HTML5 video, YouTube, Vimeo, maps, iframes, inline DOM, AJAX, and custom HTML.
  - title: Built for touch
    details: Swipe galleries, pinch-zoom, pan, and keyboard controls that feel native on every device.
  - title: Plug in and theme
    details: Declarative data attributes or a small API. Style everything with CSS variables.
---

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
<a data-glare="gallery" href="photo.jpg" data-caption="Hello">
  <img src="thumb.jpg" alt="Hello" />
</a>
```

Or drop it in from a CDN:

```html
<link rel="stylesheet" href="https://unpkg.com/@redot-src/glare/dist/glare.css" />
<script src="https://unpkg.com/@redot-src/glare/dist/glare.js"></script>
<script>
  Glare.bind('[data-glare]')
</script>
```
