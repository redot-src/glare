export function $(selector: string, root: ParentNode = document): HTMLElement | null {
  return root.querySelector<HTMLElement>(selector)
}

export function $$(selector: string, root: ParentNode = document): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(selector))
}

export function createEl<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = '',
  html = '',
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag)
  if (className) el.className = className
  if (html) el.innerHTML = html
  return el
}

/** Parses an HTML string and returns its first element. */
export function fromHtml(html: string): HTMLElement {
  const wrapper = createEl('div', '', html.trim())
  return wrapper.firstElementChild as HTMLElement
}

/** Resolves a selector or element, searching `root` first and then the document. */
export function resolveElement(
  target: string | HTMLElement | null | undefined,
  root: ParentNode = document,
): HTMLElement | null {
  if (!target) return null
  if (typeof target !== 'string') return target
  return $(target, root) ?? $(target)
}

export function toCssSize(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}

/** Adds an event listener and returns a function that removes it. */
export function on<K extends keyof GlobalEventHandlersEventMap>(
  target: EventTarget,
  type: K,
  handler: (event: GlobalEventHandlersEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): () => void
export function on(
  target: EventTarget,
  type: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions,
): () => void
export function on(
  target: EventTarget,
  type: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions,
): () => void {
  target.addEventListener(type, handler, options)
  return () => target.removeEventListener(type, handler, options)
}

/** Runs `callback` after the browser has painted the current frame. */
export function nextFrame(callback: () => void): void {
  requestAnimationFrame(() => requestAnimationFrame(callback))
}

/**
 * Runs `done` exactly once when a transition on `el` ends,
 * or after `duration` as a fallback for transitions that never fire.
 */
export function afterTransition(el: HTMLElement, duration: number, done: () => void): void {
  let finished = false
  const finish = () => {
    if (finished) return
    finished = true
    clearTimeout(timer)
    el.removeEventListener('transitionend', onEnd)
    done()
  }
  const onEnd = (event: Event) => {
    if (event.target === el) finish()
  }
  el.addEventListener('transitionend', onEnd)
  const timer = setTimeout(finish, duration + 50)
}
