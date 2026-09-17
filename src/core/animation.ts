import type { Anchor, ResolvedOptions, SlideItem } from '../types'
import { nextFrame, resolveElement } from '../utils/dom'
import { prefersReducedMotion } from '../utils/env'

/** Writes the effect and duration settings onto the container for the stylesheet to use. */
export function applyMotionSettings(container: HTMLElement, opts: ResolvedOptions): void {
  const reduced = prefersReducedMotion()
  const effect = reduced ? false : opts.animationEffect
  const transition = reduced ? false : opts.transitionEffect

  container.dataset.animation = effect || 'none'
  container.style.setProperty('--glare-duration', `${effect ? opts.animationDuration : 0}ms`)
  container.style.setProperty('--glare-transition-duration', `${transition ? opts.transitionDuration : 0}ms`)
}

/** Marks the container so slide-change keyframes apply from now on. */
export function enableTransitions(container: HTMLElement, opts: ResolvedOptions): void {
  const transition = prefersReducedMotion() ? false : opts.transitionEffect
  container.dataset.transition = transition || 'none'
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
