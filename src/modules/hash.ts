import type { Glare } from '../core/Glare'
import { on } from '../utils/dom'

const HASH_PATTERN = /^(.+)-(\d+)$/

/** Parses `#gallery-3` into `{ gallery: 'gallery', index: 2 }`. */
export function parseHash(hash = window.location.hash): { gallery: string; index: number } | null {
  const match = hash.replace(/^#/, '').match(HASH_PATTERN)
  if (!match) return null
  return { gallery: match[1], index: Math.max(0, parseInt(match[2], 10) - 1) }
}

export function formatHash(gallery: string, index: number): string {
  return `${gallery}-${index + 1}`
}

/** Keeps the URL hash in sync with the current slide of a named gallery. */
export class Hash {
  private readonly off: () => void

  constructor(
    private readonly glare: Glare,
    private readonly gallery: string,
  ) {
    this.off = on(window, 'hashchange', () => this.onHashChange())
    this.update()
  }

  update(index = this.glare.currIndex): void {
    const next = formatHash(this.gallery, index)
    if (window.location.hash.replace(/^#/, '') === next) return
    this.replace(`#${next}`)
  }

  destroy(): void {
    this.off()
    if (parseHash()?.gallery === this.gallery) this.replace('')
  }

  private onHashChange(): void {
    const parsed = parseHash()
    if (!parsed || parsed.gallery !== this.gallery) {
      this.glare.close()
    } else if (parsed.index !== this.glare.currIndex) {
      this.glare.jumpTo(parsed.index)
    }
  }

  private replace(hash: string): void {
    const { pathname, search } = window.location
    window.history.replaceState(null, '', `${pathname}${search}${hash}`)
  }
}
