import type { Point, Zoom } from './core/zoom'
import type { Fullscreen } from './modules/fullscreen'
import type { Slideshow } from './modules/slideshow'
import type { Thumbs } from './modules/thumbs'

export type ContentType = 'image' | 'video' | 'embed' | 'iframe' | 'inline' | 'ajax' | 'html'

/** Effect played when the lightbox opens. */
export type AnimationEffect = false | 'fade' | 'zoom'

/** A spot in the lightbox the opening image can grow from, as `<vertical>-<horizontal>`. */
export type AnchorPosition = `${'top' | 'center' | 'bottom'}-${'left' | 'center' | 'right'}`

/** Where the `'zoom'` effect starts: the slide's trigger, a position, an element, or a selector. */
export type Anchor = 'trigger' | AnchorPosition | HTMLElement | (string & {})

/** Effect played when moving between slides. */
export type TransitionEffect =
  | false
  | 'fade'
  | 'slide'
  | 'circular'
  | 'tube'
  | 'zoom-in-out'
  | 'rotate'

export type ClickActionName = 'close' | 'next' | 'nextOrClose' | 'toggleControls' | 'zoom'

export type ClickAction =
  | false
  | ClickActionName
  | ((current: SlideItem, event: Event) => ClickActionName | false | void)

/** A toolbar button defined inline: rendered like the built-in ones and wired to `click`. */
export interface CustomButton {
  /** Identifies the button; also its `glare-button--{name}` class. */
  name: string
  /** Tooltip and accessible name. */
  label: string
  /** The button's content as HTML, usually an inline `<svg>`. */
  icon: string
  click: (instance: GlareInstance, current: SlideItem, event: MouseEvent) => void
}

export type ToolbarButton =
  | 'zoom'
  | 'slideshow'
  | 'thumbs'
  | 'download'
  | 'fullscreen'
  | 'more'
  | 'close'
  | (string & {})
  | CustomButton

export interface MediaProvider {
  matcher: RegExp
  type?: ContentType
  /** Embed URL; a string may reference capture groups as `$1`. */
  url?: string | ((match: RegExpMatchArray, url: string) => string)
  thumb?: string | ((match: RegExpMatchArray, url: string) => string)
  params?: Record<string, string | number | boolean>
}

/** A slide as provided by the user. */
export interface SlideSource {
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

/** A normalized slide with runtime state. */
export interface SlideItem extends SlideSource {
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

export interface TouchOptions {
  vertical?: boolean
  momentum?: boolean
}

export interface ImageOptions {
  preload?: boolean
}

export interface AjaxOptions {
  settings?: RequestInit
}

export interface IframeOptions {
  preload?: boolean
  css?: Partial<CSSStyleDeclaration>
  attr?: Record<string, string>
  tpl?: string
}

export interface VideoOptions {
  tpl?: string
  format?: string
  autoStart?: boolean
}

/** How a thumbnail image fills its square, as CSS `object-fit`. */
export type ThumbsFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'

export interface ThumbsOptions {
  autoStart?: boolean
  parentEl?: string | HTMLElement
  axis?: 'x' | 'y'
  fit?: ThumbsFit
}

export interface SlideshowOptions {
  autoStart?: boolean
  speed?: number
}

export interface FullscreenOptions {
  autoStart?: boolean
}

export type I18nDict = {
  CLOSE: string
  NEXT: string
  PREV: string
  ERROR: string
  LOADING: string
  LIGHTBOX: string
  GO_TO_SLIDE: string
  VIDEO_UNSUPPORTED: string
  PLAY_START: string
  PLAY_STOP: string
  FULL_SCREEN: string
  FULL_SCREEN_EXIT: string
  THUMBS: string
  DOWNLOAD: string
  MORE: string
  ZOOM: string
  ZOOM_OUT: string
}

/** Events that concern the instance as a whole. */
export type LifecycleEvent = 'onInit' | 'onActivate'

/** Events that concern one slide; the handler always receives it. */
export type SlideEvent =
  | 'beforeLoad'
  | 'afterLoad'
  | 'onError'
  | 'beforeShow'
  | 'afterShow'
  | 'onUpdate'
  | 'beforeClose'
  | 'afterClose'

export type EventName = LifecycleEvent | SlideEvent

export type LifecycleHandler = (instance: GlareInstance) => unknown

export type EventHandler = (instance: GlareInstance, current: SlideItem) => unknown

export type EventHandlers = Partial<
  Record<LifecycleEvent, LifecycleHandler> & Record<SlideEvent, EventHandler>
>

export interface GlareOptions extends EventHandlers {
  // Behaviour
  closeExisting?: boolean
  loop?: boolean
  keyboard?: boolean
  protect?: boolean
  modal?: boolean
  idleTime?: number | false
  hideScrollbar?: boolean
  autoFocus?: boolean
  backFocus?: boolean
  trapFocus?: boolean
  defaultType?: ContentType
  parentEl?: string | HTMLElement
  baseClass?: string
  slideClass?: string

  // Chrome
  arrows?: boolean
  infobar?: boolean
  toolbar?: boolean | 'auto'
  smallBtn?: boolean | 'auto'
  buttons?: ToolbarButton[]
  caption?: string | ((instance: GlareInstance, current: SlideItem) => string)

  // Motion
  animationEffect?: AnimationEffect
  animationDuration?: number
  anchor?: Anchor
  zoomOpacity?: boolean
  transitionEffect?: TransitionEffect
  transitionDuration?: number

  // Interaction
  clickContent?: ClickAction
  clickSlide?: ClickAction
  dblclickContent?: ClickAction
  dblclickSlide?: ClickAction
  wheel?: boolean | 'auto'
  touch?: TouchOptions | false
  /** Overrides applied on touch-first devices. */
  mobile?: Partial<GlareOptions>

  // Content
  image?: ImageOptions
  video?: VideoOptions
  iframe?: IframeOptions
  ajax?: AjaxOptions
  media?: Record<string, MediaProvider>

  // Modules
  hash?: boolean
  slideshow?: SlideshowOptions | boolean
  thumbs?: ThumbsOptions | boolean
  fullscreen?: FullscreenOptions | boolean

  // Text and templates
  lang?: string
  i18n?: Record<string, Partial<I18nDict>>
  baseTpl?: string
  btnTpl?: Partial<Record<string, string>>
  spinnerTpl?: string
  errorTpl?: string
}

type DefaultedKey = Exclude<keyof GlareOptions, keyof EventHandlers | 'caption'>

/** Options after the defaults have been merged in: everything but callbacks is present. */
export type ResolvedOptions = GlareOptions &
  Required<Pick<GlareOptions, DefaultedKey>> & {
    image: Required<ImageOptions>
    video: Required<VideoOptions>
    iframe: Required<IframeOptions>
    ajax: Required<AjaxOptions>
  }

/** Elements of the mounted dialog. `container` and `stage` are required by the base template; the rest are optional chrome. */
export interface GlareRefs {
  container: HTMLElement
  bg: HTMLElement | null
  inner: HTMLElement | null
  stage: HTMLElement
  caption: HTMLElement | null
  toolbar: HTMLElement | null
  infobar: HTMLElement | null
  navigation: HTMLElement | null
}

export interface GlareInstance {
  readonly id: number
  readonly group: SlideItem[]
  readonly opts: GlareOptions
  readonly zoom: Zoom
  current: SlideItem | null
  currIndex: number
  prevIndex: number
  isActive: boolean
  isClosing: boolean
  isIdle: boolean
  /** Null while the lightbox is closed. */
  $refs: GlareRefs | null

  slideshow?: Slideshow
  thumbs?: Thumbs
  fullscreen?: Fullscreen

  open(index?: number): void
  close(): void
  next(): void
  prev(): void
  jumpTo(index: number): void
  toggleZoom(focus?: Point): void
  update(): void
  focus(): void
  toggleControls(force?: boolean): void
}

export interface BoundGroup {
  elements: HTMLElement[]
  destroy: () => void
}
