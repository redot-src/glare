import type { ClickAction, ClickActionName } from '../types'
import type { Glare } from './glare'
import { $$, on } from '../utils/dom'
import { registry } from './registry'

type ButtonHandler = (glare: Glare) => void

/** Toolbar / navigation buttons, matched against `event.target` in order. */
const BUTTONS: Array<[selector: string, handler: ButtonHandler]> = [
  ['[data-glare-close]', (g) => g.close()],
  ['[data-glare-next]', (g) => g.next()],
  ['[data-glare-prev]', (g) => g.prev()],
  ['[data-glare-zoom]', (g) => g.toggleZoom()],
  ['[data-glare-slideshow]', (g) => g.slideshow?.toggle()],
  ['[data-glare-thumbs]', (g) => g.thumbs?.toggle()],
  ['[data-glare-fullscreen]', (g) => g.fullscreen?.toggle()],
  ['[data-glare-share]', (g) => g.share?.open()],
]

const CONTENT = '.glare-content'
const SLIDE_AREA = '.glare-slide, .glare-stage'
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
const FORM_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

/** How long a single click waits for a possible second click when a double-click action exists. */
const DBLCLICK_WINDOW = 300

/** Wires clicks, keyboard, focus trapping and idle tracking. Returns a cleanup function. */
export function bindInteractions(glare: Glare, container: HTMLElement, onActivity: () => void): () => void {
  let pendingClick: ReturnType<typeof setTimeout> | null = null
  const cancelPending = () => {
    if (pendingClick) clearTimeout(pendingClick)
    pendingClick = null
  }

  const offs = [
    on(container, 'click', (event) => {
      if (glare.consumeGesture()) return

      const target = event.target as HTMLElement
      const more = target.closest<HTMLElement>('[data-glare-more]')

      if (more) {
        const toolbar = more.closest('.glare-toolbar')
        const expanded = !toolbar?.classList.contains('glare-toolbar--expanded')
        toolbar?.classList.toggle('glare-toolbar--expanded', expanded)
        more.setAttribute('aria-expanded', String(expanded))
        return
      }

      closeToolbarMenu(container)
      const button = BUTTONS.find(([selector]) => target.closest(selector))
      if (button) return button[1](glare)
      if (target.closest('.glare-button')) return

      const single = slideAction(glare, target, 'click')
      if (!single) return

      // When a double-click action exists, hold the single click so a double-tap does not fire both.
      if (!resolveAction(glare, slideAction(glare, target, 'dblclick'), event)) {
        return runAction(glare, single, event)
      }
      cancelPending()
      pendingClick = setTimeout(() => runAction(glare, single, event), DBLCLICK_WINDOW)
    }),
    on(container, 'dblclick', (event) => {
      cancelPending()
      const target = event.target as HTMLElement
      if (target.closest('.glare-button')) return
      runAction(glare, slideAction(glare, target, 'dblclick'), event)
    }),
    on(document, 'keydown', (event) => onKeydown(glare, event)),
    on(document, 'keydown', onActivity),
    on(document, 'mousemove', onActivity),
    on(document, 'touchstart', onActivity, { passive: true }),
  ]

  if (glare.opts.trapFocus) {
    offs.push(on(container, 'keydown', (event) => trapFocus(container, event)))
  }

  if (glare.opts.protect) {
    offs.push(
      on(container, 'contextmenu', (event) => event.preventDefault()),
      on(container, 'dragstart', (event) => {
        if ((event.target as HTMLElement).tagName === 'IMG') event.preventDefault()
      }),
    )
  }

  return () => {
    cancelPending()
    offs.forEach((off) => off())
  }
}

/** Picks the content action or the slide action for `target`; modal mode ignores the slide area. */
function slideAction(glare: Glare, target: HTMLElement, kind: 'click' | 'dblclick'): ClickAction | undefined {
  const { opts } = glare
  if (target.closest(CONTENT)) return kind === 'click' ? opts.clickContent : opts.dblclickContent
  if (opts.modal || !target.closest(SLIDE_AREA)) return undefined
  return kind === 'click' ? opts.clickSlide : opts.dblclickSlide
}

function resolveAction(glare: Glare, action: ClickAction | undefined, event: Event): ClickActionName | false | void {
  if (!action || !glare.current) return false
  return typeof action === 'function' ? action(glare.current, event) : action
}

function runAction(glare: Glare, action: ClickAction | undefined, event: Event): void {
  switch (resolveAction(glare, action, event)) {
    case 'close':
      return glare.close()
    case 'next':
      return glare.next()
    case 'nextOrClose':
      return glare.currIndex === glare.group.length - 1 && !glare.opts.loop ? glare.close() : glare.next()
    case 'toggleControls':
      return glare.toggleControls()
    case 'zoom': {
      const point = event instanceof MouseEvent ? { x: event.clientX, y: event.clientY } : undefined
      return glare.toggleZoom(point)
    }
  }
}

function onKeydown(glare: Glare, event: KeyboardEvent): void {
  if (registry.top() !== glare) return

  if (event.key === 'Escape' && closeToolbarMenu(glare.$refs?.container ?? null)) {
    event.preventDefault()
    return
  }

  // The share overlay is its own small dialog: Escape dismisses it even from its input.
  if (event.key === 'Escape' && glare.share?.isOpen) {
    event.preventDefault()
    return glare.share.close()
  }
  if (!glare.opts.keyboard || glare.opts.modal) return

  const target = event.target as HTMLElement
  if (FORM_TAGS.has(target.tagName)) return
  // A focused button already activates on Space; don't toggle the slideshow as well.
  if (event.key === ' ' && target.closest('button')) return

  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      return glare.close()
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      return glare.next()
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      return glare.prev()
    case ' ':
      event.preventDefault()
      return glare.slideshow?.toggle()
    case 'f':
    case 'F':
      return glare.fullscreen?.toggle()
  }
}

function closeToolbarMenu(container: HTMLElement | null): boolean {
  const toolbar = container?.querySelector('.glare-toolbar--expanded')
  if (!toolbar) return false

  toolbar.classList.remove('glare-toolbar--expanded')
  toolbar.querySelector('[data-glare-more]')?.setAttribute('aria-expanded', 'false')
  return true
}

function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
  if (event.key !== 'Tab') return

  const focusable = $$(FOCUSABLE, container).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden',
  )
  if (!focusable.length) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
