# Instance

An instance is returned from `Glare.open()` and available via `Glare.getInstance()`.

## Properties

- `id` (`number`) — unique id
- `group` (`SlideItem[]`) — normalized slides
- `opts` (`GlareOptions`) — resolved options
- `dict` (`I18nDict`) — resolved strings
- `current` (`SlideItem | null`) — active slide
- `currIndex` / `prevIndex` (`number`) — active and previous index
- `isActive` / `isClosing` / `isIdle` (`boolean`) — state flags
- `$refs` — DOM references while open, `null` when closed: `container`, `stage`, and the optional `bg`, `inner`, `caption`, `toolbar`, `infobar`, `navigation`
- `zoom` — zoom controller: `scale`, `x`, `y`, `isZoomed`, `toFit()`, `toActual({ x, y })`
- `slideshow`, `thumbs`, `fullscreen`, `share` — module handles, present when enabled

## Methods

```ts
instance.open(index?)
instance.close()
instance.next()
instance.prev()
instance.jumpTo(index)
instance.toggleZoom(point?)
instance.update()
instance.focus()
instance.toggleControls(force?)
```

## Modules

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
