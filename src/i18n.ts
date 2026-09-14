import type { GlareOptions, I18nDict } from './types'

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

/** Resolves the active dictionary: built-in English, then `i18n.en`, then `i18n[lang]`. */
export function getDict(opts: GlareOptions): Record<string, string> {
  const lang = opts.lang ?? 'en'
  return { ...i18nEn, ...opts.i18n?.en, ...opts.i18n?.[lang] }
}
