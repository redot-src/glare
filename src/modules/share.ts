import type { ShareOptions, SlideItem } from '../types'
import type { Glare } from '../core/Glare'
import { getDict } from '../i18n'
import { shareTemplate } from '../templates'
import { createEl, on } from '../utils/dom'
import { translate } from '../utils/template'

/** Overlay with social share links and a copyable URL. */
export class Share {
  private overlay: HTMLElement | null = null
  private off: (() => void) | null = null

  constructor(
    private readonly glare: Glare,
    private readonly opts: ShareOptions,
  ) {}

  open(): void {
    const { current, $refs } = this.glare
    if (!current || !$refs.container) return
    this.close()

    const url = this.resolveUrl(current)
    const encoded = encodeURIComponent(url)
    const media = encodeURIComponent(current.thumb || current.src || url)
    const caption = encodeURIComponent(current.caption)

    const html = translate(this.opts.tpl ?? shareTemplate, {
      ...getDict(this.glare.opts),
      url_direct: url,
      url_facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      url_twitter: `https://twitter.com/intent/tweet?url=${encoded}&text=${caption}`,
      url_pinterest: `https://pinterest.com/pin/create/button/?url=${encoded}&media=${media}&description=${caption}`,
    })

    this.overlay = createEl('div', 'glare-share-overlay', html)
    $refs.container.appendChild(this.overlay)
    this.overlay.querySelector<HTMLInputElement>('.glare-share-input')?.select()
    this.off = on(this.overlay, 'click', (event) => {
      if (event.target === this.overlay) this.close()
    })
  }

  close(): void {
    this.off?.()
    this.off = null
    this.overlay?.remove()
    this.overlay = null
  }

  destroy(): void {
    this.close()
  }

  private resolveUrl(item: SlideItem): string {
    const { url } = this.opts
    if (typeof url === 'function') return url(item)
    if (url) return url
    return /^https?:\/\//i.test(item.src) ? item.src : window.location.href
  }
}
