import type { GlareInstance } from './types'
import { icons } from './icons'
import { on } from './utils'

type FsDoc = Document & {
  webkitFullscreenElement?: Element
  mozFullScreenElement?: Element
  msFullscreenElement?: Element
  webkitExitFullscreen?: () => Promise<void>
  mozCancelFullScreen?: () => Promise<void>
  msExitFullscreen?: () => Promise<void>
}

type FsEl = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>
  mozRequestFullScreen?: () => Promise<void>
  msRequestFullscreen?: () => Promise<void>
}

export class FullScreen {
  private instance: GlareInstance
  private cleanups: Array<() => void> = []

  constructor(instance: GlareInstance) {
    this.instance = instance
  }

  init(): void {
    this.cleanups.push(
      on(document, 'fullscreenchange', () => this.sync()),
      on(document, 'webkitfullscreenchange', () => this.sync()),
    )
  }

  isFullscreen(): boolean {
    const doc = document as FsDoc
    return !!(
      document.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    )
  }

  request(): void {
    const el = (this.instance.$refs.container || document.documentElement) as FsEl
    const req =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen
    void req?.call(el)
  }

  exit(): void {
    const doc = document as FsDoc
    const exit =
      document.exitFullscreen ||
      doc.webkitExitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.msExitFullscreen
    if (this.isFullscreen()) void exit?.call(document)
  }

  toggle(): void {
    if (this.isFullscreen()) this.exit()
    else this.request()
  }

  private sync(): void {
    const active = this.isFullscreen()
    this.instance.$refs.container?.classList.toggle('glare-is-fullscreen', active)
    const btn = this.instance.$refs.container?.querySelector(
      '[data-glare-fullscreen]',
    ) as HTMLElement | null
    if (btn) {
      btn.innerHTML = active ? icons.fullscreenExit : icons.fullscreen
      btn.classList.toggle('is-active', active)
    }
  }

  destroy(): void {
    if (this.isFullscreen()) this.exit()
    this.cleanups.forEach((fn) => fn())
    this.cleanups = []
  }
}
