import type { ContentType, GlareOptions, SlideItem, SlideSource } from '../types'
import { detectType } from './detect'
import { applyProvider } from './providers'

/** Turns a user-provided slide into a normalized `SlideItem`. */
export function normalizeItem(source: SlideSource | string, index: number, opts: GlareOptions): SlideItem {
  const raw: SlideSource = typeof source === 'string' ? { src: source } : { ...source }
  let src = raw.src ?? ''
  let type = raw.type
  let thumb = raw.thumb

  const provided = src ? applyProvider(src, opts.media) : null
  if (provided) {
    src = provided.src ?? src
    type ??= provided.type
    thumb ??= provided.thumb
  }

  if (!type) {
    type = raw.html || raw.content ? 'html' : detectType(src, opts.defaultType)
  }

  return {
    ...raw,
    index,
    src,
    type,
    thumb,
    caption: raw.caption ?? raw.title ?? '',
    isLoaded: false,
    hasError: false,
  }
}

const attr = (el: HTMLElement, name: string): string | undefined => el.getAttribute(name) || undefined

/** Reads slide data from trigger elements (`href`, `data-*` attributes, nested `<img>`). */
export function itemsFromElements(elements: HTMLElement[], opts: GlareOptions): SlideItem[] {
  return elements.map((el, index) => {
    const img = el.querySelector('img')
    const caption = attr(el, 'data-caption') ?? attr(el, 'title') ?? ''

    return normalizeItem(
      {
        src: attr(el, 'data-src') ?? attr(el, 'href') ?? '',
        type: attr(el, 'data-type') as ContentType | undefined,
        caption,
        alt: img?.getAttribute('alt') || caption,
        thumb: attr(el, 'data-thumb') ?? img?.getAttribute('src') ?? undefined,
        width: attr(el, 'data-width'),
        height: attr(el, 'data-height'),
        ratio: attr(el, 'data-ratio'),
        poster: attr(el, 'data-poster'),
        downloadSrc: attr(el, 'data-download-src'),
        html: attr(el, 'data-html'),
        $trigger: el,
      },
      index,
      opts,
    )
  })
}

export function createItems(
  items: Array<SlideSource | string> | HTMLElement[],
  opts: GlareOptions,
): SlideItem[] {
  if (items.length && items[0] instanceof HTMLElement) {
    return itemsFromElements(items as HTMLElement[], opts)
  }
  return (items as Array<SlideSource | string>).map((item, i) => normalizeItem(item, i, opts))
}
