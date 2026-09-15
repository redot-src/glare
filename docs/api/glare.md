# Glare

Static methods on the default export. Import the class, then call them without constructing it yourself.

## `Glare.bind(target, options?)`

Attaches click handlers to elements. Elements that share a `data-glare` value form a gallery.

| Parameter | Type | Meaning |
| --------- | ---- | ------- |
| `target` | CSS selector, element, array of elements, or `NodeList` | Elements to bind. |
| `options` | `GlareOptions` | Merged over `Glare.defaults`. |

Returns `{ elements, destroy() }`. If the page URL already contains a hash for one of the bound galleries (for example `#portfolio-3`), that slide opens immediately.

```js
const binding = Glare.bind('[data-glare="portfolio"]', { loop: true })
// later
binding.destroy()
```

## `Glare.autoBind(options?)`

Binds every `[data-glare]` element once the DOM is ready. Also available as a named export:

```js
import { autoBind } from '@redot-src/glare'

autoBind({ loop: true })
```

## `Glare.open(items, options?, index?)`

Opens a new instance and returns it.

| Parameter | Type | Meaning |
| --------- | ---- | ------- |
| `items` | slide objects / URL strings, or an array of elements | Content to show. |
| `options` | `GlareOptions` | Merged over `Glare.defaults`. |
| `index` | `number` | Starting slide (default `0`). |

```js
const lightbox = Glare.open(
  [
    { src: '/media/1.jpg', caption: 'One' },
    { src: '/media/2.jpg', caption: 'Two' },
  ],
  { loop: true },
  0,
)

lightbox.next()
```

## `Glare.close(all = false)`

Closes the topmost instance, or every instance when `all` is `true`.

```js
Glare.close()
Glare.close(true)
```

## `Glare.getInstance(id?)`

Returns the topmost open instance, or the instance with the given id. The container element carries the id as `data-glare-id`.

```js
const top = Glare.getInstance()
const specific = Glare.getInstance(3)
```

## `Glare.getInstances()`

Returns a copy of the open-instance stack.

```js
for (const instance of Glare.getInstances()) {
  console.log(instance.id, instance.currIndex)
}
```

## `Glare.destroy()`

Closes every instance and removes all handlers created by `bind()`.

```js
Glare.destroy()
```

## `Glare.defaults`

Mutable defaults object. Changes apply to instances created afterwards.

```js
Glare.defaults.loop = true
Glare.defaults.buttons = ['zoom', 'close']
```
