import type { SlideItem } from '../types'
import { on } from '../utils/dom'

export interface WheelHost {
  /** `'auto'` only navigates on image slides; `true` / `'slide'` on every slide. */
  mode: boolean | 'auto' | 'slide'
  current(): SlideItem | null
  isZoomed(): boolean
  next(): void
  prev(): void
}

const COOLDOWN = 350

/** Mouse-wheel navigation between slides. */
export class WheelNav {
  private readonly off: () => void
  private locked = false

  constructor(stage: HTMLElement, host: WheelHost) {
    this.off = on(
      stage,
      'wheel',
      (event) => {
        const current = host.current()
        if (this.locked || !current) return
        if (host.mode === 'auto' && current.type !== 'image') return
        if (current.type === 'image' && host.isZoomed()) return

        event.preventDefault()
        this.locked = true
        setTimeout(() => (this.locked = false), COOLDOWN)
        if (event.deltaY > 0) host.next()
        else host.prev()
      },
      { passive: false },
    )
  }

  destroy(): void {
    this.off()
  }
}
