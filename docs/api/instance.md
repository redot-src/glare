# Instance

An instance is returned from `Glare.open()` and available via `Glare.getInstance()`. Use it to move between slides, zoom, and drive modules while the lightbox is open.

## Properties

| Property | Type | Meaning |
| -------- | ---- | ------- |
| `id` | `number` | Unique id for this instance. |
| `group` | `SlideItem[]` | Normalized slides. |
| `opts` | `ResolvedOptions` | Options after defaults are merged. |
| `dict` | `I18nDict` | Resolved i18n strings for the active language. |
| `current` | `SlideItem \| null` | Active slide. |
| `currIndex` | `number` | Active index. |
| `prevIndex` | `number` | Previous index. |
| `isActive` | `boolean` | Whether the dialog is open. |
| `isClosing` | `boolean` | Whether a close animation is in progress. |
| `isIdle` | `boolean` | Whether idle chrome is faded. |
| `$refs` | `GlareRefs \| null` | DOM references while open: `container`, `stage`, and optional `bg`, `inner`, `caption`, `toolbar`, `infobar`, `navigation`. `null` when closed. |
| `zoom` | `Zoom` | Zoom controller: `scale`, `x`, `y`, `isZoomed`, `toFit()`, `toActual({ x, y })`. |
| `slideshow` | `Slideshow \| undefined` | Present when the slideshow module is enabled. |
| `thumbs` | `Thumbs \| undefined` | Present when thumbnails are enabled. |
| `fullscreen` | `Fullscreen \| undefined` | Present when fullscreen is enabled and supported. |
| `share` | `Share \| undefined` | Present when share is enabled. |

## Methods

| Method | What it does |
| ------ | ------------ |
| `open(index?)` | Open (or jump) to an index. |
| `close()` | Close this instance. |
| `next()` | Go to the next slide. |
| `prev()` | Go to the previous slide. |
| `jumpTo(index)` | Jump to an absolute index. |
| `toggleZoom(point?)` | Zoom an image to actual size or back to fit, optionally around a point. |
| `update()` | Re-sync chrome for the current slide. |
| `focus()` | Move focus to the dialog container. |
| `toggleControls(force?)` | Toggle idle chrome, or force idle / visible. |

```js
const box = Glare.open([{ src: 'a.jpg' }, { src: 'b.jpg' }], { loop: true })
box.jumpTo(1)
box.toggleZoom()
box.close()
```

## Module handles

```ts
instance.slideshow?.start()
instance.slideshow?.stop()
instance.slideshow?.toggle()
instance.slideshow?.isActive()

instance.thumbs?.show()
instance.thumbs?.hide()
instance.thumbs?.toggle()
instance.thumbs?.focus(index?)

instance.fullscreen?.request()
instance.fullscreen?.exit()
instance.fullscreen?.toggle()
instance.fullscreen?.isFullscreen()

instance.share?.open()
instance.share?.close()
instance.share?.isOpen
```
