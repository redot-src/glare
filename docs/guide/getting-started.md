# Getting started

Glare opens images, video, embeds, and HTML in a lightbox dialog. This page installs it and shows the two ways to open it: from markup, and from code.

## Install

::: code-group

```bash [npm]
npm install @redot-src/glare
```

```bash [pnpm]
pnpm add @redot-src/glare
```

```bash [yarn]
yarn add @redot-src/glare
```

:::

Import the class and the stylesheet once, where your app starts:

```js
import Glare from '@redot-src/glare'
import '@redot-src/glare/style.css'
```

### Without a bundler

Load both files from a CDN. The script defines a global `Glare`:

```html
<link rel="stylesheet" href="https://unpkg.com/@redot-src/glare/dist/glare.css" />
<script src="https://unpkg.com/@redot-src/glare/dist/glare.js"></script>
<script>
  Glare.bind('[data-glare]')
</script>
```

The package ships two builds that share one stylesheet: `dist/glare.esm.js` for bundlers and `dist/glare.js` for `<script>` tags.

## Your first gallery

Start with plain links. Each `href` points at the full-size file, so the content stays reachable without JavaScript. Links that share a `data-glare` value form one gallery.

```html
<a data-glare="cities" href="paris.jpg" data-caption="Paris">
  <img src="paris-thumb.jpg" alt="Paris" />
</a>
<a data-glare="cities" href="tokyo.jpg" data-caption="Tokyo">
  <img src="tokyo-thumb.jpg" alt="Tokyo" />
</a>
```

Then bind them:

```js
Glare.bind('[data-glare="cities"]', { loop: true })
```

Clicking either image opens the gallery on that image, with arrows, keyboard navigation, swipe, and click-to-zoom. The nested `<img>` doubles as the thumbnail for the thumbnail strip.

To bind every `[data-glare]` element on the page at once, use `autoBind`. It waits for the DOM when needed:

```js
import { autoBind } from '@redot-src/glare'

autoBind({ loop: true })
```

::: tip Rendering the list later?
`Glare.bind()` only sees elements that exist when it runs. Call it after your list renders, and call `destroy()` on the handle it returns before binding again. See [Re-binding](/guide/galleries#re-binding).
:::

## Opening from code

Pass an array of slides to `Glare.open()`. It returns the instance, which you can drive from code:

```js
const lightbox = Glare.open(
  [
    { src: '/media/1.jpg', caption: 'One' },
    { src: '/media/2.jpg', caption: 'Two' },
    { src: 'https://www.youtube.com/watch?v=XXXXXXXXXXX' },
  ],
  { loop: true },
  0, // index of the slide to open on
)

lightbox.next()
lightbox.close()
```

A slide is a `SlideSource` object or just a URL string. Glare works out the type from the URL (image, video, YouTube, and so on) and you set `type` when it cannot. See [Content types](/guide/content-types).

## Data attributes

When you open from markup, these attributes describe each slide. Everything except `data-glare` is optional.

| Attribute                    | Purpose                                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| `data-glare`                 | Group name. Elements with the same name form a gallery. Leave the value empty for a standalone item.  |
| `data-src`                   | Content URL. Overrides `href`, which lets you use `<button>` triggers.                                 |
| `data-type`                  | Force a type: `image`, `video`, `embed`, `iframe`, `inline`, `ajax`, or `html`.                        |
| `data-caption`               | Caption, HTML allowed. Falls back to the `title` attribute.                                            |
| `data-thumb`                 | Thumbnail URL for the thumbnail strip. Falls back to the `src` of a nested `<img>`.                    |
| `data-width`, `data-height`  | Size of iframe and embed slides.                                                                       |
| `data-ratio`                 | Aspect ratio for video and embed slides, such as `4 / 3`.                                              |
| `data-poster`                | Poster image shown before a video plays.                                                               |
| `data-download-src`          | File the download button points to.                                                                    |
| `data-html`                  | HTML string for `data-type="html"` slides.                                                             |

The `alt` of a nested `<img>` becomes the full image's `alt`. Without one, the caption is used.

## TypeScript

Declarations ship with the package. Import types next to the class:

```ts
import Glare, { type GlareOptions, type SlideSource } from '@redot-src/glare'

const options: GlareOptions = { loop: true }
const slides: SlideSource[] = [{ src: '/media/1.jpg' }]

Glare.open(slides, options)
```

## Where next

- [Galleries](/guide/galleries): looping, deep links, mixed content, re-binding.
- [Options](/guide/options): every option with its default.
- [Styling](/guide/styling): CSS variables and state classes.
