# Events

Provide callbacks in the options object.

Instance events receive `(instance)`:

- `onInit` — instance about to mount
- `onActivate` — instance mounted and on top of the stack

Slide events receive `(instance, current)`:

- `beforeShow` — before the first slide is shown
- `beforeLoad` — before a slide's content loads
- `afterLoad` — content ready
- `afterShow` — slide visible
- `onError` — content failed to load; `current.error` holds the reason. Without a handler, Glare logs a warning
- `onUpdate` — after `jumpTo`
- `beforeClose` — return `false` to cancel closing
- `afterClose` — fully closed and removed from the DOM

## Example

```js
Glare.open(items, {
  afterShow(instance, current) {
    console.log('showing', current.src)
  },
  onError(instance, current) {
    console.error('could not load', current.src, current.error)
  },
  beforeClose() {
    return confirm('Close the lightbox?')
  },
})
```
