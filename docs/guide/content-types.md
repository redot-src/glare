# Content types

Glare detects the type from the URL when possible. You can always force it with `type` or `data-type`.

## Detection rules

1. An explicit `type` / `data-type` wins
2. A `src` matching a [media provider](/guide/modules#media-providers) → the provider's type. YouTube and Vimeo use a responsive 16:9 `embed`; Google Maps uses `iframe`. The provider also rewrites `src` and fills `thumb`
3. `html` or `content` present → `html`
4. Empty `src` → `html`
5. `#id` or `.class` → `inline`
6. Image extensions (`avif`, `bmp`, `gif`, `jpg`, `jpeg`, `png`, `svg`, `webp`, `ico`) → `image`
7. Video extensions (`mp4`, `webm`, `ogg`, `ogv`, `mov`, `m4v`) → `video`
8. `.pdf` → `iframe`
9. Anything else → `defaultType` (`'image'`)

Web pages have no telling extension, so set `type: 'iframe'` explicitly for them.

## Image

```js
{ src: 'photo.jpg', caption: 'Hello', alt: 'Description' }
```

## HTML5 video

```js
{
  type: 'video',
  src: 'clip.mp4',
  poster: 'poster.jpg',
  format: 'video/mp4', // inferred from the extension when omitted
}
```

## Iframe

```js
{
  type: 'iframe',
  src: 'https://example.com',
  width: '90%',
  height: '80%',
}
```

Iframe slides fill the padded stage. The stage provides an even 30px cutout on every side (15px on small screens). They use `--glare-iframe-bg` behind the frame.

## YouTube / Vimeo / Maps

Paste a normal watch or place URL and Glare rewrites it to an embed:

```js
{ src: 'https://www.youtube.com/watch?v=XXXXXXXXXXX' }
{ src: 'https://vimeo.com/1084537' }
{ src: 'https://www.google.com/maps/place/Tokyo+Tower/@35.6585805,139.7454389,17z' }
```

YouTube and Vimeo are fitted inside the available stage at 16:9 by default. Explicit `width` and `height` define both the maximum player size and its ratio; `ratio` (or `data-ratio`) overrides the default when dimensions are omitted. The iframe fills this fitted wrapper. Generic iframes remain independent and fill the padded stage.

## Inline

Clones an existing DOM node; the original stays in place:

```html
<div id="signup" hidden>...</div>
<a data-glare data-type="inline" href="#signup">Open</a>
```

## AJAX

```js
{ type: 'ajax', src: '/partials/details.html' }
```

Uses `fetch()`. Tune the request with `ajax.settings`.

## HTML string

```js
{ type: 'html', html: '<h3>Thanks!</h3><p>Your order is confirmed.</p>' }
```

## Errors

When content fails to load, the slide shows `errorTpl`, `current.hasError` is set, and `current.error` holds the reason. Handle it with the [`onError` event](/guide/events).
