export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Array<Partial<T> | Record<string, unknown> | undefined | null | false>
): T {
  const result: Record<string, unknown> = { ...target }

  for (const source of sources) {
    if (!source || typeof source !== 'object') continue
    for (const [key, value] of Object.entries(source)) {
      if (value === undefined) continue
      const existing = result[key]
      if (isObject(existing) && isObject(value) && !Array.isArray(value)) {
        result[key] = deepMerge(
          existing as Record<string, unknown>,
          value as Record<string, unknown>,
        )
      } else {
        result[key] = value
      }
    }
  }

  return result as T
}

export function $(
  selector: string,
  context: ParentNode = document,
): HTMLElement | null {
  return context.querySelector(selector)
}

export function $$(
  selector: string,
  context: ParentNode = document,
): HTMLElement[] {
  return Array.from(context.querySelectorAll(selector))
}

export function createEl<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  html?: string,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag)
  if (className) el.className = className
  if (html !== undefined) el.innerHTML = html
  return el
}

export function setAttributes(
  el: HTMLElement,
  attrs: Record<string, string | number | boolean | null | undefined>,
): void {
  for (const [key, value] of Object.entries(attrs)) {
    if (value === null || value === undefined || value === false) {
      el.removeAttribute(key)
    } else if (value === true) {
      el.setAttribute(key, '')
    } else {
      el.setAttribute(key, String(value))
    }
  }
}

export function on<K extends keyof HTMLElementEventMap>(
  el: EventTarget,
  type: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): () => void
export function on(
  el: EventTarget,
  type: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions,
): () => void
export function on(
  el: EventTarget,
  type: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions,
): () => void {
  el.addEventListener(type, handler, options)
  return () => el.removeEventListener(type, handler, options)
}

export function once(
  el: EventTarget,
  type: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions,
): () => void {
  const wrapped: EventListener = (event) => {
    off()
    handler(event)
  }
  const off = on(el, type, wrapped, options)
  return off
}

export function css(
  el: HTMLElement,
  styles: Partial<CSSStyleDeclaration> | Record<string, string | number | null>,
): void {
  for (const [key, value] of Object.entries(styles)) {
    if (value === null || value === undefined) {
      el.style.removeProperty(kebab(key))
    } else {
      ;(el.style as unknown as Record<string, string>)[key] = String(value)
    }
  }
}

export function kebab(str: string): string {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  ) || (navigator.maxTouchPoints > 1 && window.matchMedia('(pointer: coarse)').matches)
}

export function getScrollbarWidth(): number {
  return window.innerWidth - document.documentElement.clientWidth
}

export function lockScroll(lock: boolean): void {
  const html = document.documentElement
  if (lock) {
    const width = getScrollbarWidth()
    html.classList.add('glare-lock')
    if (width > 0) html.style.marginRight = `${width}px`
  } else if (!document.querySelector('.glare-container')) {
    html.classList.remove('glare-lock')
    html.style.marginRight = ''
  }
}

export function translate(
  template: string,
  dict: Record<string, string>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => dict[key] ?? '')
}

export function getOffset(el: HTMLElement): DOMRect {
  return el.getBoundingClientRect()
}

export function getCenter(el: HTMLElement): { x: number; y: number } {
  const rect = getOffset(el)
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  }
}

export function requestAnimFrame(cb: FrameRequestCallback): number {
  return window.requestAnimationFrame(cb)
}

export function nextFrame(cb: () => void): void {
  requestAnimFrame(() => requestAnimFrame(cb))
}

export function parseDataOptions(el: HTMLElement): Record<string, unknown> {
  const raw = el.getAttribute('data-options') || el.getAttribute('data-glare-options')
  if (!raw) return {}
  try {
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return {}
  }
}

export function getAttr(
  el: HTMLElement,
  names: string[],
): string | null {
  for (const name of names) {
    const value = el.getAttribute(name)
    if (value !== null && value !== '') return value
  }
  return null
}

export function toArray<T>(value: T | T[] | null | undefined): T[] {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

export function uniqueId(prefix = 'glare'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

export function buildQuery(params: Record<string, string | number | boolean>): string {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&')
}
