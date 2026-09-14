# Instance

An instance is returned from `Glare.open()` and available via `Glare.getInstance()`.

## Properties

- `id` (`number`) — unique id
- `group` (`SlideItem[]`) — normalized slides
- `opts` (`GlareOptions`) — resolved options
- `current` (`SlideItem | null`) — active slide
- `currIndex` (`number`) — active index
- `isActive` (`boolean`) — open flag
- `$refs` — DOM references
- `SlideShow` — slideshow controls
- `Thumbs` — thumbnail controls
- `FullScreen` — fullscreen controls

## Methods

```ts
instance.open(index?)
instance.close(event?, duration?)
instance.next(duration?)
instance.prev(duration?)
instance.previous(duration?)
instance.jumpTo(index, duration?)
instance.scaleToFit(duration?)
instance.scaleToActual(x?, y?, duration?)
instance.update()
instance.focus()
instance.toggleControls(force?)
```

### Modules

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
```
