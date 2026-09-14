# Instance

An instance is returned from `Glare.open()` and available via `Glare.getInstance()`.

## Properties

- `id` (`number`) — unique id
- `group` (`SlideItem[]`) — normalized slides
- `opts` (`GlareOptions`) — resolved options
- `current` (`SlideItem | null`) — active slide
- `currIndex` / `prevIndex` (`number`) — active and previous index
- `isActive` / `isClosing` / `isIdle` (`boolean`) — state flags
- `$refs` — DOM references: `container`, `bg`, `inner`, `stage`, `caption`, `toolbar`, `infobar`, `navigation`
- `zoom` — zoom controller (`scale`, `x`, `y`, `isZoomed`)
- `SlideShow`, `Thumbs`, `FullScreen`, `Share` — module handles, present when enabled

## Methods

```ts
instance.open(index?)
instance.close()
instance.next()
instance.prev()
instance.jumpTo(index)
instance.scaleToFit()
instance.scaleToActual(x?, y?)
instance.toggleZoom(point?)
instance.update()
instance.focus()
instance.toggleControls(force?)
```

## Modules

```ts
instance.SlideShow?.start()
instance.SlideShow?.stop()
instance.SlideShow?.toggle()
instance.SlideShow?.isActive()

instance.Thumbs?.show()
instance.Thumbs?.hide()
instance.Thumbs?.toggle()
instance.Thumbs?.focus(index?)

instance.FullScreen?.request()
instance.FullScreen?.exit()
instance.FullScreen?.toggle()
instance.FullScreen?.isFullscreen()

instance.Share?.open()
instance.Share?.close()
```
