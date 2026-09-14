# Galleries

A gallery is any set of items that share the same `data-glare` group name, or an array passed to `Glare.open()`.

## Grouped markup

```html
<a data-glare="portfolio" href="1.jpg"></a>
<a data-glare="portfolio" href="2.jpg"></a>
<a data-glare="portfolio" href="3.jpg"></a>
```

Clicking any item opens the group at that index.

## Looping

```js
Glare.bind('[data-glare="portfolio"]', {
  loop: true,
})
```

When `loop` is `false`, previous/next buttons disable at the ends.

## Infobar & arrows

```js
{
  arrows: true,
  infobar: true, // shows "2 / 12"
}
```

## Hash deep links

With `hash: true` (default) and a group name, Glare updates the URL:

```
#portfolio-2
```

Opening a page with that hash can restore the slide (see the demo for a pattern). Disable with `hash: false`.

## Mixed content galleries

Groups may mix types:

```js
Glare.open([
  { src: 'cover.jpg' },
  { src: 'https://www.youtube.com/watch?v=XXXXXXXXXXX' },
  { type: 'html', html: '<p>Credits</p>' },
])
```
