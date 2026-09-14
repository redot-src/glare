import type { GlareInstance } from './types'
import { on } from './utils'

function parseHash(): { gallery: string; index: number } | null {
  const hash = window.location.hash.replace(/^#/, '')
  if (!hash) return null
  // Formats: gallery-1  |  gallery/2  |  glare-gallery-1
  const match = hash.match(/^(?:glare-)?(.+?)(?:-|\/)(\d+)$/)
  if (!match) return null
  return { gallery: match[1], index: Math.max(0, parseInt(match[2], 10) - 1) }
}

export function getGalleryHash(gallery: string, index: number): string {
  return `${gallery}-${index + 1}`
}

export class Hash {
  private instance: GlareInstance
  private gallery: string
  private cleanups: Array<() => void> = []
  private skipping = false

  constructor(instance: GlareInstance, gallery: string) {
    this.instance = instance
    this.gallery = gallery || 'gallery'
  }

  static parse = parseHash

  init(): void {
    this.cleanups.push(
      on(window, 'hashchange', () => {
        if (this.skipping) return
        const parsed = parseHash()
        if (!parsed || parsed.gallery !== this.gallery) {
          if (this.instance.isActive) this.instance.close()
          return
        }
        if (parsed.index !== this.instance.currIndex) {
          this.instance.jumpTo(parsed.index)
        }
      }),
    )
    this.update()
  }

  update(index = this.instance.currIndex): void {
    if (!this.gallery) return
    const next = getGalleryHash(this.gallery, index)
    if (window.location.hash.replace(/^#/, '') === next) return
    this.skipping = true
    const url = `${window.location.pathname}${window.location.search}#${next}`
    window.history.replaceState(null, '', url)
    queueMicrotask(() => {
      this.skipping = false
    })
  }

  clear(): void {
    const parsed = parseHash()
    if (parsed && parsed.gallery === this.gallery) {
      this.skipping = true
      const url = `${window.location.pathname}${window.location.search}`
      window.history.replaceState(null, '', url)
      queueMicrotask(() => {
        this.skipping = false
      })
    }
  }

  destroy(): void {
    this.clear()
    this.cleanups.forEach((fn) => fn())
    this.cleanups = []
  }
}
