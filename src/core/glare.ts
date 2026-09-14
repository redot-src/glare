import type {
  BoundGroup,
  GlareInstance,
  GlareOptions,
  GlareRefs,
  I18nDict,
  LifecycleEvent,
  ResolvedOptions,
  SlideEvent,
  SlideItem,
  SlideSource,
} from '../types'
import { defaults, fullscreenDefaults, slideshowDefaults, thumbsDefaults } from '../defaults'
import { getDict } from '../i18n'
import { createItems } from '../media/items'
import { Fullscreen } from '../modules/fullscreen'
import { Gestures } from '../modules/gestures'
import { Hash } from '../modules/hash'
import { Share } from '../modules/share'
import { Slideshow } from '../modules/slideshow'
import { Thumbs } from '../modules/thumbs'
import { WheelNav } from '../modules/wheel'
import { afterTransition, nextFrame } from '../utils/dom'
import { lockScroll, prefersReducedMotion, supportsFullscreen } from '../utils/env'
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

let nextId = 0

export class Glare implements GlareInstance {
  readonly id = ++nextId
  readonly opts: ResolvedOptions
  readonly group: SlideItem[]
  readonly dict: I18nDict
  readonly zoom: Zoom
  current: SlideItem | null = null
  currIndex = 0
  prevIndex = 0
  isActive = false
  isClosing = false
  isIdle = false
  $refs: GlareRefs | null = null

  slideshow?: Slideshow
  thumbs?: Thumbs
  fullscreen?: Fullscreen
  share?: Share

  private readonly galleryName: string
  private readonly idle: IdleTimer
  private hash: Hash | null = null
  private gestures: Gestures | null = null
  private wheel: WheelNav | null = null
  private cleanups: Array<() => void> = []
  private previouslyFocused: HTMLElement | null = null

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
      stage: () => this.$refs?.stage ?? null,
      onChange: (zoomed) => this.syncZoomState(zoomed),
    })
    this.idle = new IdleTimer(this.opts.modal ? false : this.opts.idleTime, () => this.toggleControls(true))
  }

  open(index = this.currIndex): void {
    if (this.isActive) return this.jumpTo(index)
    if (!this.group.length) return
    if (this.opts.closeExisting) Glare.close(true)

    this.currIndex = this.clampIndex(index)
    this.current = this.group[this.currIndex]
    this.previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    this.emit('onInit')

    const refs = dom.buildContainer(this.opts, this.dict, this.id, this.group.length)
    const { container } = refs
    this.$refs = refs
    applyMotionSettings(container, this.opts)
    this.syncChrome()
    this.resolveParent().appendChild(container)

    this.isActive = true
    registry.add(this)
    if (this.opts.hideScrollbar) lockScroll(true)
    this.emit('onActivate')
    this.emitSlide('beforeShow', this.current)

    nextFrame(() => {
      if (!this.isActive) return

      container.classList.add('glare-is-open')
      this.showSlide(this.currIndex, true)
      this.cleanups.push(bindInteractions(this, container, () => this.onActivity()))
      this.startModules(refs)
      if (this.opts.autoFocus) this.focus()
      this.idle.reset()
    })
  }

  close(): void {
    if (!this.isActive || this.isClosing || !this.current || !this.$refs) return
    if (this.emitSlide('beforeClose', this.current) === false) return

    this.isClosing = true
    this.slideshow?.stop()
    this.idle.stop()

    const { container, bg } = this.$refs
    const duration = prefersReducedMotion() ? 0 : this.opts.animationDuration
    if (duration === 0) return this.teardown()

    container.classList.remove('glare-is-open')
    container.classList.add('glare-is-closing')
    afterTransition(bg ?? container, duration, () => this.teardown())
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

    this.thumbs?.focus(target)
    this.hash?.update(target)
    this.slideshow?.onIndexChange()
    this.emitSlide('onUpdate', this.current)
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
    this.$refs?.container.focus({ preventScroll: true })
  }

  toggleControls(force?: boolean): void {
    if (!this.$refs) return
    this.isIdle = force ?? !this.isIdle
    this.$refs.container.classList.toggle('glare-is-idle', this.isIdle)
  }

  /** True once per drag gesture, so the click that follows it can be ignored. */
  consumeGesture(): boolean {
    return this.gestures?.consumeMoved() ?? false
  }

  private async showSlide(index: number, opening: boolean): Promise<void> {
    const item = this.group[index]
    if (!this.$refs || !item) return

    const { container, stage } = this.$refs
    const slide = dom.mountSlide(stage, item, this.opts)
    if (dom.usesSmallButton(this.opts, item)) dom.addSmallButton(slide, this.opts, this.dict)
    dom.showSpinner(stage, this.opts, this.dict)
    this.emitSlide('beforeLoad', item)
    if (this.opts.image.preload) preloadNeighbours(this.group, index)

    let failed = false
    try {
      await loadContent(item, item.$content as HTMLElement, this.opts, this.dict)
    } catch (error) {
      failed = true
      dom.showError(item, error, this.opts, this.dict)
      this.emitSlide('onError', item)
      if (!this.opts.onError) console.warn('[glare]', error)
    }

    if (!this.isActive || this.currIndex !== index) return slide.remove()
    if (!failed) this.emitSlide('afterLoad', item)

    // The previous slide stays visible until the new content is ready, then they cross-fade.
    dom.hideSpinner(stage)
    if (!opening) enableTransitions(container, this.opts)
    dom.revealSlide(slide, opening)
    dom.retireSlides(stage, slide, this.opts.transitionDuration)
    this.syncZoomState(this.zoom.isZoomed)

    if (failed) return
    if (opening) animateOpen(container, item, this.opts)
    this.emitSlide('afterShow', item)
  }

  private syncChrome(): void {
    if (!this.$refs || !this.current) return
    dom.syncChrome(this.$refs, this.opts, this.dict, this.current, this.group.length, this.captionFor(this.current))
    this.syncZoomState(this.zoom.isZoomed)
  }

  private captionFor(item: SlideItem): string {
    const { caption } = this.opts
    if (typeof caption === 'function') return caption(this, item)
    return caption ?? item.caption
  }

  private syncZoomState(zoomed: boolean): void {
    if (this.$refs) dom.syncZoomButton(this.$refs.container, this.dict, zoomed, !!this.current?.$image)
  }

  private resolveParent(): HTMLElement {
    const { parentEl } = this.opts
    const el = typeof parentEl === 'string' ? document.querySelector<HTMLElement>(parentEl) : parentEl
    return el ?? document.body
  }

  private startModules({ container, stage, bg }: GlareRefs): void {
    const opts = this.opts

    const thumbs = moduleOptions(opts.thumbs, thumbsDefaults)
    if (thumbs) this.thumbs = new Thumbs(this, container, thumbs)

    const slideshow = moduleOptions(opts.slideshow, slideshowDefaults)
    if (slideshow) this.slideshow = new Slideshow(this, container, slideshow)

    const fullscreen = moduleOptions(opts.fullscreen, fullscreenDefaults)
    if (fullscreen && supportsFullscreen()) this.fullscreen = new Fullscreen(this, container, fullscreen)

    const share = moduleOptions(opts.share, {})
    if (share) this.share = new Share(this, container, share)

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
        bg,
        canPan: () => this.current?.type === 'image',
        close: () => this.close(),
        next: () => this.next(),
        prev: () => this.prev(),
      })
    }
  }

  private onActivity(): void {
    if (this.isIdle) this.toggleControls(false)
    this.idle.reset()
  }

  private teardown(): void {
    for (const module of [
      this.gestures,
      this.wheel,
      this.hash,
      this.share,
      this.thumbs,
      this.slideshow,
      this.fullscreen,
    ]) {
      module?.destroy()
    }
    this.gestures = this.wheel = this.hash = null
    this.share = this.thumbs = this.slideshow = this.fullscreen = undefined

    this.cleanups.forEach((off) => off())
    this.cleanups = []
    this.$refs?.container.remove()
    this.$refs = null

    registry.remove(this)
    if (this.opts.hideScrollbar && registry.size === 0) lockScroll(false)
    if (this.opts.backFocus) {
      const target = this.current?.$trigger ?? this.previouslyFocused
      target?.focus({ preventScroll: true })
    }

    this.isActive = false
    this.isClosing = false
    if (this.current) this.emitSlide('afterClose', this.current)
  }

  private emit(name: LifecycleEvent): unknown {
    return this.opts[name]?.(this)
  }

  private emitSlide(name: SlideEvent, item: SlideItem): unknown {
    return this.opts[name]?.(this, item)
  }

  private clampIndex(index: number): number {
    return clamp(index, 0, Math.max(0, this.group.length - 1))
  }

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
