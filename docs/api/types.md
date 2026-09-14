# Types

Primary exported types:

```ts
import type {
  GlareOptions,
  GlareInstance,
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
  EventHandler,
} from '@redot-src/glare'
```

## `SlideSource`

```ts
interface SlideSource {
  src?: string
  type?: ContentType
  width?: number | string
  height?: number | string
  caption?: string
  title?: string
  thumb?: string
  alt?: string
  downloadSrc?: string
  html?: string
  content?: string | HTMLElement
  poster?: string
  format?: string
  opts?: Partial<GlareOptions>
}
```

## `ContentType`

`'image' | 'video' | 'iframe' | 'inline' | 'ajax' | 'html'`
