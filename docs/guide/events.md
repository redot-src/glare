# Events

Provide callbacks in the options object. Each receives `(instance, current?, ...args)`.

- `onInit` — instance constructed / about to build
- `beforeLoad` — before slide content loads
- `afterLoad` — content ready
- `beforeShow` — before open presentation
- `afterShow` — slide visible
- `beforeClose` — return `false` to cancel close
- `afterClose` — fully closed
- `onActivate` — instance becomes topmost
- `onDeactivate` — instance deactivated
- `onUpdate` — after `jumpTo`
- `onReveal` — content revealed
- `onDestroy` — teardown finished

## Example

```js
Glare.open(items, {
  afterShow(instance, current) {
    console.log('showing', current?.src)
  },
  beforeClose() {
    return confirm('Close the lightbox?')
  },
})
```
