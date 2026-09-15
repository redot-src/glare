# Gestures & zoom

How touch, click, and the mouse wheel move between slides and zoom images. These options apply to `Glare.bind()` and `Glare.open()`.

## Touch and pointer

With `touch` enabled (the default), horizontal swipe changes slides, vertical swipe closes, pinch zooms images while keeping the content under your fingers, and drag pans while zoomed without leaving the stage. Optional momentum keeps panning briefly after release. Mouse users get the same swipe and pan behavior by dragging.

| Option              | Default | What it does                                              |
| ------------------- | ------- | --------------------------------------------------------- |
| `touch`             | object  | `false` disables all gestures. Otherwise see fields below. |
| `touch.vertical`    | `true`  | Allow swipe-down to close.                                |
| `touch.momentum`    | `true`  | Keep panning briefly after release.                       |

```js
Glare.bind('[data-glare="lookbook"]', {
  touch: { vertical: true, momentum: true },
})
```

## Click and double-click zoom

On desktop, clicking an image zooms it to its natural size around the pointer (at least 1.5×). On touch-first devices the built-in `mobile` overrides tap an image to toggle the controls and double-tap to zoom. See [Interaction](/guide/options#interaction) for the full click-action list.

```js
{
  clickContent: 'zoom',
  dblclickContent: false,
}
```

## Mouse wheel

`wheel: 'auto'` (the default) moves between slides when scrolling over an image that is not zoomed. One wheel gesture moves one slide, including trackpad flicks with inertia. `true` navigates on every slide type; `false` disables it.

## Zoom API

Drive zoom from code on the open instance:

```js
const box = Glare.getInstance()
if (!box) throw new Error('no open lightbox')

box.toggleZoom()
box.zoom.toActual({ x: 400, y: 300 })
box.zoom.toFit()

console.log(box.zoom.isZoomed, box.zoom.scale, box.zoom.x, box.zoom.y)
```

`toggleZoom` zooms an image to actual size or back to fit. `toActual` accepts an optional focus point so that spot stays under the pointer.

## Styling hooks

The container carries `.glare-can-zoom-in` or `.glare-can-zoom-out` so you can style the cursor or add affordances. See [Styling](/guide/styling).
