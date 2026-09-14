import type { Glare } from '../core/glare'
import { on } from '../utils/dom'

const HASH_PATTERN = /^(.+)-(\d+)$/

/** Parses `#gallery-3` into `{ gallery: 'gallery', index: 2 }`. */
export function parseHash(hash = window.location.hash): { gallery: string; index: number } | null {
  const match = hash.replace(/^#/, '').match(HASH_PATTERN)
  if (!match) return null
  return { gallery: match[1], index: Math.max(0, parseInt(match[2], 10) - 1) }
}

function formatHash(gallery: string, index: number): string {
  return `${gallery}-${index + 1}`
}

/**
 * Keeps the URL hash in sync with the current slide of a named gallery.
 * Opening pushes one history entry so the browser's Back button closes the lightbox;
 * slide changes replace it so Back never walks through every slide.
 */
export class Hash {
  private readonly off: () => void
  private pushed = false

  constructor(
    private readonly glare: Glare,
    private readonly gallery: string,
  ) {
    this.off = on(window, 'hashchange', () => this.onHashChange())

    const next = formatHash(gallery, glare.currIndex)
    if (currentHash() !== next) {
      window.history.pushState(null, '', `#${next}`)
      this.pushed = true
    }
  }

  update(index = this.glare.currIndex): void {
    const next = formatHash(this.gallery, index)
    if (currentHash() !== next) this.replace(`#${next}`)
  }

  destroy(): void {
    this.off()
    if (parseHash()?.gallery !== this.gallery) return

    if (this.pushed) window.history.back()
    else this.replace('')
  }

  private onHashChange(): void {
    const parsed = parseHash()
    if (!parsed || parsed.gallery !== this.gallery) {
      this.pushed = false
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

const currentHash = (): string => window.location.hash.replace(/^#/, '')
