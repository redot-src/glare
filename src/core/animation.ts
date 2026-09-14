import type { ResolvedOptions, SlideItem } from '../types'
import { nextFrame } from '../utils/dom'
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

/** Flies the opened image in from its trigger element. */
export function animateOpen(container: HTMLElement, item: SlideItem, opts: ResolvedOptions): void {
  const image = item.$image
  const trigger = item.$trigger
  if (container.dataset.animation !== 'zoom' || !image || !trigger) return

  const from = trigger.getBoundingClientRect()
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
