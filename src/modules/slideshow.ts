import type { SlideshowOptions } from '../types'
import type { Glare } from '../core/Glare'
import { getDict } from '../i18n'
import { icons } from '../icons'
import { $ } from '../utils/dom'
import { prefersReducedMotion } from '../utils/env'

const DEFAULT_SPEED = 3000

/** Advances slides on a timer and animates the top progress bar. */
export class Slideshow {
  private timer: ReturnType<typeof setTimeout> | null = null
  private active = false

  constructor(
    private readonly glare: Glare,
    private readonly opts: SlideshowOptions,
  ) {
    if (opts.autoStart) this.start()
  }

  isActive(): boolean {
    return this.active
  }

  start(): void {
    if (this.glare.group.length < 2) return
    this.active = true
    this.glare.$refs.container?.classList.add('glare-is-slideshow')
    this.syncButton()
    this.schedule()
  }

  stop(): void {
    this.active = false
    this.clearTimer()
    this.setProgress(0, true)
    this.glare.$refs.container?.classList.remove('glare-is-slideshow')
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
    return this.opts.speed ?? DEFAULT_SPEED
  }

  private schedule(): void {
    this.clearTimer()
    this.setProgress(0)
    if (!prefersReducedMotion()) {
      // Force a reflow so the bar restarts from zero before animating.
      void this.progressBar()?.offsetWidth
      this.setProgress(1)
    }
    this.timer = setTimeout(() => this.glare.next(), this.speed)
  }

  private clearTimer(): void {
    if (this.timer) clearTimeout(this.timer)
    this.timer = null
  }

  private progressBar(): HTMLElement | null {
    const container = this.glare.$refs.container
    return container && $('.glare-progress', container)
  }

  private setProgress(value: 0 | 1, hide = false): void {
    const bar = this.progressBar()
    if (!bar) return
    bar.hidden = hide
    bar.style.transitionDuration = value ? `${this.speed}ms` : '0ms'
    bar.style.transform = `scaleX(${value})`
  }

  private syncButton(): void {
    const container = this.glare.$refs.container
    const button = container && $('[data-glare-slideshow]', container)
    if (!button) return
    const label = getDict(this.glare.opts)[this.active ? 'PLAY_STOP' : 'PLAY_START']
    button.setAttribute('title', label)
    button.setAttribute('aria-label', label)
    button.innerHTML = this.active ? icons.pause : icons.play
    button.classList.toggle('is-active', this.active)
  }
}
