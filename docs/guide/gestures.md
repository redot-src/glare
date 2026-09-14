# Gestures & zoom

## Touch & pointer

With `touch` enabled (the default):

- **Swipe horizontally** to change slides
- **Swipe vertically** to close
- **Pinch** to zoom images; the content under your fingers stays put
- **Drag** to pan while zoomed; the image never leaves the stage
- Optional **momentum** after releasing a pan

Mouse users get the same swipe and pan behaviour by dragging.

```js
{
  touch: {
    vertical: true,
    momentum: true,
  },
}
```

Set `touch: false` to disable all of it.

## Click / double-click zoom

On desktop, clicking an image zooms it to its natural size around the pointer (at least 1.5x). On touch devices the `mobile` defaults tap to toggle the controls and double-tap to zoom.

```js
{
  clickContent: 'zoom',
  dblclickContent: false,
}
```

## API

```js
const box = Glare.getInstance()
box?.scaleToActual()
box?.scaleToFit()
box?.zoom.isZoomed
```

## Mouse wheel

`wheel: 'auto'` (the default) moves between slides when scrolling over an image that is not zoomed. `true` navigates on every slide type, `false` disables it.

## Styling hooks

The container carries `.glare-can-zoom-in` or `.glare-can-zoom-out` so you can style the cursor or add affordances.
