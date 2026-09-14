import type { GlareInstance, SlideItem } from './types'
import { clamp, on } from './utils'

interface Point {
  x: number
  y: number
}

interface GestureState {
  isPanning: boolean
  isSwiping: boolean
  isZooming: boolean
  startPoints: Point[]
  lastPoints: Point[]
  startDistance: number
  startScale: number
  startTranslate: Point
  currentTranslate: Point
  scale: number
  startTime: number
  moved: boolean
}

function distance(a: Point, b: Point): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.hypot(dx, dy)
}

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

function getPoints(event: TouchEvent | MouseEvent): Point[] {
  if ('touches' in event) {
    return Array.from(event.touches).map((t) => ({ x: t.clientX, y: t.clientY }))
  }
  return [{ x: event.clientX, y: event.clientY }]
}

export class Gestures {
  private instance: GlareInstance & {
    getContentEl: () => HTMLElement | null
    getImageWrap: () => HTMLElement | null
    applyZoom: (scale: number, x: number, y: number, animate?: boolean) => void
    getZoomState: () => { scale: number; x: number; y: number; min: number; max: number }
    onSwipe: (dx: number, dy: number, done: boolean, velocity?: Point) => void
    opts: { touch?: false | { vertical?: boolean; momentum?: boolean } }
  }

  private state: GestureState = {
    isPanning: false,
    isSwiping: false,
    isZooming: false,
    startPoints: [],
    lastPoints: [],
    startDistance: 0,
    startScale: 1,
    startTranslate: { x: 0, y: 0 },
    currentTranslate: { x: 0, y: 0 },
    scale: 1,
    startTime: 0,
    moved: false,
  }

  private cleanups: Array<() => void> = []
  private pointerId: number | null = null

  constructor(instance: Gestures['instance']) {
    this.instance = instance
  }

  attach(stage: HTMLElement): void {
    this.detach()

    this.cleanups.push(
      on(stage, 'pointerdown', (e) => this.onPointerDown(e as PointerEvent), { passive: false }),
      on(window, 'pointermove', (e) => this.onPointerMove(e as PointerEvent), { passive: false }),
      on(window, 'pointerup', (e) => this.onPointerUp(e as PointerEvent)),
      on(window, 'pointercancel', (e) => this.onPointerUp(e as PointerEvent)),
      on(stage, 'touchstart', (e) => this.onTouchStart(e as TouchEvent), { passive: false }),
      on(stage, 'touchmove', (e) => this.onTouchMove(e as TouchEvent), { passive: false }),
      on(stage, 'touchend', (e) => this.onTouchEnd(e as TouchEvent)),
      on(stage, 'touchcancel', (e) => this.onTouchEnd(e as TouchEvent)),
    )
  }

  detach(): void {
    this.cleanups.forEach((fn) => fn())
    this.cleanups = []
  }

  private touchEnabled(): boolean {
    return this.instance.opts.touch !== false
  }

  private onPointerDown(event: PointerEvent): void {
    if (!this.touchEnabled()) return
    if (event.pointerType === 'touch') return // handled by touch events for multi-touch
    if (event.button !== 0) return

    const target = event.target as HTMLElement
    if (target.closest('a, button, input, textarea, select, .glare-thumbs')) return

    this.pointerId = event.pointerId
    const points = [{ x: event.clientX, y: event.clientY }]
    this.begin(points)
  }

  private onPointerMove(event: PointerEvent): void {
    if (this.pointerId !== event.pointerId) return
    this.move([{ x: event.clientX, y: event.clientY }], event)
  }

  private onPointerUp(event: PointerEvent): void {
    if (this.pointerId !== event.pointerId) return
    this.pointerId = null
    this.end([{ x: event.clientX, y: event.clientY }])
  }

  private onTouchStart(event: TouchEvent): void {
    if (!this.touchEnabled()) return
    const target = event.target as HTMLElement
    if (target.closest('a, button, input, textarea, select, .glare-thumbs')) return
    this.begin(getPoints(event))
  }

  private onTouchMove(event: TouchEvent): void {
    this.move(getPoints(event), event)
  }

  private onTouchEnd(event: TouchEvent): void {
    this.end(getPoints(event))
  }

  private begin(points: Point[]): void {
    const zoom = this.instance.getZoomState()
    this.state = {
      isPanning: false,
      isSwiping: false,
      isZooming: points.length >= 2,
      startPoints: points,
      lastPoints: points,
      startDistance: points.length >= 2 ? distance(points[0], points[1]) : 0,
      startScale: zoom.scale,
      startTranslate: { x: zoom.x, y: zoom.y },
      currentTranslate: { x: zoom.x, y: zoom.y },
      scale: zoom.scale,
      startTime: performance.now(),
      moved: false,
    }
  }

  private move(points: Point[], event: Event): void {
    if (!this.state.startPoints.length) return
    const current = this.instance.current
    if (!current) return

    if (points.length >= 2 && this.state.startPoints.length >= 2) {
      event.preventDefault()
      this.state.isZooming = true
      this.state.moved = true
      const dist = distance(points[0], points[1])
      const scale = clamp(
        (dist / (this.state.startDistance || dist)) * this.state.startScale,
        1,
        5,
      )
      const mid = midpoint(points[0], points[1])
      this.state.scale = scale
      this.instance.applyZoom(scale, mid.x, mid.y, false)
      this.state.lastPoints = points
      return
    }

    if (!points.length || !this.state.startPoints.length) return

    const dx = points[0].x - this.state.startPoints[0].x
    const dy = points[0].y - this.state.startPoints[0].y
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)

    if (!this.state.moved && absX < 6 && absY < 6) return
    this.state.moved = true

    const zoom = this.instance.getZoomState()
    const canPan = zoom.scale > 1.01 && current.type === 'image'

    if (canPan || this.state.isPanning) {
      event.preventDefault()
      this.state.isPanning = true
      const x = this.state.startTranslate.x + dx
      const y = this.state.startTranslate.y + dy
      this.state.currentTranslate = { x, y }
      this.instance.applyZoom(zoom.scale, x, y, false)
    } else {
      const touchOpts = this.instance.opts.touch
      const allowVertical = touchOpts && typeof touchOpts === 'object' ? touchOpts.vertical !== false : true
      if (!allowVertical && absY > absX) return
      event.preventDefault()
      this.state.isSwiping = true
      this.instance.onSwipe(dx, dy, false)
    }

    this.state.lastPoints = points
  }

  private end(points: Point[]): void {
    if (!this.state.startPoints.length) return

    const elapsed = Math.max(performance.now() - this.state.startTime, 1)
    const last = points[0] || this.state.lastPoints[0] || this.state.startPoints[0]
    const start = this.state.startPoints[0]
    const dx = last.x - start.x
    const dy = last.y - start.y
    const velocity = { x: dx / elapsed, y: dy / elapsed }

    if (this.state.isSwiping) {
      this.instance.onSwipe(dx, dy, true, velocity)
    } else if (this.state.isPanning) {
      const touchOpts = this.instance.opts.touch
      const momentum = touchOpts && typeof touchOpts === 'object' ? touchOpts.momentum !== false : true
      if (momentum) {
        const zoom = this.instance.getZoomState()
        this.instance.applyZoom(
          zoom.scale,
          this.state.currentTranslate.x + velocity.x * 120,
          this.state.currentTranslate.y + velocity.y * 120,
          true,
        )
      }
    }

    this.state.startPoints = []
    this.state.isPanning = false
    this.state.isSwiping = false
    this.state.isZooming = false
  }

  wasMoved(): boolean {
    return this.state.moved
  }

  resetMoved(): void {
    this.state.moved = false
  }
}

export type { SlideItem }
