import type {
  FullscreenOptions,
  ResolvedOptions,
  SlideshowOptions,
  ThumbsOptions,
} from './types'
import { i18nEn } from './i18n'
import { providers } from './media/providers'
import {
  baseTemplate,
  buttonTemplates,
  errorTemplate,
  iframeTemplate,
  spinnerTemplate,
  videoTemplate,
} from './templates'

export const thumbsDefaults: Required<Omit<ThumbsOptions, 'parentEl'>> & ThumbsOptions = {
  autoStart: false,
  axis: 'x',
}

export const slideshowDefaults: Required<SlideshowOptions> = {
  autoStart: false,
  speed: 3000,
}

export const fullscreenDefaults: Required<FullscreenOptions> = {
  autoStart: false,
}

export const defaults: ResolvedOptions = {
  closeExisting: false,
  loop: false,
  keyboard: true,
  protect: false,
  modal: false,
  idleTime: 3,
  hideScrollbar: true,
  autoFocus: true,
  backFocus: true,
  trapFocus: true,
  defaultType: 'image',
  parentEl: 'body',
  baseClass: '',
  slideClass: '',

  arrows: true,
  infobar: true,
  toolbar: 'auto',
  smallBtn: 'auto',
  buttons: ['zoom', 'slideshow', 'thumbs', 'download', 'fullscreen', 'close'],

  animationEffect: 'zoom',
  animationDuration: 366,
  anchor: 'trigger',
  zoomOpacity: true,
  transitionEffect: 'fade',
  transitionDuration: 366,

  clickContent: (current) => (current.type === 'image' ? 'zoom' : false),
  clickSlide: 'close',
  dblclickContent: false,
  dblclickSlide: false,
  wheel: 'auto',
  touch: { vertical: true, momentum: true },
  mobile: {
    idleTime: false,
    clickContent: (current) => (current.type === 'image' ? 'toggleControls' : false),
    clickSlide: (current) => (current.type === 'image' ? 'toggleControls' : 'close'),
    dblclickContent: (current) => (current.type === 'image' ? 'zoom' : false),
    dblclickSlide: (current) => (current.type === 'image' ? 'zoom' : false),
  },

  image: { preload: false },
  video: { tpl: videoTemplate, format: '', autoStart: true },
  iframe: {
    preload: true,
    css: {},
    attr: { allowfullscreen: 'true', allow: 'autoplay; fullscreen; picture-in-picture' },
    tpl: iframeTemplate,
  },
  ajax: { settings: { headers: { 'X-Requested-With': 'XMLHttpRequest' } } },
  media: providers,

  hash: true,
  slideshow: slideshowDefaults,
  thumbs: thumbsDefaults,
  fullscreen: fullscreenDefaults,

  lang: 'en',
  i18n: { en: i18nEn },
  baseTpl: baseTemplate,
  btnTpl: buttonTemplates,
  spinnerTpl: spinnerTemplate,
  errorTpl: errorTemplate,
}
