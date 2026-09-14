import type { ContentType, MediaProvider, GlareOptions, SlideItem, SlideSource } from './types'
import { buildQuery, deepMerge } from './utils'

const IMAGE_EXT = /\.(avif|bmp|gif|jpe?g|png|svg|webp|ico)(\?.*)?$/i
const VIDEO_EXT = /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i
const PDF_EXT = /\.pdf(\?.*)?$/i

export function detectType(src: string, explicit?: ContentType): ContentType {
  if (explicit) return explicit
  if (!src) return 'html'
  if (src.startsWith('#') || src.startsWith('.')) return 'inline'
  if (IMAGE_EXT.test(src)) return 'image'
  if (VIDEO_EXT.test(src)) return 'video'
  if (PDF_EXT.test(src)) return 'iframe'
  if (/^https?:\/\//i.test(src) || src.startsWith('//') || src.startsWith('/')) {
    return 'iframe'
  }
  return 'html'
}

function applyMediaProvider(
  src: string,
  media: Record<string, MediaProvider> | undefined,
): Partial<SlideSource> | null {
  if (!media) return null
  for (const provider of Object.values(media)) {
    const match = src.match(provider.matcher)
    if (!match) continue

    let url = src
    if (typeof provider.url === 'function') {
      url = provider.url(match, src)
    } else if (typeof provider.url === 'string') {
      url = provider.url.replace(/\$(\d+)/g, (_, n) => match[Number(n)] || '')
    }

    if (provider.params) {
      const sep = url.includes('?') ? '&' : '?'
      url += sep + buildQuery(provider.params)
    }

    let thumb: string | undefined
    if (typeof provider.thumb === 'function') {
      thumb = provider.thumb(match, src)
    } else if (typeof provider.thumb === 'string') {
      thumb = provider.thumb.replace(/\$(\d+)/g, (_, n) => match[Number(n)] || '')
    }

    return {
      src: url,
      type: (provider.type as ContentType) || 'iframe',
      thumb,
    }
  }
  return null
}

export function normalizeItem(
  source: SlideSource | string,
  index: number,
  opts: GlareOptions,
): SlideItem {
  const raw: SlideSource =
    typeof source === 'string' ? { src: source } : { ...source }

  let src = raw.src || ''
  let type = raw.type
  let thumb = raw.thumb

  if (raw.html && !src) {
    type = 'html'
    src = ''
  }

  const mediaHit = src ? applyMediaProvider(src, opts.media) : null
  if (mediaHit) {
    src = mediaHit.src || src
    type = (mediaHit.type as ContentType) || type
    thumb = thumb || mediaHit.thumb
  }

  if (!type) {
    if (raw.content || raw.html) type = 'html'
    else type = detectType(src, opts.defaultType)
  }

  // Treat unknown remote URLs that look like pages as iframe;
  // images/videos already caught by extension.
  if (type === 'iframe' && IMAGE_EXT.test(src)) type = 'image'
  if (type === 'iframe' && VIDEO_EXT.test(src)) type = 'video'

  const item: SlideItem = {
    ...raw,
    index,
    src,
    type,
    thumb,
    caption: raw.caption ?? raw.title ?? '',
    isLoaded: false,
    isComplete: false,
    hasError: false,
    canZoomIn: false,
    canZoomOut: false,
  }

  if (raw.opts) {
    item.opts = deepMerge({}, opts, raw.opts) as GlareOptions
  }

  return item
}

export function itemsFromElements(
  elements: HTMLElement[],
  opts: GlareOptions,
): SlideItem[] {
  return elements.map((el, index) => {
    const href =
      el.getAttribute('data-src') ||
      el.getAttribute('data-glare-src') ||
      el.getAttribute('href') ||
      ''

    const typeAttr = (el.getAttribute('data-type') ||
      el.getAttribute('data-glare-type') ||
      undefined) as ContentType | undefined

    const caption =
      el.getAttribute('data-caption') ||
      el.getAttribute('data-glare-caption') ||
      el.getAttribute('title') ||
      ''

    const thumb =
      el.getAttribute('data-thumb') ||
      el.getAttribute('data-glare-thumb') ||
      el.querySelector('img')?.getAttribute('src') ||
      undefined

    const width = el.getAttribute('data-width') || undefined
    const height = el.getAttribute('data-height') || undefined
    const poster = el.getAttribute('data-poster') || undefined
    const downloadSrc =
      el.getAttribute('data-download-src') ||
      el.getAttribute('data-glare-download') ||
      undefined

    let html: string | undefined
    const srcHtml = el.getAttribute('data-html') || el.getAttribute('data-glare-html')
    if (srcHtml) html = srcHtml

    const item = normalizeItem(
      {
        src: href,
        type: typeAttr,
        caption,
        thumb,
        width,
        height,
        poster,
        downloadSrc,
        html,
        alt: el.querySelector('img')?.getAttribute('alt') || caption || '',
        $trigger: el,
      },
      index,
      opts,
    )

    return item
  })
}
