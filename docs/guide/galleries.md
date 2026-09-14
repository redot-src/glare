# Galleries

A gallery is any set of elements that share the same `data-glare` group name, or an array passed to `Glare.open()`.

## Grouped markup

```html
<a data-glare="portfolio" href="1.jpg"></a>
<a data-glare="portfolio" href="2.jpg"></a>
<a data-glare="portfolio" href="3.jpg"></a>
```

Clicking any item opens the group at that index. Use real links with `href` pointing at the full media URL so the content stays reachable without JavaScript.

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

`Glare.bind()` also reads the hash: loading a page with `#portfolio-2` opens that slide right away. Opening adds one history entry, so the Back button closes the lightbox; editing the hash by hand jumps to that slide. Disable with `hash: false`.

## Mixed content galleries

Groups may mix types:

```js
Glare.open([
  { src: 'cover.jpg' },
  { src: 'https://www.youtube.com/watch?v=XXXXXXXXXXX' },
  { type: 'html', html: '<p>Credits</p>' },
])
```

## Multiple instances

`closeExisting: true` ensures only one lightbox is visible. Otherwise instances stack and `Glare.close()` closes the topmost one.

## Re-binding

Call `Glare.bind()` after your list renders, and `destroy()` the returned handle before binding again:

```js
const handle = Glare.bind('.gallery a', { loop: true })
// later
handle.destroy()
```
