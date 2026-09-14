# Content types

Glare detects content from the URL when possible. You can always force a type with `type` / `data-type`.

## Image

```js
{ src: 'photo.jpg', caption: 'Hello', alt: 'Description' }
```

Extensions recognized: `avif`, `bmp`, `gif`, `jpg`, `jpeg`, `png`, `svg`, `webp`, `ico`.

## HTML5 video

```js
{
  type: 'video',
  src: 'clip.mp4',
  poster: 'poster.jpg',
  format: 'video/mp4',
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

PDFs and unknown remote URLs default to iframe.

## YouTube / Vimeo / Maps

Paste a normal watch or place URL — Glare rewrites it to an embed:

```js
{ src: 'https://www.youtube.com/watch?v=XXXXXXXXXXX' }
{ src: 'https://vimeo.com/148751763' }
{ src: 'https://www.google.com/maps/place/Tokyo+Tower/@35.6585805,139.7454389,17z' }
```

Customize providers via the `media` option.

## Inline

Clone an existing DOM node (the original stays in place):

```html
<div id="signup" hidden>...</div>
<a data-glare data-type="inline" href="#signup">Open</a>
```

## AJAX

```js
{
  type: 'ajax',
  src: '/partials/details.html',
}
```

Uses `fetch()`. Tune request options with `ajax.settings`.

## HTML string

```js
{
  type: 'html',
  html: '<h3>Thanks!</h3><p>Your order is confirmed.</p>',
}
```
