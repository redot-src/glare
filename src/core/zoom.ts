import { clamp } from '../utils/object'

export interface Point {
  x: number
  y: number
}

export interface ZoomState extends Point {
  scale: number
}

export interface ZoomTarget {
  image(): HTMLImageElement | null
  stage(): HTMLElement | null
  onChange(zoomed: boolean): void
}

export const ZOOM_MIN = 1
export const ZOOM_MAX = 5
const ZOOMED_THRESHOLD = 1.01

/**
 * Controls the transform of the current image.
 * The image is scaled around its centre and then translated by (x, y).
 */
export class Zoom {
  scale = ZOOM_MIN
  x = 0
  y = 0

  constructor(private readonly target: ZoomTarget) {}

  get isZoomed(): boolean {
    return this.scale > ZOOMED_THRESHOLD
  }

  get state(): ZoomState {
    return { scale: this.scale, x: this.x, y: this.y }
  }

  /** Centre of the image in viewport coordinates, ignoring the current translation. */
  center(): Point | null {
    const image = this.target.image()
    if (!image) return null
    const rect = image.getBoundingClientRect()
    return { x: rect.left + rect.width / 2 - this.x, y: rect.top + rect.height / 2 - this.y }
  }

  apply(scale: number, x: number, y: number, duration = 0): void {
    const image = this.target.image()
    if (!image) return

    this.scale = clamp(scale, ZOOM_MIN, ZOOM_MAX)
    const translate = this.isZoomed ? this.bounded(x, y) : { x: 0, y: 0 }
    this.x = translate.x
    this.y = translate.y

    image.style.transitionDuration = `${duration}ms`
    image.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) scale(${this.scale})`
    this.target.onChange(this.isZoomed)
  }

  toFit(duration = 300): void {
    this.apply(ZOOM_MIN, 0, 0, duration)
  }

  /** Zooms to the image's natural size (at least 1.5x), keeping `focus` under the pointer. */
  toActual(focus?: Partial<Point>, duration = 300): void {
    const image = this.target.image()
    const center = this.center()
    if (!image || !center) return

    const natural = image.naturalWidth / Math.max(image.offsetWidth, 1)
    const scale = clamp(Math.max(natural, 1.5), ZOOM_MIN, ZOOM_MAX)
    const fx = focus?.x ?? center.x
    const fy = focus?.y ?? center.y
    this.apply(scale, (center.x - fx) * (scale - 1), (center.y - fy) * (scale - 1), duration)
  }

  reset(): void {
    const image = this.target.image()
    if (image) {
      image.style.transform = ''
      image.style.transitionDuration = ''
    }
    this.scale = ZOOM_MIN
    this.x = 0
    this.y = 0
    this.target.onChange(false)
  }

  /** Keeps the scaled image from being dragged fully out of the stage. */
  private bounded(x: number, y: number): Point {
    const image = this.target.image()
    const stage = this.target.stage()
    if (!image || !stage) return { x, y }
    const maxX = Math.max(0, (image.offsetWidth * this.scale - stage.clientWidth) / 2)
    const maxY = Math.max(0, (image.offsetHeight * this.scale - stage.clientHeight) / 2)
    return { x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) }
  }
}
