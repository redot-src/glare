# Glare

## `Glare.bind(target, options?)`

Attaches click handlers to elements. Elements sharing a `data-glare` value form a gallery.

- `target`: CSS selector, element, array of elements, or NodeList
- returns `{ elements, destroy() }`

If the page URL already contains a hash for one of the bound galleries (for example `#portfolio-3`), that slide opens immediately.

```js
const binding = Glare.bind('[data-glare]', { loop: true })
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

- `items`: array of slide objects / URL strings, **or** an array of elements
- `index`: starting slide (default `0`)

## `Glare.close(all = false)`

Closes the topmost instance, or every instance when `all` is `true`.

## `Glare.getInstance(id?)`

Returns the topmost open instance, or the instance with the given id. The container element carries the id as `data-glare-id`.

## `Glare.getInstances()`

Returns a copy of the open-instance stack.

## `Glare.destroy()`

Closes every instance and removes all handlers created by `bind()`.

## `Glare.defaults`

Mutable defaults object. Changes apply to instances created afterwards.
