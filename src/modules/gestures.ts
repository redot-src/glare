import type { TouchOptions } from '../types'
import type { Point, Zoom, ZoomState } from '../core/zoom'
import { on } from '../utils/dom'
import { clamp } from '../utils/object'
import { ZOOM_MAX, ZOOM_MIN } from '../core/zoom'

export interface GestureHost {
  zoom: Zoom
  touch: TouchOptions
  /** Whether the current slide can be panned when zoomed. */
  canPan(): boolean
  onSwipeMove(dx: number, dy: number): void
  onSwipeEnd(dx: number, dy: number, velocity: Point): void
}

type Mode = 'idle' | 'swipe' | 'pan' | 'pinch'

const MOVE_THRESHOLD = 6
const MOMENTUM = 120
const IGNORED_TARGETS = 'a, button, input, textarea, select, video, .glare-thumbs'

const distance = (a: Point, b: Point): number => Math.hypot(a.x - b.x, a.y - b.y)
const midpoint = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })
const pointOf = (event: PointerEvent): Point => ({ x: event.clientX, y: event.clientY })

/** Swipe, pan and pinch handling on top of Pointer Events. */
export class Gestures {
  private readonly pointers = new Map<number, Point>()
  private readonly offs: Array<() => void>
  private mode: Mode = 'idle'
  private moved = false
  private start: Point[] = []
  private startTime = 0
  private startZoom: ZoomState = { scale: 1, x: 0, y: 0 }
  private startMid: Point = { x: 0, y: 0 }
  private startDistance = 0

  constructor(
    stage: HTMLElement,
    private readonly host: GestureHost,
  ) {
    this.offs = [
      on(stage, 'pointerdown', (event) => this.onDown(event)),
      on(window, 'pointermove', (event) => this.onMove(event), { passive: false }),
      on(window, 'pointerup', (event) => this.onUp(event)),
      on(window, 'pointercancel', (event) => this.onUp(event)),
    ]
  }

  destroy(): void {
    this.offs.forEach((off) => off())
    this.pointers.clear()
  }

  /** Returns whether the last gesture moved, then clears the flag. */
  consumeMoved(): boolean {
    const moved = this.moved
    this.moved = false
    return moved
  }

  private onDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if ((event.target as Element).closest(IGNORED_TARGETS)) return
    this.pointers.set(event.pointerId, pointOf(event))
    if (this.pointers.size <= 2) this.begin()
  }

  private onMove(event: PointerEvent): void {
    if (!this.pointers.has(event.pointerId)) return
    this.pointers.set(event.pointerId, pointOf(event))
    this.move(event)
  }

  private onUp(event: PointerEvent): void {
    if (!this.pointers.has(event.pointerId)) return
    this.pointers.delete(event.pointerId)
    if (this.pointers.size === 0) this.end(pointOf(event))
    else this.begin()
  }

  /** Anchors a new gesture on the currently pressed pointers. */
  private begin(): void {
    if (this.mode === 'swipe') this.host.onSwipeEnd(0, 0, { x: 0, y: 0 })
    const points = [...this.pointers.values()]
    this.start = points
    this.startTime = performance.now()
    this.startZoom = this.host.zoom.state
    this.mode = points.length >= 2 ? 'pinch' : 'idle'
    if (points.length >= 2) {
      this.startDistance = distance(points[0], points[1])
      this.startMid = midpoint(points[0], points[1])
    }
  }

  private move(event: PointerEvent): void {
    const points = [...this.pointers.values()]
    if (!this.start.length || !points.length) return

    if (this.mode === 'pinch' && points.length >= 2) {
      event.preventDefault()
      this.moved = true
      this.pinch(points[0], points[1])
      return
    }

    const dx = points[0].x - this.start[0].x
    const dy = points[0].y - this.start[0].y
    if (!this.moved && Math.hypot(dx, dy) < MOVE_THRESHOLD) return
    this.moved = true

    if (this.mode === 'idle') {
      this.mode = this.host.zoom.isZoomed && this.host.canPan() ? 'pan' : 'swipe'
    }

    if (this.mode === 'pan') {
      event.preventDefault()
      this.host.zoom.apply(this.startZoom.scale, this.startZoom.x + dx, this.startZoom.y + dy)
    } else if (this.mode === 'swipe') {
      const vertical = this.host.touch.vertical !== false
      if (!vertical && Math.abs(dy) > Math.abs(dx)) return
      event.preventDefault()
      this.host.onSwipeMove(dx, vertical ? dy : 0)
    }
  }

  /** Scales around the pinch midpoint so the content under the fingers stays put. */
  private pinch(a: Point, b: Point): void {
    const { zoom } = this.host
    const mid = midpoint(a, b)
    const center = zoom.center() ?? mid
    const scale = clamp(
      (this.startZoom.scale * distance(a, b)) / (this.startDistance || 1),
      ZOOM_MIN,
      ZOOM_MAX,
    )
    // Image-space offset of the point that was under the starting midpoint.
    const ox = (this.startMid.x - center.x - this.startZoom.x) / this.startZoom.scale
    const oy = (this.startMid.y - center.y - this.startZoom.y) / this.startZoom.scale
    zoom.apply(scale, mid.x - center.x - scale * ox, mid.y - center.y - scale * oy)
  }

  private end(last: Point): void {
    if (!this.start.length) return
    const elapsed = Math.max(performance.now() - this.startTime, 1)
    const dx = last.x - this.start[0].x
    const dy = last.y - this.start[0].y
    const velocity = { x: dx / elapsed, y: dy / elapsed }

    if (this.mode === 'swipe') {
      this.host.onSwipeEnd(dx, dy, velocity)
    } else if (this.mode === 'pan' && this.host.touch.momentum !== false) {
      const { zoom } = this.host
      zoom.apply(zoom.scale, zoom.x + velocity.x * MOMENTUM, zoom.y + velocity.y * MOMENTUM, 250)
    }

    this.mode = 'idle'
    this.start = []
    // Let the click that follows this gesture see `moved`, then forget it.
    if (this.moved) setTimeout(() => (this.moved = false), 0)
  }
}
