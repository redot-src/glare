import type { GlareInstance, ShareOptions, SlideItem } from './types'
import { createEl, on, translate } from './utils'

const DEFAULT_TPL = `
<div class="glare-share">
  <h4 class="glare-share-title">{{SHARE}}</h4>
  <p><a class="glare-share-link" href="{{url_facebook}}" target="_blank" rel="noopener">Facebook</a></p>
  <p><a class="glare-share-link" href="{{url_twitter}}" target="_blank" rel="noopener">X / Twitter</a></p>
  <p><a class="glare-share-link" href="{{url_pinterest}}" target="_blank" rel="noopener">Pinterest</a></p>
  <p><input class="glare-share-input" type="text" value="{{url_direct}}" readonly /></p>
</div>
`

export class Share {
  private instance: GlareInstance
  private opts: ShareOptions
  private $overlay: HTMLElement | null = null
  private cleanups: Array<() => void> = []

  constructor(instance: GlareInstance, opts: ShareOptions | true) {
    this.instance = instance
    this.opts = opts === true ? {} : opts
  }

  open(): void {
    const current = this.instance.current
    if (!current || !this.instance.$refs.container) return

    this.close()

    const url = this.resolveUrl(current)
    const encoded = encodeURIComponent(url)
    const media = encodeURIComponent(current.thumb || current.src || url)
    const caption = encodeURIComponent(current.caption || '')

    const lang = this.instance.opts.lang || 'en'
    const dict = {
      ...(this.instance.opts.i18n?.en || {}),
      ...(this.instance.opts.i18n?.[lang] || {}),
      url_direct: url,
      url_facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      url_twitter: `https://twitter.com/intent/tweet?url=${encoded}&text=${caption}`,
      url_pinterest: `https://pinterest.com/pin/create/button/?url=${encoded}&media=${media}&description=${caption}`,
    } as Record<string, string>

    const html = translate(this.opts.tpl || DEFAULT_TPL, dict)
    this.$overlay = createEl('div', 'glare-share-overlay', html)
    this.instance.$refs.container.appendChild(this.$overlay)

    const input = this.$overlay.querySelector('.glare-share-input') as HTMLInputElement | null
    input?.select()

    this.cleanups.push(
      on(this.$overlay, 'click', (event) => {
        if (event.target === this.$overlay) this.close()
      }),
    )
  }

  close(): void {
    this.cleanups.forEach((fn) => fn())
    this.cleanups = []
    this.$overlay?.remove()
    this.$overlay = null
  }

  private resolveUrl(item: SlideItem): string {
    if (typeof this.opts.url === 'function') return this.opts.url(item)
    if (typeof this.opts.url === 'string') return this.opts.url
    if (item.src && /^https?:\/\//i.test(item.src)) return item.src
    return window.location.href
  }

  destroy(): void {
    this.close()
  }
}
