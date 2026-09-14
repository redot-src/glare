# Getting started

## Install

```bash
npm install glare
```

## Import

```js
import Glare from 'glare'
import 'glare/style.css'
```

Via CDN (plain browser script):

```html
<link rel="stylesheet" href="https://unpkg.com/glare/dist/glare.css" />
<script src="https://unpkg.com/glare/dist/glare.js"></script>
<script>
  Glare.bind('[data-glare]')
</script>
```

## Declarative usage

Mark anchors (or buttons) with `data-glare`. Matching group names become a gallery.

```html
<a data-glare="cities" href="paris.jpg" data-caption="Paris">
  <img src="paris-thumb.jpg" alt="Paris" />
</a>
<a data-glare="cities" href="tokyo.jpg" data-caption="Tokyo">
  <img src="tokyo-thumb.jpg" alt="Tokyo" />
</a>
```

Bind explicitly (recommended):

```js
Glare.bind('[data-glare="cities"]', {
  loop: true,
  thumbs: { autoStart: false },
})
```

Or auto-bind every declarative trigger after the DOM is ready:

```js
import { autoBind } from 'glare'
autoBind()
```

## Programmatic usage

```js
const instance = Glare.open(
  [
    { src: '/media/1.jpg', caption: 'One' },
    { src: '/media/2.jpg', caption: 'Two' },
    { src: 'https://www.youtube.com/watch?v=XXXXXXXXXXX' },
  ],
  {
    loop: true,
    animationEffect: 'zoom',
  },
  0,
)

instance.next()
instance.close()
```

## Useful data attributes

- `data-glare` — group name (empty = single item)
- `data-src` — override `href` as content URL
- `data-type` — force `image`, `video`, `iframe`, `inline`, `ajax`, or `html`
- `data-caption` — caption HTML/text
- `data-thumb` — thumbnail URL for the strip
- `data-width` / `data-height` — preferred iframe/content size
- `data-poster` — video poster image
- `data-download-src` — download button target
- `data-html` — inline HTML string

## TypeScript

Glare ships with declaration files. Import types as needed:

```ts
import Glare, { type GlareOptions, type SlideSource } from 'glare'
```
