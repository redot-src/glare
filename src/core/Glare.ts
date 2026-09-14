import type {
  BoundGroup,
  EventName,
  GlareInstance,
  GlareOptions,
  GlareRefs,
  SlideItem,
  SlideSource,
} from '../types'
import { defaults, fullscreenDefaults, slideshowDefaults, thumbsDefaults } from '../defaults'
import { getDict } from '../i18n'
import { icons } from '../icons'
import { createItems } from '../media/items'
import { FullScreen } from '../modules/fullscreen'
import { Gestures } from '../modules/gestures'
import { Hash } from '../modules/hash'
import { Share } from '../modules/share'
import { Slideshow } from '../modules/slideshow'
import { Thumbs } from '../modules/thumbs'
import { WheelNav } from '../modules/wheel'
import { $, afterTransition, nextFrame } from '../utils/dom'
import { lockScroll, prefersReducedMotion } from '../utils/env'
import { clamp } from '../utils/object'
import { animateOpen, applyMotionSettings, enableTransitions } from './animation'
import { bind, unbindAll, type BindTarget } from './bind'
import * as dom from './dom'
import { IdleTimer } from './idle'
import { bindInteractions } from './interactions'
import { loadContent, preloadNeighbours } from './loaders'
import { moduleOptions, resolveOptions } from './options'
import { registry } from './registry'
import { Zoom, type Point } from './zoom'

const SWIPE_CLOSE_DISTANCE = 100
const SWIPE_CLOSE_VELOCITY = 0.5
const SWIPE_NAV_DISTANCE = 80
const SWIPE_NAV_VELOCITY = 0.4

let nextId = 0

export class Glare implements GlareInstance {
  readonly id = ++nextId
  readonly opts: GlareOptions
  readonly group: SlideItem[]
  current: SlideItem | null = null
  currIndex = 0
  prevIndex = 0
  isActive = false
  isClosing = false
  isIdle = false
  $refs: GlareRefs = dom.emptyRefs()

  SlideShow?: Slideshow
  Thumbs?: Thumbs
  FullScreen?: FullScreen
  Share?: Share

  readonly zoom: Zoom
  private readonly dict: Record<string, string>
  private readonly galleryName: string
  private readonly idle: IdleTimer
  private hash: Hash | null = null
  private gestures: Gestures | null = null
  private wheel: WheelNav | null = null
  private cleanups: Array<() => void> = []
  private previouslyFocused: Element | null = null

  constructor(
    items: Array<SlideSource | string> | HTMLElement[],
    options: GlareOptions = {},
    index = 0,
    galleryName = '',
  ) {
    this.opts = resolveOptions(options)
    this.dict = getDict(this.opts)
    this.group = createItems(items, this.opts)
    this.galleryName = galleryName
    this.currIndex = this.clampIndex(index)
    this.zoom = new Zoom({
      image: () => this.current?.$image ?? null,
      stage: () => this.$refs.stage,
      onChange: (zoomed) => this.syncZoomState(zoomed),
    })
    this.idle = new IdleTimer(this.opts.modal ? false : this.opts.idleTime ?? false, () =>
      this.toggleControls(true),
    )
  }

  /* ------------------------------------------------------------------ */
  /* Lifecycle                                                           */
  /* ------------------------------------------------------------------ */

  open(index = this.currIndex): void {
    if (this.isActive) {
      this.jumpTo(index)
      return
    }
    if (!this.group.length) return
    if (this.opts.closeExisting) Glare.close(true)

    this.currIndex = this.clampIndex(index)
    this.current = this.group[this.currIndex]
    this.previouslyFocused = document.activeElement
    this.emit('onInit')

    this.$refs = dom.buildContainer(this.opts, this.dict, this.id, this.group.length)
    const container = this.$refs.container as HTMLElement
    applyMotionSettings(container, this.opts)
    this.syncChrome()
    dom.resolveParent(this.opts.parentEl).appendChild(container)

    this.isActive = true
    registry.add(this)
    if (this.opts.hideScrollbar) lockScroll(true)
    this.emit('onActivate')
    this.emit('beforeShow', this.current)

    nextFrame(() => {
      if (!this.isActive) return
      container.classList.add('glare-is-open')
      this.showSlide(this.currIndex, true)
      this.cleanups.push(bindInteractions(this, () => this.onActivity()))
      this.startModules()
      if (this.opts.autoFocus) this.focus()
      this.idle.reset()
    })
  }

  close(): void {
    if (!this.isActive || this.isClosing) return
    if (this.emit('beforeClose', this.current) === false) return

    this.isClosing = true
    this.SlideShow?.stop()
    this.idle.stop()

    const { container, bg } = this.$refs
    const duration = prefersReducedMotion() ? 0 : this.opts.animationDuration ?? 0
    if (container && duration > 0) {
      container.classList.remove('glare-is-open')
      container.classList.add('glare-is-closing')
      afterTransition(bg ?? container, duration, () => this.teardown())
    } else {
      this.teardown()
    }
  }

  next(): void {
    this.jumpTo(this.currIndex + 1)
  }

  prev(): void {
    this.jumpTo(this.currIndex - 1)
  }

  jumpTo(index: number): void {
    if (!this.isActive || this.isClosing) return
    const total = this.group.length
    const target = this.opts.loop ? ((index % total) + total) % total : clamp(index, 0, total - 1)
    if (target === this.currIndex) return

    this.prevIndex = this.currIndex
    this.currIndex = target
    this.zoom.reset()
    this.current = this.group[target]
    this.syncChrome()
    this.showSlide(target, false)

    this.Thumbs?.focus(target)
    this.hash?.update(target)
    this.SlideShow?.onIndexChange()
    this.emit('onUpdate', this.current)
  }

  /* ------------------------------------------------------------------ */
  /* Public helpers                                                      */
  /* ------------------------------------------------------------------ */

  scaleToFit(): void {
    this.zoom.toFit()
  }

  scaleToActual(x?: number, y?: number): void {
    this.zoom.toActual({ x, y })
  }

  toggleZoom(focus?: Point): void {
    if (this.current?.type !== 'image') return
    if (this.zoom.isZoomed) this.zoom.toFit()
    else this.zoom.toActual(focus)
  }

  update(): void {
    this.syncChrome()
  }

  focus(): void {
    this.$refs.container?.focus({ preventScroll: true })
  }

  toggleControls(force?: boolean): void {
    const container = this.$refs.container
    if (!container) return
    this.isIdle = force ?? !this.isIdle
    container.classList.toggle('glare-is-idle', this.isIdle)
  }

  /** True once per drag gesture, so the click that follows it can be ignored. */
  consumeGesture(): boolean {
    return this.gestures?.consumeMoved() ?? false
  }

  /* ------------------------------------------------------------------ */
  /* Slides                                                              */
  /* ------------------------------------------------------------------ */

  private showSlide(index: number, opening: boolean): void {
    const { container, stage } = this.$refs
    const item = this.group[index]
    if (!container || !stage || !item) return

    const slide = dom.mountSlide(stage, item, this.opts)
    item.$slide = slide
    item.$content = $('.glare-content', slide)

    if (dom.usesSmallButton(this.opts, item)) dom.addSmallButton(slide, this.opts, this.dict)
    dom.showSpinner(stage, this.opts.spinnerTpl)
    this.emit('beforeLoad', item)

    // The previous slide stays visible until the new content is ready, then they cross-fade.
    const reveal = () => {
      dom.hideSpinner(stage)
      if (!opening) enableTransitions(container, this.opts)
      dom.revealSlide(slide, opening)
      dom.retireSlides(stage, slide, this.opts.transitionDuration ?? 0)
      this.syncZoomState(this.zoom.isZoomed)
    }

    loadContent(item, this.opts)
      .then(() => {
        if (this.isStale(index)) return slide.remove()
        this.emit('afterLoad', item)
        reveal()
        if (opening) animateOpen(container, item, this.opts)
        this.emit('afterShow', item)
        this.emit('onReveal', item)
      })
      .catch(() => {
        if (this.isStale(index)) return slide.remove()
        dom.showError(item, this.opts, this.dict)
        reveal()
      })

    if (this.opts.image?.preload) preloadNeighbours(this.group, index)
  }

  private isStale(index: number): boolean {
    return !this.isActive || this.currIndex !== index
  }

  private syncChrome(): void {
    const { container, toolbar, infobar, caption } = this.$refs
    const item = this.current
    if (!container || !item) return

    dom.setTypeClass(container, item.type)
    if (toolbar) dom.syncToolbar(toolbar, this.opts, item)
    dom.syncDownloadLink(container, item)

    const index = this.currIndex
    const total = this.group.length
    const indexEl = infobar && $('.glare-infobar-index', infobar)
    if (indexEl) indexEl.textContent = `${index + 1} / ${total}`

    if (caption) {
      const text = this.captionFor(item)
      caption.innerHTML = text
      caption.classList.toggle(dom.HIDDEN, !text)
    }

    const atStart = !this.opts.loop && index === 0
    const atEnd = !this.opts.loop && index === total - 1
    $('[data-glare-prev]', container)?.classList.toggle('glare-disabled', atStart)
    $('[data-glare-next]', container)?.classList.toggle('glare-disabled', atEnd)
    container.setAttribute('aria-label', dom.dialogLabel(item, index, total))
    this.syncZoomState(this.zoom.isZoomed)
  }

  private captionFor(item: SlideItem): string {
    const { caption } = this.opts
    if (typeof caption === 'function') return caption(this, item)
    return caption ?? item.caption
  }

  private syncZoomState(zoomed: boolean): void {
    const container = this.$refs.container
    if (!container) return
    container.classList.toggle('glare-can-zoom-out', zoomed)
    container.classList.toggle('glare-can-zoom-in', !zoomed && !!this.current?.$image)

    const button = $('[data-glare-zoom]', container)
    const state = zoomed ? 'out' : 'in'
    if (button && button.dataset.state !== state) {
      button.dataset.state = state
      button.innerHTML = zoomed ? icons.zoomOut : icons.zoomIn
      button.classList.toggle('is-active', zoomed)
    }
  }

  /* ------------------------------------------------------------------ */
  /* Modules and input                                                   */
  /* ------------------------------------------------------------------ */

  private startModules(): void {
    const { stage } = this.$refs
    const opts = this.opts
    if (!stage) return

    const thumbs = moduleOptions(opts.thumbs, thumbsDefaults)
    if (thumbs) this.Thumbs = new Thumbs(this, thumbs)

    const slideshow = moduleOptions(opts.slideShow, slideshowDefaults)
    if (slideshow) this.SlideShow = new Slideshow(this, slideshow)

    const fullscreen = moduleOptions(opts.fullScreen, fullscreenDefaults)
    if (fullscreen) {
      this.FullScreen = new FullScreen(this)
      if (fullscreen.autoStart) this.FullScreen.request()
    }

    const share = moduleOptions(opts.share, {})
    if (share) this.Share = new Share(this, share)

    if (opts.hash && this.galleryName) this.hash = new Hash(this, this.galleryName)

    if (opts.wheel) {
      this.wheel = new WheelNav(stage, {
        mode: opts.wheel,
        current: () => this.current,
        isZoomed: () => this.zoom.isZoomed,
        next: () => this.next(),
        prev: () => this.prev(),
      })
    }

    if (opts.touch) {
      this.gestures = new Gestures(stage, {
        zoom: this.zoom,
        touch: opts.touch,
        canPan: () => this.current?.type === 'image',
        onSwipeMove: (dx, dy) => this.dragStage(dx, dy),
        onSwipeEnd: (dx, dy, velocity) => this.releaseStage(dx, dy, velocity),
      })
    }
  }

  private onActivity(): void {
    if (this.isIdle) this.toggleControls(false)
    this.idle.reset()
  }

  private dragStage(dx: number, dy: number): void {
    const { stage, bg } = this.$refs
    if (!stage) return
    stage.style.transitionDuration = '0ms'
    stage.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
    if (bg) {
      bg.style.transitionDuration = '0ms'
      bg.style.opacity = String(clamp(1 - Math.abs(dy) / 400, 0.35, 1))
    }
  }

  private releaseStage(dx: number, dy: number, velocity: Point): void {
    const { stage, bg } = this.$refs
    if (!stage) return
    stage.style.transitionDuration = ''
    stage.style.transform = ''
    if (bg) {
      bg.style.transitionDuration = ''
      bg.style.opacity = ''
    }

    const vertical = Math.abs(dy) > Math.abs(dx)
    if (vertical && (Math.abs(dy) > SWIPE_CLOSE_DISTANCE || Math.abs(velocity.y) > SWIPE_CLOSE_VELOCITY)) {
      this.close()
    } else if (!vertical && (Math.abs(dx) > SWIPE_NAV_DISTANCE || Math.abs(velocity.x) > SWIPE_NAV_VELOCITY)) {
      if (dx < 0) this.next()
      else this.prev()
    }
  }

  /* ------------------------------------------------------------------ */
  /* Teardown                                                            */
  /* ------------------------------------------------------------------ */

  private teardown(): void {
    for (const module of [
      this.gestures,
      this.wheel,
      this.hash,
      this.Share,
      this.Thumbs,
      this.SlideShow,
      this.FullScreen,
    ]) {
      module?.destroy()
    }
    this.gestures = this.wheel = this.hash = null
    this.Share = this.Thumbs = this.SlideShow = this.FullScreen = undefined

    this.cleanups.forEach((off) => off())
    this.cleanups = []
    this.$refs.container?.remove()
    this.$refs = dom.emptyRefs()

    registry.remove(this)
    if (this.opts.hideScrollbar && registry.size === 0) lockScroll(false)
    if (this.opts.backFocus) {
      const target = this.current?.$trigger ?? (this.previouslyFocused as HTMLElement | null)
      target?.focus?.({ preventScroll: true })
    }

    this.isActive = false
    this.isClosing = false
    this.emit('afterClose', this.current)
    this.emit('onDeactivate')
    this.emit('onDestroy')
  }

  private emit(name: EventName, current?: SlideItem | null): unknown {
    return this.opts[name]?.(this, current ?? undefined)
  }

  private clampIndex(index: number): number {
    return clamp(index, 0, Math.max(0, this.group.length - 1))
  }

  /* ------------------------------------------------------------------ */
  /* Static API                                                          */
  /* ------------------------------------------------------------------ */

  static defaults = defaults

  static open(
    items: Array<SlideSource | string> | HTMLElement[],
    options: GlareOptions = {},
    index = 0,
  ): Glare {
    const instance = new Glare(items, options, index)
    instance.open()
    return instance
  }

  static bind(target: BindTarget, options: GlareOptions = {}): BoundGroup {
    return bind(target, options, (elements, index, gallery) => {
      new Glare(elements, options, index, gallery).open()
    })
  }

  static close(all = false): void {
    if (all) registry.all().reverse().forEach((instance) => instance.close())
    else registry.top()?.close()
  }

  static getInstance(id?: number): Glare | null {
    return id == null ? registry.top() : registry.get(id)
  }

  static getInstances(): Glare[] {
    return registry.all()
  }

  /** Closes every instance and removes all `bind()` handlers. */
  static destroy(): void {
    Glare.close(true)
    unbindAll()
  }

  /** Binds every `[data-glare]` element once the DOM is ready. */
  static autoBind(options: GlareOptions = {}): void {
    const run = () => Glare.bind('[data-glare]', options)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run, { once: true })
    } else {
      run()
    }
  }
}
