import type { ContentType, I18nDict, ResolvedOptions, SlideItem } from '../types'
import { videoMime } from '../media/detect'
import { $, createEl, toCssSize, toText } from '../utils/dom'
import { translate } from '../utils/template'

type Loader = (item: SlideItem, content: HTMLElement, opts: ResolvedOptions, dict: I18nDict) => Promise<void> | void

const IFRAME_LOAD_FALLBACK = 1200
const DEFAULT_EMBED_RATIO = 16 / 9

function embedRatio(item: SlideItem, width?: number, height?: number): number {
  if (width && height) return width / height

  const value = String(item.ratio || DEFAULT_EMBED_RATIO).replace(':', '/')
  const [x, y = '1'] = value.split('/').map((part) => part.trim())
  const numerator = parseFloat(x)
  const denominator = parseFloat(y)
  return numerator > 0 && denominator > 0 ? numerator / denominator : DEFAULT_EMBED_RATIO
}

function toPixels(value: number | string | undefined, available: number, viewport: number): number {
  if (!value) return 0
  if (typeof value === 'number') return value

  const input = value.trim()
  const amount = parseFloat(input)

  if (!(amount > 0)) return 0
  if (input.endsWith('%')) return available * amount / 100
  if (input.endsWith('vw') || input.endsWith('vh')) return viewport * amount / 100

  return amount
}

/** Fits video dimensions inside the slide using the same ratio-first model as Fancybox v3. */
function fitEmbed(item: SlideItem, content: HTMLElement): void {
  const slide = content.parentElement
  if (!slide) return

  const style = getComputedStyle(slide)
  const availableWidth = slide.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
  const availableHeight = slide.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
  if (!(availableWidth > 0 && availableHeight > 0)) return

  const hasDimensions = item.width !== undefined && item.height !== undefined
  let width = hasDimensions ? toPixels(item.width, availableWidth, innerWidth) : availableWidth
  let height = hasDimensions ? toPixels(item.height, availableHeight, innerHeight) : availableHeight
  const ratio = embedRatio(item, hasDimensions ? width : undefined, hasDimensions ? height : undefined)

  const scale = Math.min(1, availableWidth / width, availableHeight / height)
  width *= scale
  height *= scale

  if (height > width / ratio) height = width / ratio
  else if (width > height * ratio) width = height * ratio

  content.style.width = `${width}px`
  content.style.height = `${height}px`
  content.style.aspectRatio = String(ratio)
}

function observeEmbed(item: SlideItem, content: HTMLElement): void {
  fitEmbed(item, content)
  if (typeof ResizeObserver === 'undefined' || !content.parentElement) return

  const observer = new ResizeObserver(() => {
    if (!content.isConnected) return observer.disconnect()
    fitEmbed(item, content)
  })

  observer.observe(content.parentElement)
}

const image: Loader = (item, content, opts) =>
  new Promise((resolve, reject) => {
    const img = createEl('img', 'glare-image')
    img.alt = item.alt || toText(item.caption)
    img.decoding = 'async'
    img.draggable = false
    if (opts.protect) img.style.pointerEvents = 'none'

    img.onload = () => {
      item.$image = img
      item.contentWidth = img.naturalWidth
      item.contentHeight = img.naturalHeight
      content.appendChild(img)
      resolve()
    }
    img.onerror = () => reject(new Error(`Failed to load image: ${item.src}`))
    img.src = item.src
  })

const video: Loader = (item, content, opts, dict) => {
  const format = item.format || opts.video.format || videoMime(item.src)
  content.innerHTML = translate(opts.video.tpl, {
    ...dict,
    src: item.src,
    format,
    poster: item.poster ?? '',
  })

  const el = content.querySelector('video')
  if (el && (item.autoStart ?? opts.video.autoStart)) {
    void el.play().catch(() => undefined)
  }
}

const iframe: Loader = (item, content, opts) =>
  new Promise((resolve) => {
    const settings = opts.iframe
    const wrap = createEl('div', 'glare-iframe-wrap', settings.tpl)
    const frame = wrap.querySelector('iframe')
    if (!frame) throw new Error('Iframe template must contain an <iframe>')

    for (const [name, value] of Object.entries(settings.attr)) frame.setAttribute(name, value)
    Object.assign(frame.style, settings.css)
    content.appendChild(wrap)

    if (item.type === 'embed') {
      observeEmbed(item, content)
    } else {
      if (item.width) wrap.style.width = toCssSize(item.width)
      if (item.height) wrap.style.height = toCssSize(item.height)
    }

    if (!settings.preload) {
      frame.src = item.src
      resolve()
      return
    }

    frame.onload = () => resolve()
    frame.src = item.src
    // Cross-origin frames may never fire `load`; reveal the slide anyway.
    setTimeout(resolve, IFRAME_LOAD_FALLBACK)
  })

const inline: Loader = (item, content) => {
  const source = item.src ? $(item.src) : null
  if (!source) throw new Error(`Inline target not found: ${item.src}`)

  const clone = source.cloneNode(true) as HTMLElement
  clone.removeAttribute('id')
  clone.hidden = false
  clone.style.display = ''
  content.appendChild(clone)
}

const ajax: Loader = async (item, content, opts) => {
  const response = await fetch(item.src, opts.ajax.settings)
  if (!response.ok) throw new Error(`Request failed: ${response.status} ${item.src}`)
  content.innerHTML = await response.text()
}

const html: Loader = (item, content) => {
  if (item.content && typeof item.content === 'object') {
    content.appendChild(item.content)
  } else {
    content.innerHTML = item.html ?? item.content ?? item.src
  }
}

const loaders: Record<ContentType, Loader> = { image, video, embed: iframe, iframe, inline, ajax, html }

/** Renders the slide's content into `content` and resolves once it can be shown. */
export async function loadContent(item: SlideItem, content: HTMLElement, opts: ResolvedOptions, dict: I18nDict): Promise<void> {
  content.innerHTML = ''
  content.className = `glare-content glare-content--${item.type}`
  await loaders[item.type](item, content, opts, dict)
  item.isLoaded = true
}

/** Warms the browser cache for neighbouring images. */
export function preloadNeighbours(group: SlideItem[], index: number): void {
  for (const neighbour of [group[index - 1], group[index + 1]]) {
    if (neighbour?.type === 'image' && neighbour.src) new Image().src = neighbour.src
  }
}
