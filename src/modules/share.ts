import type { ShareOptions, SlideItem } from '../types'
import type { Glare } from '../core/glare'
import { shareTemplate } from '../templates'
import { $, createEl, on, toText } from '../utils/dom'
import { translate } from '../utils/template'

/** Overlay with social share links and a copyable URL. */
export class Share {
  private overlay: HTMLElement | null = null
  private off: (() => void) | null = null

  constructor(
    private readonly glare: Glare,
    private readonly container: HTMLElement,
    private readonly opts: ShareOptions,
  ) {}

  get isOpen(): boolean {
    return this.overlay !== null
  }

  open(): void {
    const { current, dict } = this.glare
    if (!current) return
    this.close()

    const url = this.resolveUrl(current)
    const encoded = encodeURIComponent(url)
    const media = encodeURIComponent(current.thumb || current.src || url)
    const caption = encodeURIComponent(toText(current.caption))

    const html = translate(this.opts.tpl ?? shareTemplate, {
      ...dict,
      url_direct: url,
      url_facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      url_twitter: `https://twitter.com/intent/tweet?url=${encoded}&text=${caption}`,
      url_pinterest: `https://pinterest.com/pin/create/button/?url=${encoded}&media=${media}&description=${caption}`,
    })

    this.overlay = createEl('div', 'glare-share-overlay', html)
    this.container.appendChild(this.overlay)

    const input = $('.glare-share-input', this.overlay) as HTMLInputElement | null
    input?.select()

    this.off = on(this.overlay, 'click', (event) => {
      const target = event.target as HTMLElement
      if (target === this.overlay || target.closest('[data-glare-share-close]')) this.close()
      else if (target.closest('[data-glare-share-copy]')) void this.copy(url, input)
    })
  }

  close(): void {
    if (!this.overlay) return

    const hadFocus = this.overlay.contains(document.activeElement)
    this.off?.()
    this.off = null
    this.overlay.remove()
    this.overlay = null

    // Return focus into the dialog so the focus trap keeps working.
    if (!hadFocus) return
    const button = $('[data-glare-share]', this.container)
    if (button) button.focus()
    else this.glare.focus()
  }

  destroy(): void {
    this.close()
  }

  private async copy(url: string, input: HTMLInputElement | null): Promise<void> {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      input?.select()
      document.execCommand('copy')
    }
    input?.select()
  }

  private resolveUrl(item: SlideItem): string {
    const { url } = this.opts
    if (typeof url === 'function') return url(item)
    if (url) return url
    return /^https?:\/\//i.test(item.src) ? item.src : window.location.href
  }
}
