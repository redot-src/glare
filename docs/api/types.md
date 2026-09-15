# Types

Every public type is exported from the package. Import what you need next to the class:

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
  /** Fallback for `caption`. */
  title?: string
  alt?: string
  thumb?: string
  width?: number | string
  height?: number | string
  /** Video/embed ratio, such as `16 / 9`. Explicit width and height take precedence. */
  ratio?: number | string
  poster?: string
  format?: string
  autoStart?: boolean
  downloadSrc?: string
  html?: string
  content?: string | HTMLElement
  $trigger?: HTMLElement | null
}
```

## `SlideItem`

A normalized slide, as seen in event handlers and `instance.group`. Extends `SlideSource` with runtime fields:

```ts
interface SlideItem extends SlideSource {
  index: number
  src: string
  type: ContentType
  caption: string
  isLoaded: boolean
  hasError: boolean
  /** The reason the content failed to load, when `hasError` is set. */
  error?: unknown
  contentWidth?: number
  contentHeight?: number
  $slide?: HTMLElement | null
  $content?: HTMLElement | null
  $image?: HTMLImageElement | null
}
```

## `GlareOptions`

The options object passed to `bind()`, `open()`, and `Glare.defaults`. Every field is optional; defaults and groupings are listed in [Options](/guide/options). Callbacks such as `afterShow` are options too — see [Events](/guide/events).

## `ResolvedOptions`

`GlareOptions` after the defaults are merged in: every option except the callbacks and `caption` is present, and nested `image`, `video`, `iframe`, and `ajax` objects are fully filled. This is the type of `instance.opts`.

## `ContentType`

```ts
type ContentType = 'image' | 'video' | 'embed' | 'iframe' | 'inline' | 'ajax' | 'html'
```

## `AnimationEffect`

```ts
type AnimationEffect = false | 'fade' | 'zoom'
```

## `TransitionEffect`

```ts
type TransitionEffect =
  | false
  | 'fade'
  | 'slide'
  | 'circular'
  | 'tube'
  | 'zoom-in-out'
  | 'rotate'
```

## `ClickAction`

```ts
type ClickActionName = 'close' | 'next' | 'nextOrClose' | 'toggleControls' | 'zoom'

type ClickAction =
  | false
  | ClickActionName
  | ((current: SlideItem, event: Event) => ClickActionName | false | void)
```

## `ToolbarButton`

```ts
type ToolbarButton =
  | 'zoom'
  | 'slideshow'
  | 'thumbs'
  | 'share'
  | 'download'
  | 'fullscreen'
  | 'more'
  | 'close'
  | (string & {})
```

## `MediaProvider`

```ts
interface MediaProvider {
  matcher: RegExp
  type?: ContentType
  /** Embed URL; a string may reference capture groups as `$1`. */
  url?: string | ((match: RegExpMatchArray, url: string) => string)
  thumb?: string | ((match: RegExpMatchArray, url: string) => string)
  params?: Record<string, string | number | boolean>
}
```

## `BoundGroup`

Returned by `Glare.bind()`:

```ts
interface BoundGroup {
  elements: HTMLElement[]
  destroy: () => void
}
```

## `GlareRefs`

Elements of the mounted dialog. `container` and `stage` are required by the base template; the rest are optional chrome:

```ts
interface GlareRefs {
  container: HTMLElement
  bg: HTMLElement | null
  inner: HTMLElement | null
  stage: HTMLElement
  caption: HTMLElement | null
  toolbar: HTMLElement | null
  infobar: HTMLElement | null
  navigation: HTMLElement | null
}
```
