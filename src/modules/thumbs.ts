import type { ThumbsOptions } from '../types'
import type { Glare } from '../core/Glare'
import { $$, createEl, on, resolveElement } from '../utils/dom'

/** Clickable thumbnail strip, horizontal (`x`) or vertical (`y`). */
export class Thumbs {
  isActive = false
  private readonly axis: 'x' | 'y'
  private strip: HTMLElement | null = null
  private list: HTMLElement | null = null
  private offs: Array<() => void> = []

  constructor(
    private readonly glare: Glare,
    private readonly opts: ThumbsOptions,
  ) {
    this.axis = opts.axis === 'y' ? 'y' : 'x'
    this.build()
  }

  show(): void {
    if (!this.strip) return
    this.isActive = true
    this.strip.classList.add('glare-thumbs--active')
    this.glare.$refs.container?.classList.add('glare-show-thumbs')
  }

  hide(): void {
    if (!this.strip) return
    this.isActive = false
    this.strip.classList.remove('glare-thumbs--active')
    this.glare.$refs.container?.classList.remove('glare-show-thumbs')
  }

  toggle(): void {
    if (this.isActive) this.hide()
    else this.show()
  }

  /** Highlights the thumbnail for `index` and scrolls it into view. */
  focus(index = this.glare.currIndex): void {
    if (!this.list) return
    for (const el of $$('.glare-thumbs-item', this.list)) {
      el.classList.toggle('is-active', Number(el.dataset.index) === index)
    }
    this.list
      .querySelector('.is-active')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
  }

  destroy(): void {
    if (this.opts.hideOnClose !== false) this.hide()
    this.offs.forEach((off) => off())
    this.offs = []
    this.glare.$refs.container?.classList.remove(`glare-thumbs-axis-${this.axis}`)
    this.strip?.remove()
    this.strip = null
    this.list = null
  }

  private build(): void {
    const { group, $refs } = this.glare
    const container = $refs.container
    if (group.length < 2 || !container) return

    const parent = resolveElement(this.opts.parentEl, container) ?? container
    this.list = createEl('div', 'glare-thumbs-list')
    this.strip = createEl('div', `glare-thumbs glare-thumbs--${this.axis}`)
    this.strip.appendChild(this.list)
    container.classList.add(`glare-thumbs-axis-${this.axis}`)

    for (const item of group) {
      const button = createEl('button', 'glare-thumbs-item')
      button.type = 'button'
      button.dataset.index = String(item.index)
      button.setAttribute('aria-label', `Go to slide ${item.index + 1}`)

      const src = item.thumb || (item.type === 'image' ? item.src : '')
      if (src) {
        const img = createEl('img')
        img.src = src
        img.alt = item.alt || item.caption
        img.loading = 'lazy'
        button.appendChild(img)
      } else {
        button.textContent = String(item.index + 1)
      }

      this.list.appendChild(button)
      this.offs.push(on(button, 'click', () => this.glare.jumpTo(item.index)))
    }

    parent.appendChild(this.strip)
    if (this.opts.autoStart) this.show()
    this.focus()
  }
}
