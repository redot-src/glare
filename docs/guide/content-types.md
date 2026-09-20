# Content types

Glare works out each slide's type from the URL when it can. Set `type` or `data-type` when detection would guess wrong. This page lists the rules, then one short example per type.

## Detection rules

1. An explicit `type` / `data-type` wins.
2. A `src` matching a [media provider](/guide/modules#media-providers) → the provider's type. YouTube and Vimeo use a responsive 16:9 `embed`; Google Maps uses `iframe`. The provider also rewrites `src` and fills `thumb` when it can.
3. `html` or `content` present → `html`.
4. Empty `src` → `html`.
5. `#id` or `.class` → `inline`.
6. Image extensions (`avif`, `bmp`, `gif`, `jpg`, `jpeg`, `png`, `svg`, `webp`, `ico`) → `image`.
7. Video extensions (`mp4`, `webm`, `ogg`, `ogv`, `mov`, `m4v`) → `video`.
8. `.pdf` → `iframe`.
9. Anything else → `defaultType` (`'image'`).

::: warning Ordinary web pages
URLs like `https://example.com` have no extension, so detection falls through to `defaultType`. Set `type: 'iframe'` explicitly for them.
:::

## Image

Uses `src`, optional `caption` / `alt` / `thumb` / `downloadSrc`:

```js
{ src: 'photo.jpg', caption: 'Golden hour', alt: 'Harbor at sunset' }
```

## HTML5 video

Uses `src`, optional `poster`, `format`, `autoStart`, and `ratio`. `format` is inferred from the extension when omitted:

```js
{
  type: 'video',
  src: 'clip.mp4',
  poster: 'poster.jpg',
  format: 'video/mp4',
}
```

When `thumb` is omitted, `poster` is also used in the thumbnail strip.

## Iframe

Uses `src`, optional `width` / `height`. Iframe slides fill the padded stage (about 30px on each side, 15px on small screens) and sit on `--glare-iframe-bg`:

```js
{
  type: 'iframe',
  src: 'https://example.com/docs',
  width: '90%',
  height: '80%',
}
```

## YouTube / Vimeo / Maps

Paste a normal watch or place URL; Glare rewrites it through the built-in providers:

```js
{ src: 'https://www.youtube.com/watch?v=XXXXXXXXXXX' }
{ src: 'https://vimeo.com/1084537' }
{ src: 'https://www.google.com/maps/place/Tokyo+Tower/@35.6585805,139.7454389,17z' }
```

YouTube and Vimeo fit the stage at 16:9 by default. Explicit `width` and `height` set both the maximum player size and its ratio; `ratio` (or `data-ratio`) overrides the default when dimensions are omitted. Generic iframes stay independent and fill the padded stage.

## Inline

Clones an existing DOM node; the original stays in place:

```html
<div id="signup" hidden>
  <h3>Join the list</h3>
  <form>...</form>
</div>
<a data-glare data-type="inline" href="#signup">Open signup</a>
```

## AJAX

Fetches HTML with `fetch()`. Tune the request with `ajax.settings`:

```js
{ type: 'ajax', src: '/partials/product-details.html' }
```

## HTML string

Uses `html` or `content`:

```js
{ type: 'html', html: '<h3>Thanks!</h3><p>Your order is confirmed.</p>' }
```

## Errors

When content fails to load, the slide shows `errorTpl`, `current.hasError` is set, and `current.error` holds the reason. Handle it with the [`onError` event](/guide/events).
