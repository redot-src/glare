import type { Glare } from '../core/Glare'
import { icons } from '../icons'
import { $, on } from '../utils/dom'

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
}

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
}

/** Fullscreen API wrapper with the WebKit fallback still needed by Safari. */
export class FullScreen {
  private readonly offs: Array<() => void>

  constructor(private readonly glare: Glare) {
    this.offs = [
      on(document, 'fullscreenchange', () => this.sync()),
      on(document, 'webkitfullscreenchange', () => this.sync()),
    ]
  }

  isFullscreen(): boolean {
    const doc = document as FullscreenDocument
    return Boolean(doc.fullscreenElement ?? doc.webkitFullscreenElement)
  }

  request(): void {
    const el = (this.glare.$refs.container ?? document.documentElement) as FullscreenElement
    const request = el.requestFullscreen ?? el.webkitRequestFullscreen
    void request?.call(el)
  }

  exit(): void {
    if (!this.isFullscreen()) return
    const doc = document as FullscreenDocument
    const exit = doc.exitFullscreen ?? doc.webkitExitFullscreen
    void exit?.call(document)
  }

  toggle(): void {
    if (this.isFullscreen()) this.exit()
    else this.request()
  }

  destroy(): void {
    this.exit()
    this.offs.forEach((off) => off())
  }

  private sync(): void {
    const container = this.glare.$refs.container
    if (!container) return
    const active = this.isFullscreen()
    container.classList.toggle('glare-is-fullscreen', active)

    const button = $('[data-glare-fullscreen]', container)
    if (button) {
      button.innerHTML = active ? icons.fullscreenExit : icons.fullscreen
      button.classList.toggle('is-active', active)
    }
  }
}
