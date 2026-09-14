# Types

Every public type is exported from the package:

```ts
import type {
  GlareOptions,
  ResolvedOptions,
  GlareInstance,
  GlareRefs,
  BoundGroup,
  SlideSource,
  SlideItem,
  ContentType,
  ClickAction,
  ClickActionName,
  ToolbarButton,
  MediaProvider,
  AnimationEffect,
  TransitionEffect,
  ImageOptions,
  VideoOptions,
  IframeOptions,
  AjaxOptions,
  TouchOptions,
  ThumbsOptions,
  SlideshowOptions,
  FullscreenOptions,
  ShareOptions,
  I18nDict,
  EventName,
  LifecycleEvent,
  LifecycleHandler,
  SlideEvent,
  EventHandler,
  Zoom,
  ZoomState,
  Point,
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

A normalized slide, as seen in event handlers and `instance.group`. Adds `index`, `isLoaded`, `hasError`, `error`, `contentWidth`, `contentHeight`, and the DOM references `$slide`, `$content`, `$image`, `$trigger`.

## `ResolvedOptions`

`GlareOptions` after the defaults are merged in: every option except the callbacks and `caption` is present. This is the type of `instance.opts`.

## `ContentType`

`'image' | 'video' | 'embed' | 'iframe' | 'inline' | 'ajax' | 'html'`

## `AnimationEffect`

`false | 'fade' | 'zoom'`

## `TransitionEffect`

`false | 'fade' | 'slide' | 'circular' | 'tube' | 'zoom-in-out' | 'rotate'`
