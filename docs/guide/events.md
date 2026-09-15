# Events

Lifecycle callbacks are options on `Glare.bind()` and `Glare.open()`. Use them to sync UI, log failures, or cancel a close.

| Event         | When it fires                                              | Handler receives                          |
| ------------- | ---------------------------------------------------------- | ----------------------------------------- |
| `onInit`      | Instance about to mount.                                   | `(instance)`                              |
| `onActivate`  | Instance mounted and on top of the stack.                  | `(instance)`                              |
| `beforeShow`  | Before the first slide is shown.                           | `(instance, current)`                     |
| `beforeLoad`  | Before a slide's content loads.                            | `(instance, current)`                     |
| `afterLoad`   | Content ready.                                             | `(instance, current)`                     |
| `afterShow`   | Slide visible.                                             | `(instance, current)`                     |
| `onError`     | Content failed to load; `current.error` holds the reason. Without a handler, Glare logs a warning. | `(instance, current)` |
| `onUpdate`    | After `jumpTo` changes the index.                          | `(instance, current)`                     |
| `beforeClose` | About to close. Return `false` to cancel.                  | `(instance, current)`                     |
| `afterClose`  | Fully closed and removed from the DOM.                     | `(instance, current)`                     |

Ask for confirmation before closing, and log load failures:

```js
Glare.open(
  [
    { src: '/media/hero.jpg', caption: 'Hero' },
    { src: '/media/missing.jpg', caption: 'Broken link' },
  ],
  {
    afterShow(instance, current) {
      console.log('showing', current.src)
    },
    onError(instance, current) {
      console.error('could not load', current.src, current.error)
    },
    beforeClose() {
      return confirm('Close the lightbox?')
    },
  },
)
```
