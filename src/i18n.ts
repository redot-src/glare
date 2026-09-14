import type { GlareOptions, I18nDict } from './types'

export const i18nEn: I18nDict = {
  CLOSE: 'Close',
  NEXT: 'Next',
  PREV: 'Previous',
  ERROR: 'The requested content cannot be loaded.<br/>Please try again later.',
  LOADING: 'Loading',
  LIGHTBOX: 'Media lightbox',
  GO_TO_SLIDE: 'Go to slide {{index}}',
  VIDEO_UNSUPPORTED: 'Your browser does not support HTML5 video.',
  PLAY_START: 'Start slideshow',
  PLAY_STOP: 'Pause slideshow',
  FULL_SCREEN: 'Full screen',
  FULL_SCREEN_EXIT: 'Exit full screen',
  THUMBS: 'Thumbnails',
  DOWNLOAD: 'Download',
  SHARE: 'Share',
  COPY: 'Copy link',
  ZOOM: 'Zoom',
  ZOOM_OUT: 'Zoom out',
}

/** Resolves the active dictionary: built-in English, then `i18n.en`, then `i18n[lang]`. */
export function getDict(opts: GlareOptions): I18nDict {
  const lang = opts.lang ?? 'en'
  return { ...i18nEn, ...opts.i18n?.en, ...opts.i18n?.[lang] }
}
