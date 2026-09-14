# Gestures & zoom

## Touch & pointer

With `touch` enabled (default):

- **Swipe horizontally** to change slides
- **Swipe vertically** (with enough distance) to close
- **Pinch** to zoom images
- **Drag** to pan while zoomed
- Optional **momentum** after release

```js
{
  touch: {
    vertical: true,
    momentum: true,
  },
}
```

Set `touch: false` to disable.

## Click / double-click zoom

Default desktop behavior zooms an image on content click. Mobile defaults toggle controls on tap and zoom on double-tap (via `mobile` overrides).

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
```

## Mouse wheel

`wheel: 'auto'` advances slides on wheel for fitted images. Zoomed images keep native-feel pan priority (wheel does not navigate while zoomed out affordance is active).
