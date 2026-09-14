# Types

Every public type is exported from the package:

```ts
import type {
  GlareOptions,
  GlareInstance,
  GlareRefs,
  SlideSource,
  SlideItem,
  ContentType,
  ClickAction,
  ToolbarButton,
  MediaProvider,
  AnimationEffect,
  TransitionEffect,
  ThumbsOptions,
  SlideshowOptions,
  FullscreenOptions,
  ShareOptions,
  I18nDict,
  EventName,
  EventHandler,
} from '@redot-src/glare'
```

## `SlideSource`

What you pass to `Glare.open()`:

```ts
interface SlideSource {
  src?: string
  type?: ContentType
  caption?: string
  title?: string // fallback for caption
  alt?: string
  thumb?: string
  width?: number | string
  height?: number | string
  poster?: string
  format?: string
  autoStart?: boolean
  downloadSrc?: string
  html?: string
  content?: string | HTMLElement
}
```

## `SlideItem`

A normalized slide, as seen in event handlers and `instance.group`. Adds `index`, `isLoaded`, `hasError`, `contentWidth`, `contentHeight`, and the DOM references `$slide`, `$content`, `$image`, `$trigger`.

## `ContentType`

`'image' | 'video' | 'iframe' | 'inline' | 'ajax' | 'html'`

## `AnimationEffect`

`false | 'fade' | 'zoom'`

## `TransitionEffect`

`false | 'fade' | 'slide' | 'circular' | 'tube' | 'zoom-in-out' | 'rotate'`
