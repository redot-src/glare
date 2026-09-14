import type { SlideItem } from '../types'
import { on } from '../utils/dom'

export interface WheelHost {
  /** `'auto'` only navigates on image slides; `true` on every slide. */
  mode: boolean | 'auto'
  current(): SlideItem | null
  isZoomed(): boolean
  next(): void
  prev(): void
}

/** Accumulated distance that counts as one deliberate scroll. */
const STEP = 40
/** Gap between events that marks the end of a gesture, including trackpad inertia. */
const SETTLE = 150
const LINE_HEIGHT = 16

/** Mouse-wheel navigation between slides: one gesture moves one slide. */
export class WheelNav {
  private readonly off: () => void
  private distance = 0
  private fired = false
  private settle: ReturnType<typeof setTimeout> | null = null

  constructor(stage: HTMLElement, host: WheelHost) {
    this.off = on(
      stage,
      'wheel',
      (event) => {
        const current = host.current()
        if (!current || event.deltaY === 0) return
        if (host.mode === 'auto' && current.type !== 'image') return
        if (current.type === 'image' && host.isZoomed()) return

        event.preventDefault()
        this.restartSettle()
        if (this.fired) return

        this.distance += normalize(event, stage)
        if (Math.abs(this.distance) < STEP) return

        this.fired = true
        if (this.distance > 0) host.next()
        else host.prev()
      },
      { passive: false },
    )
  }

  destroy(): void {
    if (this.settle) clearTimeout(this.settle)
    this.off()
  }

  private restartSettle(): void {
    if (this.settle) clearTimeout(this.settle)
    this.settle = setTimeout(() => {
      this.distance = 0
      this.fired = false
    }, SETTLE)
  }
}

/** Converts line- and page-based deltas to pixels so every input reaches `STEP`. */
function normalize(event: WheelEvent, stage: HTMLElement): number {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * LINE_HEIGHT
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * stage.clientHeight
  return event.deltaY
}
