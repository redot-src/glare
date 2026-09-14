# Events

Provide callbacks in the options object. Each receives `(instance, current?)`.

- `onInit` — instance about to mount
- `onActivate` — instance mounted and on top of the stack
- `beforeShow` — before the first slide is shown
- `beforeLoad` — before a slide's content loads
- `afterLoad` — content ready
- `afterShow` — slide visible
- `onReveal` — after `afterShow`, once per slide
- `onUpdate` — after `jumpTo`
- `beforeClose` — return `false` to cancel closing
- `afterClose` — fully closed and removed from the DOM
- `onDeactivate` — instance removed from the stack
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
