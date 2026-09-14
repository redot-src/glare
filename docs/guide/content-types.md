# Content types

Glare detects the type from the URL when possible. You can always force it with `type` or `data-type`.

## Detection rules

1. `#id` or `.class` → `inline`
2. Image extensions (`avif`, `bmp`, `gif`, `jpg`, `jpeg`, `png`, `svg`, `webp`, `ico`) → `image`
3. Video extensions (`mp4`, `webm`, `ogg`, `ogv`, `mov`, `m4v`) → `video`
4. `.pdf` → `iframe`
5. A matching [media provider](/guide/modules#media-providers) (YouTube, Vimeo, Google Maps) → `iframe`
6. `html` or `content` provided without `src` → `html`
7. Anything else → `defaultType` (`'image'`)

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

Iframe slides fill the stage with 30px padding (15px on small screens) and use `--glare-iframe-bg` behind the frame.

## YouTube / Vimeo / Maps

Paste a normal watch or place URL and Glare rewrites it to an embed:

```js
{ src: 'https://www.youtube.com/watch?v=XXXXXXXXXXX' }
{ src: 'https://vimeo.com/148751763' }
{ src: 'https://www.google.com/maps/place/Tokyo+Tower/@35.6585805,139.7454389,17z' }
```

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
