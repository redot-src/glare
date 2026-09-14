# Glare

## `Glare.bind(selector, options?)`

Attaches click handlers to matching elements.

- `selector`: CSS string, element, array, or NodeList
- returns `{ destroy() }`

```js
const binding = Glare.bind('[data-glare]', { loop: true })
binding.destroy()
```

## `Glare.open(items, options?, index?)`

Opens a new instance.

- `items`: array of slide objects / URL strings, **or** an array of HTMLElements
- `index`: starting slide (default `0`)
- returns the `Glare` instance

## `Glare.close(all = false)`

Closes the topmost instance, or every instance when `all` is `true`.

## `Glare.getInstance(id?)`

Returns the topmost active instance, or a specific id.

## `Glare.getInstances()`

Returns a shallow copy of the active stack.

## `Glare.destroy()`

Closes everything and removes declarative bindings created via `bind`.

## `Glare.defaults`

Mutable defaults object. Changes apply to future instances.

## `Glare.fromSelector(selector, options?)`

Convenience helper: query elements and open immediately.
