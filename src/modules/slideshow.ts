import type { SlideshowOptions } from '../types'
import type { Glare } from '../core/glare'
import { setToggleState } from '../core/dom'
import { slideshowDefaults } from '../defaults'
import { icons } from '../icons'
import { $ } from '../utils/dom'
import { prefersReducedMotion } from '../utils/env'

/** Advances slides on a timer and animates the top progress bar. */
export class Slideshow {
  private readonly bar: HTMLElement | null
  private readonly button: HTMLElement | null
  private timer: ReturnType<typeof setTimeout> | null = null
  private active = false

  constructor(
    private readonly glare: Glare,
    private readonly container: HTMLElement,
    private readonly opts: SlideshowOptions,
  ) {
    this.bar = $('.glare-progress', container)
    this.button = $('[data-glare-slideshow]', container)
    if (opts.autoStart) this.start()
  }

  isActive(): boolean {
    return this.active
  }

  start(): void {
    if (this.glare.group.length < 2) return

    this.active = true
    this.container.classList.add('glare-is-slideshow')
    this.syncButton()
    this.schedule()
  }

  stop(): void {
    this.active = false
    this.clearTimer()
    this.setProgress(0, true)
    this.container.classList.remove('glare-is-slideshow')
    this.syncButton()
  }

  toggle(): void {
    if (this.active) this.stop()
    else this.start()
  }

  onIndexChange(): void {
    if (this.active) this.schedule()
  }

  destroy(): void {
    this.stop()
  }

  private get speed(): number {
    return this.opts.speed ?? slideshowDefaults.speed
  }

  private get atEnd(): boolean {
    return !this.glare.opts.loop && this.glare.currIndex === this.glare.group.length - 1
  }

  private schedule(): void {
    this.clearTimer()
    this.setProgress(0)

    if (!prefersReducedMotion()) {
      // Force a reflow so the bar restarts from zero before animating.
      void this.bar?.offsetWidth
      this.setProgress(1)
    }

    this.timer = setTimeout(() => (this.atEnd ? this.stop() : this.glare.next()), this.speed)
  }

  private clearTimer(): void {
    if (this.timer) clearTimeout(this.timer)
    this.timer = null
  }

  private setProgress(value: 0 | 1, hide = false): void {
    if (!this.bar) return

    this.bar.hidden = hide
    this.bar.style.transitionDuration = value ? `${this.speed}ms` : '0ms'
    this.bar.style.transform = `scaleX(${value})`
  }

  private syncButton(): void {
    if (!this.button) return

    const { dict } = this.glare
    setToggleState(
      this.button,
      this.active,
      this.active ? dict.PLAY_STOP : dict.PLAY_START,
      this.active ? icons.pause : icons.play,
    )
  }
}
