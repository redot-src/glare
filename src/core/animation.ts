import type { Anchor, ResolvedOptions, SlideItem } from '../types'
import { nextFrame, resolveElement } from '../utils/dom'
import { prefersReducedMotion } from '../utils/env'

/**
 * The motion actually in effect. An effect is off when it is disabled, its duration is zero,
 * or the user prefers reduced motion; its duration is then zero too. Timers must wait on these
 * values rather than the raw options, since a 0ms transition never fires `transitionend`.
 */
export function resolveMotion(opts: ResolvedOptions) {
  const reduced = prefersReducedMotion()
  const animationDuration = reduced || !opts.animationEffect ? 0 : Math.max(0, opts.animationDuration)
  const transitionDuration = reduced || !opts.transitionEffect ? 0 : Math.max(0, opts.transitionDuration)

  return {
    animationEffect: animationDuration ? opts.animationEffect : false,
    animationDuration,
    transitionEffect: transitionDuration ? opts.transitionEffect : false,
    transitionDuration,
  }
}

/** Writes the effect and duration settings onto the container for the stylesheet to use. */
export function applyMotionSettings(container: HTMLElement, opts: ResolvedOptions): void {
  const motion = resolveMotion(opts)

  container.dataset.animation = motion.animationEffect || 'none'
  container.style.setProperty('--glare-duration', `${motion.animationDuration}ms`)
  container.style.setProperty('--glare-transition-duration', `${motion.transitionDuration}ms`)
}

/** Marks the container so slide-change keyframes apply from now on. */
export function enableTransitions(container: HTMLElement, opts: ResolvedOptions): void {
  container.dataset.transition = resolveMotion(opts).transitionEffect || 'none'
}

const POSITION = /^(top|center|bottom)-(left|center|right)$/
const FRACTION: Record<string, number> = { top: 0, left: 0, center: 0.5, bottom: 1, right: 1 }

/** Resolves an anchor to the rectangle the image starts from; a position yields a zero-size one. */
function anchorRect(container: HTMLElement, item: SlideItem, anchor: Anchor): DOMRect | null {
  const position = typeof anchor === 'string' ? POSITION.exec(anchor) : null
  if (position) {
    const box = container.getBoundingClientRect()
    const x = box.left + box.width * FRACTION[position[2]]
    const y = box.top + box.height * FRACTION[position[1]]
    return new DOMRect(x, y, 0, 0)
  }

  // An element that is not rendered has no box to fly from.
  const rendered = (el?: HTMLElement | null) => (el?.getClientRects().length ? el : null)
  const el = (anchor !== 'trigger' && rendered(resolveElement(anchor))) || rendered(item.$trigger)

  return el ? el.getBoundingClientRect() : null
}

/** Flies the opened image in from its anchor. */
export function animateOpen(container: HTMLElement, item: SlideItem, opts: ResolvedOptions): void {
  const image = item.$image
  if (container.dataset.animation !== 'zoom' || !image) return

  const from = anchorRect(container, item, opts.anchor)
  if (!from) return

  const to = image.getBoundingClientRect()
  const scale = Math.max(from.width / Math.max(to.width, 1), from.height / Math.max(to.height, 1))
  const dx = from.left + from.width / 2 - (to.left + to.width / 2)
  const dy = from.top + from.height / 2 - (to.top + to.height / 2)

  Object.assign(image.style, {
    transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`,
    opacity: opts.zoomOpacity ? '0.2' : '1',
    transitionDuration: '0ms',
  })
  nextFrame(() => {
    Object.assign(image.style, { transform: '', opacity: '', transitionDuration: '' })
  })
}
