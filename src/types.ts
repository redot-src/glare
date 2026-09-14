import type { FullScreen } from './modules/fullscreen'
import type { Share } from './modules/share'
import type { Slideshow } from './modules/slideshow'
import type { Thumbs } from './modules/thumbs'

export type ContentType = 'image' | 'video' | 'iframe' | 'inline' | 'ajax' | 'html'

/** Effect played when the lightbox opens. */
export type AnimationEffect = false | 'fade' | 'zoom'

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

export type ToolbarButton =
  | 'zoom'
  | 'slideshow'
  | 'thumbs'
  | 'share'
  | 'download'
  | 'fullscreen'
  | 'close'
  | (string & {})

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
  poster?: string
  format?: string
  autoStart?: boolean
  downloadSrc?: string
  html?: string
  content?: string | HTMLElement
  $trigger?: HTMLElement | null
  [key: string]: unknown
}

/** A normalized slide with runtime state. */
export interface SlideItem extends SlideSource {
  index: number
  src: string
  type: ContentType
  caption: string
  isLoaded: boolean
  hasError: boolean
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

export interface ThumbsOptions {
  autoStart?: boolean
  hideOnClose?: boolean
  parentEl?: string | HTMLElement
  axis?: 'x' | 'y'
}

export interface SlideshowOptions {
  autoStart?: boolean
  speed?: number
}

export interface FullscreenOptions {
  autoStart?: boolean
}

export interface ShareOptions {
  url?: string | ((item: SlideItem) => string)
  tpl?: string
}

export interface I18nDict {
  CLOSE: string
  NEXT: string
  PREV: string
  ERROR: string
  PLAY_START: string
  PLAY_STOP: string
  FULL_SCREEN: string
  THUMBS: string
  DOWNLOAD: string
  SHARE: string
  ZOOM: string
}

export type EventName =
  | 'onInit'
  | 'beforeLoad'
  | 'afterLoad'
  | 'beforeShow'
  | 'afterShow'
  | 'beforeClose'
  | 'afterClose'
  | 'onActivate'
  | 'onDeactivate'
  | 'onUpdate'
  | 'onReveal'
  | 'onDestroy'

export type EventHandler = (instance: GlareInstance, current?: SlideItem) => unknown

export type EventHandlers = Partial<Record<EventName, EventHandler>>

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
  zoomOpacity?: boolean
  transitionEffect?: TransitionEffect
  transitionDuration?: number

  // Interaction
  clickContent?: ClickAction
  clickSlide?: ClickAction
  dblclickContent?: ClickAction
  dblclickSlide?: ClickAction
  wheel?: boolean | 'auto' | 'slide'
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
  slideShow?: SlideshowOptions | boolean
  thumbs?: ThumbsOptions | boolean
  fullScreen?: FullscreenOptions | boolean
  share?: ShareOptions | boolean

  // Text and templates
  lang?: string
  i18n?: Record<string, Partial<I18nDict>>
  baseTpl?: string
  btnTpl?: Partial<Record<string, string>>
  spinnerTpl?: string
  errorTpl?: string
}

export interface GlareRefs {
  container: HTMLElement | null
  bg: HTMLElement | null
  inner: HTMLElement | null
  stage: HTMLElement | null
  caption: HTMLElement | null
  toolbar: HTMLElement | null
  infobar: HTMLElement | null
  navigation: HTMLElement | null
}

export interface GlareInstance {
  readonly id: number
  readonly group: SlideItem[]
  readonly opts: GlareOptions
  current: SlideItem | null
  currIndex: number
  prevIndex: number
  isActive: boolean
  isClosing: boolean
  isIdle: boolean
  $refs: GlareRefs

  SlideShow?: Slideshow
  Thumbs?: Thumbs
  FullScreen?: FullScreen
  Share?: Share

  open(index?: number): void
  close(): void
  next(): void
  prev(): void
  jumpTo(index: number): void
  scaleToFit(): void
  scaleToActual(x?: number, y?: number): void
  update(): void
  focus(): void
  toggleControls(force?: boolean): void
}

export interface BoundGroup {
  selector: string
  options: GlareOptions
  elements: HTMLElement[]
  destroy: () => void
}
