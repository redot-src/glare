export type ContentType =
  | 'image'
  | 'video'
  | 'iframe'
  | 'inline'
  | 'ajax'
  | 'html'

export type AnimationEffect =
  | false
  | 'fade'
  | 'zoom'
  | 'zoom-in-out'
  | 'slide'
  | 'circular'
  | 'tube'
  | 'rotate'

export type TransitionEffect =
  | false
  | 'fade'
  | 'slide'
  | 'circular'
  | 'tube'
  | 'zoom-in-out'
  | 'rotate'

export type ClickAction =
  | false
  | 'close'
  | 'next'
  | 'nextOrClose'
  | 'toggleControls'
  | 'zoom'
  | ((current: SlideItem, event: Event) => ClickAction | void)

export type ToolbarButton =
  | 'zoom'
  | 'slideshow'
  | 'thumbs'
  | 'close'
  | 'download'
  | 'share'
  | 'fullscreen'
  | string

export interface MediaProvider {
  matcher: RegExp
  type?: ContentType | 'iframe' | 'image'
  url?: string | ((match: RegExpMatchArray, url: string) => string)
  thumb?: string | ((match: RegExpMatchArray, url: string) => string)
  params?: Record<string, string | number | boolean>
  paramPlace?: number
}

export interface SlideSource {
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
  preload?: boolean
  autoStart?: boolean
  opts?: Partial<GlareOptions>
  $trigger?: HTMLElement | null
  [key: string]: unknown
}

export interface SlideItem extends SlideSource {
  index: number
  type: ContentType
  src: string
  contentEl?: HTMLElement | null
  $content?: HTMLElement | null
  $slide?: HTMLElement | null
  $image?: HTMLImageElement | null
  isLoaded?: boolean
  isComplete?: boolean
  isError?: boolean
  hasError?: boolean
  pos?: number
  width?: number | string
  height?: number | string
  contentWidth?: number
  contentHeight?: number
  scaleX?: number
  scaleY?: number
  canZoomIn?: boolean
  canZoomOut?: boolean
}

export interface TouchOptions {
  vertical?: boolean
  momentum?: boolean
}

export interface ImageOptions {
  preload?: boolean
}

export interface AjaxOptions {
  settings?: RequestInit & { data?: Record<string, string> }
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

export interface HashOptions {
  enabled?: boolean
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

export type EventHandler = (
  instance: GlareInstance,
  current?: SlideItem,
  ...args: unknown[]
) => unknown

export interface GlareOptions {
  closeExisting?: boolean
  loop?: boolean
  gutter?: number
  keyboard?: boolean
  preventCaptionOverlap?: boolean
  arrows?: boolean
  infobar?: boolean
  smallBtn?: boolean | 'auto'
  toolbar?: boolean | 'auto'
  buttons?: ToolbarButton[]
  idleTime?: number | false
  protect?: boolean
  modal?: boolean
  image?: ImageOptions
  ajax?: AjaxOptions
  iframe?: IframeOptions
  video?: VideoOptions
  defaultType?: ContentType
  animationEffect?: AnimationEffect
  animationDuration?: number
  zoomOpacity?: boolean | 'auto'
  transitionEffect?: TransitionEffect
  transitionDuration?: number
  slideClass?: string
  baseClass?: string
  parentEl?: string | HTMLElement
  hideScrollbar?: boolean
  autoFocus?: boolean
  backFocus?: boolean
  trapFocus?: boolean
  fullScreen?: FullscreenOptions | boolean
  touch?: TouchOptions | false
  hash?: HashOptions | boolean | null
  media?: Record<string, MediaProvider>
  slideShow?: SlideshowOptions | boolean
  thumbs?: ThumbsOptions | boolean
  share?: ShareOptions | boolean
  wheel?: boolean | 'auto' | 'slide'
  clickContent?: ClickAction
  clickSlide?: ClickAction
  clickOutside?: ClickAction
  dblclickContent?: ClickAction
  dblclickSlide?: ClickAction
  dblclickOutside?: ClickAction
  mobile?: Partial<GlareOptions>
  lang?: string
  i18n?: Record<string, Partial<I18nDict>>
  caption?: string | ((instance: GlareInstance, current: SlideItem) => string)
  onInit?: EventHandler
  beforeLoad?: EventHandler
  afterLoad?: EventHandler
  beforeShow?: EventHandler
  afterShow?: EventHandler
  beforeClose?: EventHandler
  afterClose?: EventHandler
  onActivate?: EventHandler
  onDeactivate?: EventHandler
  onUpdate?: EventHandler
  btnTpl?: Partial<Record<string, string>>
  spinnerTpl?: string
  errorTpl?: string
  baseTpl?: string
  [key: string]: unknown
}

export interface GlareInstance {
  id: number
  group: SlideItem[]
  opts: GlareOptions
  current: SlideItem | null
  currIndex: number
  prevIndex: number
  isActive: boolean
  isClosing: boolean
  isAnimating: boolean
  $refs: {
    container: HTMLElement | null
    stage: HTMLElement | null
    bg: HTMLElement | null
    inner: HTMLElement | null
    caption: HTMLElement | null
    toolbar: HTMLElement | null
    infobar: HTMLElement | null
    navigation: HTMLElement | null
  }
  open: (index?: number) => void
  close: (event?: Event | null, duration?: number) => void
  next: (duration?: number) => void
  previous: (duration?: number) => void
  prev: (duration?: number) => void
  jumpTo: (index: number, duration?: number) => void
  scaleToFit: (duration?: number) => void
  scaleToActual: (x?: number, y?: number, duration?: number) => void
  update: () => void
  focus: () => void
  toggleControls: (force?: boolean) => void
  isIdle: boolean
  SlideShow?: {
    start: () => void
    stop: () => void
    toggle: () => void
    isActive: () => boolean
  }
  Thumbs?: {
    show: () => void
    hide: () => void
    toggle: () => void
    focus: (index?: number) => void
    isActive: boolean
  }
  FullScreen?: {
    request: () => void
    exit: () => void
    toggle: () => void
    isFullscreen: () => boolean
  }
}

export interface BoundGroup {
  selector: string
  options: GlareOptions
  elements: HTMLElement[]
  destroy: () => void
}
