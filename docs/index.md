---
layout: home
title: Glare
titleTemplate: Touch-first lightbox for the web
---

<DemoHero />

## Any content

Image galleries are the default. Everything else opens the same way: Glare detects the type from the URL, or you set `type` yourself.

<ContentTypes />

## Options, live

Each card runs the call it shows. `slides` is the six frames from the light table.

<OptionRecipes />

## Install

::: code-group

```bash [npm]
npm install @redot-src/glare
```

```js [import]
import Glare from '@redot-src/glare'
import '@redot-src/glare/style.css'

Glare.bind('[data-glare]', { loop: true })
```

```html [markup]
<a data-glare="gallery" href="photo.jpg" data-caption="Hello">
  <img src="thumb.jpg" alt="Hello" />
</a>
```

```html [CDN]
<link rel="stylesheet" href="https://unpkg.com/@redot-src/glare/dist/glare.css" />
<script src="https://unpkg.com/@redot-src/glare/dist/glare.js"></script>
<script>
  Glare.bind('[data-glare]')
</script>
```

:::

Continue with [Getting started](/guide/getting-started) or the [API reference](/api/).

## Keyboard

| Key                             | Action                          |
| ------------------------------- | ------------------------------- |
| <kbd>Esc</kbd>                  | Close                           |
| <kbd>←</kbd> <kbd>→</kbd>       | Previous, next                  |
| <kbd>Space</kbd>                | Start or stop the slideshow     |
| <kbd>F</kbd>                    | Toggle fullscreen               |
| Click                           | Zoom an image                   |
| Drag, pinch                     | Pan and zoom when zoomed in     |
| Swipe                           | Change slide, or pull to close  |

<aside class="credit">

Glare is created by [Redot](https://redot.dev). Building a Laravel app? Redot ships production-ready admin dashboards with auth, roles, CRUD, and datatables.

</aside>
