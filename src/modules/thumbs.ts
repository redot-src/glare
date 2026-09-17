import type { ThumbsOptions } from '../types'
import type { Glare } from '../core/glare'
import { $, $$, createEl, on, resolveElement, toText } from '../utils/dom'
import { translate } from '../utils/template'

/** Clickable thumbnail strip, horizontal (`x`) or vertical (`y`). */
export class Thumbs {
  isActive = false
  private readonly axis: 'x' | 'y'
  private readonly strip: HTMLElement
  private readonly list: HTMLElement
  private offs: Array<() => void> = []

  constructor(
    private readonly glare: Glare,
    private readonly container: HTMLElement,
    private readonly opts: ThumbsOptions,
  ) {
    this.axis = opts.axis === 'y' ? 'y' : 'x'
    this.list = createEl('div', 'glare-thumbs-list')
    this.strip = createEl('div', `glare-thumbs glare-thumbs--${this.axis}`)
    this.strip.style.setProperty('--glare-thumbs-fit', opts.fit ?? 'cover')
    this.strip.appendChild(this.list)
    this.build()
  }

  show(): void {
    this.setActive(true)
  }

  hide(): void {
    this.setActive(false)
  }

  toggle(): void {
    this.setActive(!this.isActive)
  }

  /** Highlights the thumbnail for `index` and scrolls it into view. */
  focus(index = this.glare.currIndex): void {
    for (const el of $$('.glare-thumbs-item', this.list)) {
      el.classList.toggle('glare-is-active', Number(el.dataset.index) === index)
    }
    this.list
      .querySelector('.glare-is-active')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
  }

  destroy(): void {
    this.offs.forEach((off) => off())
    this.offs = []
    this.container.classList.remove(`glare-thumbs-axis-${this.axis}`)
    this.strip.remove()
  }

  private setActive(active: boolean): void {
    this.isActive = active
    this.strip.classList.toggle('glare-thumbs--active', active)
    this.container.classList.toggle('glare-show-thumbs', active)

    const button = $('[data-glare-thumbs]', this.container)
    button?.classList.toggle('glare-is-active', active)
    button?.setAttribute('aria-expanded', String(active))
  }

  private build(): void {
    const { group, dict } = this.glare
    if (group.length < 2) return

    this.container.classList.add(`glare-thumbs-axis-${this.axis}`)

    for (const item of group) {
      const button = createEl('button', 'glare-thumbs-item')
      button.type = 'button'
      button.dataset.index = String(item.index)
      button.setAttribute('aria-label', translate(dict.GO_TO_SLIDE, { index: String(item.index + 1) }))

      const src = item.thumb || (item.type === 'image' ? item.src : '')
      if (src) {
        const img = createEl('img')
        img.src = src
        img.alt = item.alt || toText(item.caption)
        img.loading = 'lazy'
        button.appendChild(img)
      } else {
        button.textContent = String(item.index + 1)
      }

      this.list.appendChild(button)
      this.offs.push(on(button, 'click', () => this.glare.jumpTo(item.index)))
    }

    const parent = resolveElement(this.opts.parentEl, this.container) ?? this.container
    parent.appendChild(this.strip)
    if (this.opts.autoStart) this.show()
    this.focus()
  }
}
