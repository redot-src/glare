# Galleries

A gallery is a set of slides you can move between with arrows, keyboard, swipe, or the thumbnail strip. You build one either by grouping markup with the same `data-glare` name, or by passing an array to `Glare.open()`.

## Grouped markup

Links that share a `data-glare` value open as one gallery at the clicked index. Prefer real `href` values so the media stays reachable without JavaScript:

```html
<a data-glare="products" href="shoe.jpg" data-caption="Runner">
  <img src="shoe-thumb.jpg" alt="Runner" />
</a>
<a data-glare="products" href="boot.jpg" data-caption="Boot">
  <img src="boot-thumb.jpg" alt="Boot" />
</a>
```

```js
Glare.bind('[data-glare="products"]', { loop: true })
```

An empty `data-glare` (or a unique name used once) is a standalone item, not a multi-slide gallery.

## Looping and chrome

With `loop: true`, previous and next wrap at the ends. When `loop` is off, those buttons disable on the first and last slide.

`arrows` and `infobar` (the `2 / 12` counter) default to on, and both hide automatically for single-item groups.

## Hash deep links

With `hash: true` (the default) and a named gallery, Glare keeps the URL in sync:

```
#products-2
```

`Glare.bind()` also reads the hash on load, so `#products-2` opens that slide immediately. Opening pushes one history entry, so the browser Back button closes the lightbox; changing slides replaces that entry instead of stacking. Editing the hash by hand jumps to that slide. Turn this off with `hash: false`.

::: warning Apps with a client-side router
Closing the lightbox steps back through that history entry, which fires `popstate`. Routers such as Vue Router, VitePress, or Next.js treat that as a navigation and may re-render the page or reset its scroll position. In those apps set `hash: false`, globally with `Glare.defaults.hash = false` if you never need deep links.
:::

## Mixed content

One gallery may mix images, embeds, HTML, and other types:

```js
Glare.open([
  { src: 'cover.jpg', caption: 'Cover' },
  { src: 'https://www.youtube.com/watch?v=XXXXXXXXXXX' },
  { type: 'html', html: '<p>Credits and sizing notes.</p>' },
])
```

## Stacking vs closeExisting

By default, opening another lightbox stacks on top of the current one; `Glare.close()` closes the topmost. Set `closeExisting: true` to close every open instance before opening this one.

## Re-binding

`Glare.bind()` only attaches to elements that exist when it runs. After a dynamic list renders, destroy the previous handle before binding again:

```js
let handle = Glare.bind('.product-grid a', { loop: true })

function refreshGallery() {
  handle.destroy()
  handle = Glare.bind('.product-grid a', { loop: true })
}
```
