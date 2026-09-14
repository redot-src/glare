import type { ContentType, I18nDict, ResolvedOptions, SlideItem } from '../types'
import { videoMime } from '../media/detect'
import { $, createEl, toCssSize, toText } from '../utils/dom'
import { translate } from '../utils/template'

type Loader = (item: SlideItem, content: HTMLElement, opts: ResolvedOptions, dict: I18nDict) => Promise<void> | void

const IFRAME_LOAD_FALLBACK = 1200

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
    if (item.width) wrap.style.width = toCssSize(item.width)
    if (item.height) wrap.style.height = toCssSize(item.height)
    content.appendChild(wrap)

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
  if (item.content instanceof HTMLElement) {
    content.appendChild(item.content)
  } else {
    content.innerHTML = item.html ?? item.content ?? item.src
  }
}

const loaders: Record<ContentType, Loader> = { image, video, iframe, inline, ajax, html }

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
