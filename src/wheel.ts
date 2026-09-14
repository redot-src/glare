import type { GlareInstance } from './types'
import { on } from './utils'

export class WheelNav {
  private instance: GlareInstance
  private mode: boolean | 'auto' | 'slide'
  private cleanups: Array<() => void> = []
  private locked = false

  constructor(instance: GlareInstance, mode: boolean | 'auto' | 'slide') {
    this.instance = instance
    this.mode = mode
  }

  init(stage: HTMLElement): void {
    if (this.mode === false) return
    this.cleanups.push(
      on(
        stage,
        'wheel',
        (event) => {
          const e = event as WheelEvent
          if (this.locked) return

          const current = this.instance.current
          if (!current) return

          if (this.mode === 'auto' && current.type !== 'image') return
          if (current.type === 'image') {
            const zoomed = this.instance.$refs.container?.classList.contains('glare-can-zoom-out')
            if (zoomed) return
          }

          e.preventDefault()
          this.locked = true
          if (e.deltaY > 0) this.instance.next()
          else this.instance.prev()
          setTimeout(() => {
            this.locked = false
          }, 350)
        },
        { passive: false },
      ),
    )
  }

  destroy(): void {
    this.cleanups.forEach((fn) => fn())
    this.cleanups = []
  }
}
