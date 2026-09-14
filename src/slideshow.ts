import type { GlareInstance, SlideshowOptions } from './types'
import { icons } from './icons'
import { prefersReducedMotion } from './utils'

export class Slideshow {
  private instance: GlareInstance
  private opts: SlideshowOptions
  private timer: ReturnType<typeof setTimeout> | null = null
  private active = false

  constructor(instance: GlareInstance, opts: SlideshowOptions) {
    this.instance = instance
    this.opts = opts
  }

  init(): void {
    if (this.opts.autoStart) this.start()
  }

  isActive(): boolean {
    return this.active
  }

  start(): void {
    if (this.instance.group.length < 2) return
    this.active = true
    this.instance.$refs.container?.classList.add('glare-is-slideshow')
    this.updateButton()
    this.queue()
  }

  stop(): void {
    this.active = false
    this.clear()
    this.resetProgress(true)
    this.instance.$refs.container?.classList.remove('glare-is-slideshow')
    this.updateButton()
  }

  toggle(): void {
    if (this.active) this.stop()
    else this.start()
  }

  onIndexChange(): void {
    if (!this.active) return
    this.queue()
  }

  private queue(): void {
    this.clear()
    if (!this.active) return
    this.restartProgress()
    this.timer = setTimeout(() => {
      if (!this.active) return
      this.instance.next()
    }, this.opts.speed || 3000)
  }

  private clear(): void {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  private progressEl(): HTMLElement | null {
    return this.instance.$refs.container?.querySelector('.glare-progress') as HTMLElement | null
  }

  private resetProgress(hide = false): void {
    const el = this.progressEl()
    if (!el) return
    el.hidden = hide
    el.style.transitionDuration = '0ms'
    el.style.transform = 'scaleX(0)'
  }

  private restartProgress(): void {
    const el = this.progressEl()
    if (!el) return
    el.hidden = false
    this.resetProgress(false)
    if (prefersReducedMotion()) return
    void el.offsetWidth
    el.style.transitionDuration = `${this.opts.speed || 3000}ms`
    el.style.transform = 'scaleX(1)'
  }

  private updateButton(): void {
    const btn = this.instance.$refs.container?.querySelector(
      '[data-glare-slideshow]',
    ) as HTMLElement | null
    if (!btn) return
    const label = this.active
      ? this.getLabel('PLAY_STOP')
      : this.getLabel('PLAY_START')
    btn.setAttribute('title', label)
    btn.setAttribute('aria-label', label)
    btn.innerHTML = this.active ? icons.pause : icons.play
    btn.classList.toggle('is-active', this.active)
  }

  private getLabel(key: string): string {
    const lang = this.instance.opts.lang || 'en'
    const dict = {
      ...(this.instance.opts.i18n?.en || {}),
      ...(this.instance.opts.i18n?.[lang] || {}),
    } as Record<string, string>
    return dict[key] || key
  }

  destroy(): void {
    this.stop()
  }
}
