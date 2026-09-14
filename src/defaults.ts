import type { I18nDict, MediaProvider, GlareOptions } from './types'
import { icons } from './icons'

export const i18nEn: I18nDict = {
  CLOSE: 'Close',
  NEXT: 'Next',
  PREV: 'Previous',
  ERROR: 'The requested content cannot be loaded.<br/>Please try again later.',
  PLAY_START: 'Start slideshow',
  PLAY_STOP: 'Pause slideshow',
  FULL_SCREEN: 'Full screen',
  THUMBS: 'Thumbnails',
  DOWNLOAD: 'Download',
  SHARE: 'Share',
  ZOOM: 'Zoom',
}

export const defaultMedia: Record<string, MediaProvider> = {
  youtube: {
    matcher:
      /(?:youtube\.com|youtu\.be|youtube-nocookie\.com)\/(?:watch\?(?:.*&)?v=|v\/|u\/\w\/|embed\/|shorts\/)?([\w-]{11})/i,
    type: 'iframe',
    url: (_m, _url) => {
      const id = _m[1]
      return `https://www.youtube-nocookie.com/embed/${id}`
    },
    thumb: (m) => `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`,
    params: {
      autoplay: 1,
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
    },
  },
  vimeo: {
    matcher: /(?:vimeo\.com)\/(?:video\/)?(\d+)/i,
    type: 'iframe',
    url: (m) => `https://player.vimeo.com/video/${m[1]}`,
    params: {
      autoplay: 1,
      title: 0,
      byline: 0,
      portrait: 0,
    },
  },
  gmap: {
    matcher:
      /(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:maps\/(?:place\/[^/]+\/)?@([^/]+)|maps\?q=([^&]+)|maps\/search\/([^/?]+))/i,
    type: 'iframe',
    url: (m) => {
      const tld = m[1]
      if (m[2]) {
        const parts = m[2].split(',')
        const lat = parts[0]
        const lng = parts[1]
        const zoom = parts[2] ? Math.floor(parseFloat(parts[2])) : 14
        return `https://maps.google.${tld}/maps?ll=${lat},${lng}&z=${zoom}&output=embed`
      }
      const query = decodeURIComponent(m[3] || m[4] || '')
      return `https://maps.google.${tld}/maps?q=${encodeURIComponent(query)}&output=embed`
    },
  },
}

export const defaults: GlareOptions = {
  closeExisting: false,
  loop: false,
  gutter: 50,
  keyboard: true,
  preventCaptionOverlap: true,
  arrows: true,
  infobar: true,
  smallBtn: 'auto',
  toolbar: 'auto',
  buttons: ['zoom', 'slideshow', 'thumbs', 'share', 'download', 'fullscreen', 'close'],
  idleTime: 3,
  protect: false,
  modal: false,
  image: {
    preload: false,
  },
  ajax: {
    settings: {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    },
  },
  iframe: {
    preload: true,
    css: {},
    attr: {
      allowfullscreen: 'true',
      allow: 'autoplay; fullscreen; picture-in-picture',
    },
    tpl: '<iframe class="glare-iframe" allowfullscreen allow="autoplay; fullscreen; picture-in-picture" src=""></iframe>',
  },
  video: {
    tpl:
      '<video class="glare-video" controls playsinline controlsList="nodownload" poster="{{poster}}">' +
      '<source src="{{src}}" type="{{format}}"/>' +
      'Your browser does not support HTML5 video.' +
      '</video>',
    format: '',
    autoStart: true,
  },
  defaultType: 'image',
  animationEffect: 'zoom',
  animationDuration: 366,
  zoomOpacity: 'auto',
  transitionEffect: 'fade',
  transitionDuration: 366,
  slideClass: '',
  baseClass: '',
  parentEl: 'body',
  hideScrollbar: true,
  autoFocus: true,
  backFocus: true,
  trapFocus: true,
  fullScreen: {
    autoStart: false,
  },
  touch: {
    vertical: true,
    momentum: true,
  },
  hash: true,
  media: defaultMedia,
  slideShow: {
    autoStart: false,
    speed: 3000,
  },
  thumbs: {
    autoStart: false,
    hideOnClose: true,
    parentEl: '.glare-container',
    axis: 'x',
  },
  share: true,
  wheel: 'auto',
  clickContent: function (current) {
    return current.type === 'image' ? 'zoom' : false
  },
  clickSlide: 'close',
  clickOutside: 'close',
  dblclickContent: false,
  dblclickSlide: false,
  dblclickOutside: false,
  mobile: {
    preventCaptionOverlap: false,
    idleTime: false,
    clickContent: function (current) {
      return current.type === 'image' ? 'toggleControls' : false
    },
    clickSlide: function (current) {
      return current.type === 'image' ? 'toggleControls' : 'close'
    },
    dblclickContent: function (current) {
      return current.type === 'image' ? 'zoom' : false
    },
    dblclickSlide: function (current) {
      return current.type === 'image' ? 'zoom' : false
    },
  },
  lang: 'en',
  i18n: {
    en: i18nEn,
  },
  spinnerTpl: '<div class="glare-spinner" role="status" aria-label="Loading"></div>',
  errorTpl: '<div class="glare-error"><p>{{ERROR}}</p></div>',
  baseTpl: `
    <div class="glare-container" role="dialog" aria-modal="true" tabindex="-1">
      <div class="glare-progress" hidden></div>
      <div class="glare-bg"></div>
      <div class="glare-inner">
        <div class="glare-infobar"><span class="glare-infobar-index"></span></div>
        <div class="glare-toolbar"></div>
        <div class="glare-navigation">
          <button type="button" class="glare-button glare-button--prev" data-glare-prev title="{{PREV}}" aria-label="{{PREV}}">${icons.prev}</button>
          <button type="button" class="glare-button glare-button--next" data-glare-next title="{{NEXT}}" aria-label="{{NEXT}}">${icons.next}</button>
        </div>
        <div class="glare-stage"></div>
        <div class="glare-caption"></div>
      </div>
    </div>
  `,
  btnTpl: {
    download: `<a class="glare-button glare-button--download" data-glare-download download title="{{DOWNLOAD}}" aria-label="{{DOWNLOAD}}" href="javascript:;">${icons.download}</a>`,
    zoom: `<button type="button" class="glare-button glare-button--zoom" data-glare-zoom title="{{ZOOM}}" aria-label="{{ZOOM}}">${icons.zoomIn}</button>`,
    close: `<button type="button" class="glare-button glare-button--close" data-glare-close title="{{CLOSE}}" aria-label="{{CLOSE}}">${icons.close}</button>`,
    share: `<button type="button" class="glare-button glare-button--share" data-glare-share title="{{SHARE}}" aria-label="{{SHARE}}">${icons.share}</button>`,
    thumbs: `<button type="button" class="glare-button glare-button--thumbs" data-glare-thumbs title="{{THUMBS}}" aria-label="{{THUMBS}}">${icons.thumbs}</button>`,
    slideshow: `<button type="button" class="glare-button glare-button--slideshow" data-glare-slideshow title="{{PLAY_START}}" aria-label="{{PLAY_START}}">${icons.play}</button>`,
    fullscreen: `<button type="button" class="glare-button glare-button--fullscreen" data-glare-fullscreen title="{{FULL_SCREEN}}" aria-label="{{FULL_SCREEN}}">${icons.fullscreen}</button>`,
    smallBtn: `<button type="button" class="glare-button glare-close-small" data-glare-close title="{{CLOSE}}" aria-label="{{CLOSE}}">${icons.close}</button>`,
  },
}
