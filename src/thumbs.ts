import type { GlareInstance, ThumbsOptions } from './types'
import { $, $$, createEl, on } from './utils'

export class Thumbs {
  isActive = false
  private instance: GlareInstance
  private opts: ThumbsOptions
  private axis: 'x' | 'y'
  private $container: HTMLElement | null = null
  private $list: HTMLElement | null = null
  private cleanups: Array<() => void> = []

  constructor(instance: GlareInstance, opts: ThumbsOptions) {
    this.instance = instance
    this.opts = opts
    this.axis = opts.axis === 'y' ? 'y' : 'x'
  }

  init(): void {
    if (this.instance.group.length < 2) return

    const parent =
      typeof this.opts.parentEl === 'string'
        ? $(this.opts.parentEl) || this.instance.$refs.container
        : this.opts.parentEl || this.instance.$refs.container

    if (!parent) return

    this.$container = createEl('div', `glare-thumbs glare-thumbs--${this.axis}`)
    this.$list = createEl('div', 'glare-thumbs-list')
    this.$container.appendChild(this.$list)
    this.instance.$refs.container?.classList.add(`glare-thumbs-axis-${this.axis}`)

    for (const item of this.instance.group) {
      const btn = createEl('button', 'glare-thumbs-item') as HTMLButtonElement
      btn.type = 'button'
      btn.setAttribute('aria-label', `Go to slide ${item.index + 1}`)
      btn.dataset.index = String(item.index)

      if (item.thumb || (item.type === 'image' && item.src)) {
        const img = createEl('img') as HTMLImageElement
        img.src = item.thumb || item.src
        img.alt = item.alt || item.caption || ''
        img.loading = 'lazy'
        btn.appendChild(img)
      } else {
        btn.textContent = String(item.index + 1)
      }

      this.$list.appendChild(btn)
      this.cleanups.push(
        on(btn, 'click', () => {
          this.instance.jumpTo(item.index)
        }),
      )
    }

    parent.appendChild(this.$container)

    if (this.opts.autoStart) this.show()
    this.focus(this.instance.currIndex)
  }

  show(): void {
    if (!this.$container) return
    this.isActive = true
    this.$container.classList.add('glare-thumbs--active')
    this.instance.$refs.container?.classList.add('glare-show-thumbs')
  }

  hide(): void {
    if (!this.$container) return
    this.isActive = false
    this.$container.classList.remove('glare-thumbs--active')
    this.instance.$refs.container?.classList.remove('glare-show-thumbs')
  }

  toggle(): void {
    if (this.isActive) this.hide()
    else this.show()
  }

  focus(index = this.instance.currIndex): void {
    if (!this.$list) return
    $$('.glare-thumbs-item', this.$list).forEach((el) => {
      el.classList.toggle('is-active', Number(el.dataset.index) === index)
    })
    const active = this.$list.querySelector('.is-active') as HTMLElement | null
    active?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
  }

  destroy(): void {
    if (this.opts.hideOnClose !== false) this.hide()
    this.cleanups.forEach((fn) => fn())
    this.cleanups = []
    this.instance.$refs.container?.classList.remove(
      `glare-thumbs-axis-${this.axis}`,
      'glare-show-thumbs',
    )
    this.$container?.remove()
    this.$container = null
    this.$list = null
  }
}
