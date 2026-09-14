import type { ClickAction } from '../types'
import type { Glare } from './Glare'
import { $$, on } from '../utils/dom'
import { registry } from './registry'

type ButtonHandler = (glare: Glare, event: MouseEvent) => void

/** Toolbar / navigation buttons, matched against `event.target` in order. */
const BUTTONS: Array<[selector: string, handler: ButtonHandler]> = [
  ['[data-glare-close]', (g) => g.close()],
  ['[data-glare-next]', (g) => g.next()],
  ['[data-glare-prev]', (g) => g.prev()],
  ['[data-glare-zoom]', (g) => g.toggleZoom()],
  ['[data-glare-slideshow]', (g) => g.SlideShow?.toggle()],
  ['[data-glare-thumbs]', (g) => g.Thumbs?.toggle()],
  ['[data-glare-fullscreen]', (g) => g.FullScreen?.toggle()],
  ['[data-glare-share]', (g) => g.Share?.open()],
  ['[data-glare-download]', () => undefined],
]

const CONTENT = '.glare-content'
const SLIDE_AREA = '.glare-slide, .glare-stage, .glare-bg'
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
const FORM_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

/** Wires clicks, keyboard, focus trapping and idle tracking. Returns a cleanup function. */
export function bindInteractions(glare: Glare, onActivity: () => void): () => void {
  const container = glare.$refs.container
  if (!container) return () => undefined

  const offs = [
    on(container, 'click', (event) => onClick(glare, event)),
    on(container, 'dblclick', (event) => onDoubleClick(glare, event)),
    on(document, 'keydown', (event) => onKeydown(glare, event)),
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

  return () => offs.forEach((off) => off())
}

/** Resolves a click action and performs it. */
export function runAction(glare: Glare, action: ClickAction | undefined, event: Event): void {
  if (!action || !glare.current) return
  const name = typeof action === 'function' ? action(glare.current, event) : action

  switch (name) {
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
    default:
      return
  }
}

/** Picks the content action, the slide action, or nothing for clicks on other chrome. */
function actionFor(target: HTMLElement, content?: ClickAction, slide?: ClickAction): ClickAction | undefined {
  if (target.closest(CONTENT)) return content
  if (target.closest(SLIDE_AREA)) return slide
  return undefined
}

function onClick(glare: Glare, event: MouseEvent): void {
  if (glare.consumeGesture()) return
  const target = event.target as HTMLElement

  const button = BUTTONS.find(([selector]) => target.closest(selector))
  if (button) return button[1](glare, event)

  runAction(glare, actionFor(target, glare.opts.clickContent, glare.opts.clickSlide), event)
}

function onDoubleClick(glare: Glare, event: MouseEvent): void {
  const target = event.target as HTMLElement
  if (target.closest('.glare-button')) return
  runAction(glare, actionFor(target, glare.opts.dblclickContent, glare.opts.dblclickSlide), event)
}

function onKeydown(glare: Glare, event: KeyboardEvent): void {
  if (!glare.opts.keyboard || glare.opts.modal || registry.top() !== glare) return
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
      return glare.SlideShow?.toggle()
    case 'f':
    case 'F':
      return glare.FullScreen?.toggle()
    default:
      return
  }
}

function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
  if (event.key !== 'Tab') return
  const focusable = $$(FOCUSABLE, container).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
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
