# Galleries

A gallery is any set of elements that share the same `data-glare` group name, or an array passed to `Glare.open()`.

## Grouped markup

```html
<a data-glare="portfolio" href="1.jpg"></a>
<a data-glare="portfolio" href="2.jpg"></a>
<a data-glare="portfolio" href="3.jpg"></a>
```

Clicking any item opens the group at that index.

## Looping

```js
Glare.bind('[data-glare="portfolio"]', { loop: true })
```

When `loop` is `false`, the previous/next buttons are disabled at the ends.

## Infobar & arrows

```js
{
  arrows: true,
  infobar: true, // shows "2 / 12"
}
```

Both are hidden automatically for single-item groups.

## Hash deep links

With `hash: true` (the default) and a group name, Glare writes the current slide to the URL:

```
#portfolio-2
```

`Glare.bind()` also reads the hash: loading a page with `#portfolio-2` opens that slide right away. Browser back/forward navigation updates the slide or closes the lightbox. Disable with `hash: false`.

## Mixed content galleries

Groups may mix types:

```js
Glare.open([
  { src: 'cover.jpg' },
  { src: 'https://www.youtube.com/watch?v=XXXXXXXXXXX' },
  { type: 'html', html: '<p>Credits</p>' },
])
```
