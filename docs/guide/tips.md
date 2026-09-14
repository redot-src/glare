# Tips

## Keep markup progressive

Use real links with `href` pointing at the full media URL so content remains usable without JavaScript.

## Prefer group names for deep links

Hash sync needs a gallery name:

```html
<a data-glare="album" href="..."></a>
```

## Single-item “modal”

```js
Glare.open([{ type: 'html', html: '...' }], {
  smallBtn: true,
  toolbar: false,
  clickOutside: 'close',
})
```

## Multiple instances

`closeExisting: true` ensures only one lightbox is visible. Otherwise instances stack; `Glare.close()` closes the topmost.

## Framework usage

Call `Glare.bind` after your list renders, and `destroy()` the returned handle before re-binding:

```js
const handle = Glare.bind('.gallery a', { loop: true })
// later
handle.destroy()
```

## Bundlers

```js
import Glare from 'glare'
import 'glare/style.css'
```

Tree-shaking friendly ESM build lives at `dist/glare.esm.js`. Browser/CDN script is `dist/glare.js`.
