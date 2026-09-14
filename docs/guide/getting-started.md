# Getting started

## Install

```bash
npm install @redot-src/glare
```

## Import

```js
import Glare from '@redot-src/glare'
import '@redot-src/glare/style.css'
```

Or from a CDN:

```html
<link rel="stylesheet" href="https://unpkg.com/@redot-src/glare/dist/glare.css" />
<script src="https://unpkg.com/@redot-src/glare/dist/glare.js"></script>
<script>
  Glare.bind('[data-glare]')
</script>
```

The ESM build is `dist/glare.esm.js` and the browser script is `dist/glare.js`. Both share `dist/glare.css`.

## Declarative usage

Mark anchors (or buttons) with `data-glare`. Elements with the same group name form a gallery.

```html
<a data-glare="cities" href="paris.jpg" data-caption="Paris">
  <img src="paris-thumb.jpg" alt="Paris" />
</a>
<a data-glare="cities" href="tokyo.jpg" data-caption="Tokyo">
  <img src="tokyo-thumb.jpg" alt="Tokyo" />
</a>
```

Bind explicitly:

```js
Glare.bind('[data-glare="cities"]', { loop: true })
```

Or bind every `[data-glare]` element once the DOM is ready:

```js
import { autoBind } from '@redot-src/glare'
autoBind({ loop: true })
```

## Programmatic usage

```js
const instance = Glare.open(
  [
    { src: '/media/1.jpg', caption: 'One' },
    { src: '/media/2.jpg', caption: 'Two' },
    { src: 'https://www.youtube.com/watch?v=XXXXXXXXXXX' },
  ],
  { loop: true },
  0,
)

instance.next()
instance.close()
```

## Data attributes

- `data-glare` — group name (empty for a single item)
- `data-src` — content URL, overrides `href`
- `data-type` — force `image`, `video`, `iframe`, `inline`, `ajax`, or `html`
- `data-caption` — caption HTML/text (falls back to `title`)
- `data-thumb` — thumbnail URL (falls back to a nested `<img>`)
- `data-width` / `data-height` — iframe size
- `data-poster` — video poster image
- `data-download-src` — download button target
- `data-html` — inline HTML string

## TypeScript

Glare ships declaration files:

```ts
import Glare, { type GlareOptions, type SlideSource } from '@redot-src/glare'
```
