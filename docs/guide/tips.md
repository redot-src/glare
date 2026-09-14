# Tips

## Keep markup progressive

Use real links with `href` pointing at the full media URL so content stays usable without JavaScript.

## Prefer group names for deep links

Hash sync needs a gallery name:

```html
<a data-glare="album" href="..."></a>
```

## Single-item modal

```js
Glare.open([{ type: 'html', html: '...' }], {
  modal: true,
  smallBtn: true,
  toolbar: false,
})
```

## Multiple instances

`closeExisting: true` ensures only one lightbox is visible. Otherwise instances stack and `Glare.close()` closes the topmost one.

## Framework usage

Call `Glare.bind` after your list renders, and `destroy()` the returned handle before re-binding:

```js
const handle = Glare.bind('.gallery a', { loop: true })
// later
handle.destroy()
```

## Builds

The ESM build is `dist/glare.esm.js` and the browser/CDN script is `dist/glare.js`. Both share `dist/glare.css`.
