import type {
  ClickAction,
  EventHandler,
  EventName,
  I18nDict,
  GlareInstance,
  GlareOptions,
  SlideItem,
  SlideSource,
} from './types'
import { defaults } from './defaults'
import { Gestures } from './gestures'
import { FullScreen } from './fullscreen'
import { Hash } from './hash'
import { icons } from './icons'
import { itemsFromElements, normalizeItem } from './media'
import { Share } from './share'
import { Slideshow } from './slideshow'
import { Thumbs } from './thumbs'
import {
  $,
  $$,
  clamp,
  createEl,
  css,
  deepMerge,
  getOffset,
  isMobile,
  lockScroll,
  nextFrame,
  on,
  prefersReducedMotion,
  translate,
} from './utils'
import { WheelNav } from './wheel'

let instanceId = 0
const activeStack: Glare[] = []

function resolveParent(parentEl: string | HTMLElement | undefined): HTMLElement {
  if (!parentEl) return document.body
  if (typeof parentEl === 'string') return $(parentEl) || document.body
  return parentEl
}

export class Glare implements GlareInstance {
  id: number
  group: SlideItem[] = []
  opts: GlareOptions
  current: SlideItem | null = null
  currIndex = 0
  prevIndex = 0
  isActive = false
  isClosing = false
  isAnimating = false
  isIdle = false

  $refs: GlareInstance['$refs'] = {
    container: null,
    stage: null,
    bg: null,
    inner: null,
    caption: null,
    toolbar: null,
    infobar: null,
    navigation: null,
  }

  SlideShow?: Slideshow
  Thumbs?: Thumbs
  FullScreen?: FullScreen

  private galleryName = ''
  private cleanups: Array<() => void> = []
  private idleTimer: ReturnType<typeof setTimeout> | null = null
  private gestures: Gestures | null = null
  private hash: Hash | null = null
  private wheel: WheelNav | null = null
  private share: Share | null = null
  private zoom = { scale: 1, x: 0, y: 0, min: 1, max: 5 }
  private previouslyFocused: HTMLElement | null = null
  private openedFrom: HTMLElement | null = null

  constructor(
    items: Array<SlideSource | string> | HTMLElement[],
    options: GlareOptions = {},
    index = 0,
    galleryName = '',
  ) {
    this.id = ++instanceId
    this.galleryName = galleryName

    const merged = deepMerge(
      {},
      defaults as Record<string, unknown>,
      options as Record<string, unknown>,
    ) as GlareOptions

    if (isMobile() && merged.mobile) {
      this.opts = deepMerge(
        {},
        merged as Record<string, unknown>,
        merged.mobile as Record<string, unknown>,
      ) as GlareOptions
    } else {
      this.opts = merged
    }

    if (items.length && items[0] instanceof HTMLElement) {
      this.group = itemsFromElements(items as HTMLElement[], this.opts)
    } else {
      this.group = (items as Array<SlideSource | string>).map((item, i) =>
        normalizeItem(item, i, this.opts),
      )
    }

    this.currIndex = clamp(index, 0, Math.max(0, this.group.length - 1))
  }

  open(index = this.currIndex): void {
    if (this.isActive) {
      this.jumpTo(index)
      return
    }

    if (this.opts.closeExisting) {
      Glare.close(true)
    }

    this.currIndex = clamp(index, 0, Math.max(0, this.group.length - 1))
    this.current = this.group[this.currIndex] || null
    this.openedFrom = (this.current?.$trigger as HTMLElement) || null
    this.previouslyFocused = document.activeElement as HTMLElement | null

    this.trigger('onInit')
    this.build()
    this.isActive = true
    activeStack.push(this)

    if (this.opts.hideScrollbar) lockScroll(true)

    this.trigger('onActivate')
    this.trigger('beforeShow', this.current || undefined)

    nextFrame(() => {
      this.$refs.container?.classList.add('glare-is-open', 'glare-is-animated')
      this.loadSlide(this.currIndex, true)
      this.bindEvents()
      this.initModules()
      if (this.opts.autoFocus) this.focus()
      this.resetIdle()
    })
  }

  close(_event?: Event | null, duration?: number): void {
    if (!this.isActive || this.isClosing) return
    if (this.trigger('beforeClose', this.current || undefined) === false) return

    this.isClosing = true
    this.SlideShow?.stop()
    this.clearIdle()

    const container = this.$refs.container
    const dur =
      duration ??
      (prefersReducedMotion() ? 0 : this.opts.animationDuration || 0)

    container?.classList.add('glare-is-closing')
    container?.classList.remove('glare-is-open')

    const finish = () => {
      this.teardown()
    }

    if (dur > 0 && container) {
      const onEnd = (e: Event) => {
        if (e.target !== container) return
        container.removeEventListener('transitionend', onEnd)
        finish()
      }
      container.addEventListener('transitionend', onEnd)
      setTimeout(finish, dur + 50)
    } else {
      finish()
    }
  }

  next(duration?: number): void {
    this.jumpTo(this.currIndex + 1, duration)
  }

  previous(duration?: number): void {
    this.jumpTo(this.currIndex - 1, duration)
  }

  prev(duration?: number): void {
    this.previous(duration)
  }

  jumpTo(index: number, duration?: number): void {
    if (!this.isActive || this.isClosing) return

    const len = this.group.length
    if (!len) return

    let nextIndex = index
    if (this.opts.loop) {
      nextIndex = ((index % len) + len) % len
    } else {
      nextIndex = clamp(index, 0, len - 1)
      if (nextIndex === this.currIndex && index !== this.currIndex) return
    }

    if (nextIndex === this.currIndex) return

    this.prevIndex = this.currIndex
    this.currIndex = nextIndex
    this.current = this.group[nextIndex]
    this.resetZoom()
    this.loadSlide(nextIndex, false, duration)
    this.updateChrome()
    this.Thumbs?.focus(nextIndex)
    this.hash?.update(nextIndex)
    this.trigger('onUpdate', this.current)
  }

  scaleToFit(duration = 300): void {
    this.animateZoom(1, 0, 0, duration)
    this.$refs.container?.classList.remove('glare-can-zoom-out')
    this.$refs.container?.classList.add('glare-can-zoom-in')
    this.updateZoomButton()
  }

  scaleToActual(x?: number, y?: number, duration = 300): void {
    const wrap = this.getImageWrap()
    if (!wrap) return
    const rect = getOffset(wrap)
    const cx = x ?? rect.left + rect.width / 2
    const cy = y ?? rect.top + rect.height / 2
    const scale = Math.min(this.zoom.max, 2.5)
    const dx = (rect.left + rect.width / 2 - cx) * (scale - 1)
    const dy = (rect.top + rect.height / 2 - cy) * (scale - 1)
    this.animateZoom(scale, dx, dy, duration)
    this.$refs.container?.classList.add('glare-can-zoom-out')
    this.$refs.container?.classList.remove('glare-can-zoom-in')
    this.updateZoomButton()
  }

  update(): void {
    this.updateChrome()
    this.positionContent()
  }

  focus(): void {
    this.$refs.container?.focus({ preventScroll: true })
  }

  toggleControls(force?: boolean): void {
    const container = this.$refs.container
    if (!container) return
    const hide = force === undefined ? !container.classList.contains('glare-is-idle') : force
    container.classList.toggle('glare-is-idle', hide)
    this.isIdle = hide
  }

  getContentEl(): HTMLElement | null {
    return this.current?.$content || null
  }

  getImageWrap(): HTMLElement | null {
    return this.current?.$slide?.querySelector('.glare-content') as HTMLElement | null
  }

  getZoomState() {
    return { ...this.zoom }
  }

  applyZoom(scale: number, x: number, y: number, animate = false): void {
    this.animateZoom(scale, x, y, animate ? 250 : 0)
    const zoomed = scale > 1.01
    this.$refs.container?.classList.toggle('glare-can-zoom-out', zoomed)
    this.$refs.container?.classList.toggle('glare-can-zoom-in', !zoomed)
    this.updateZoomButton()
  }

  onSwipe(dx: number, dy: number, done: boolean, velocity?: { x: number; y: number }): void {
    const stage = this.$refs.stage
    if (!stage) return

    if (!done) {
      css(stage, {
        transform: `translate3d(${dx}px, ${dy}px, 0)`,
        transitionDuration: '0ms',
      })
      if (this.$refs.bg) {
        const opacity = clamp(1 - Math.abs(dy) / 400, 0.35, 1)
        css(this.$refs.bg, { opacity: String(opacity) })
      }
      return
    }

    const absX = Math.abs(dx)
    const absY = Math.abs(dy)
    const vx = velocity?.x || 0
    const vy = velocity?.y || 0

    css(stage, { transitionDuration: '' })
    if (this.$refs.bg) css(this.$refs.bg, { opacity: '' })

    if (absY > 100 || Math.abs(vy) > 0.5) {
      if (absY > absX) {
        this.close()
        return
      }
    }

    if (absX > 80 || Math.abs(vx) > 0.4) {
      if (dx < 0) this.next()
      else this.prev()
    }

    css(stage, { transform: '' })
  }

  /* -------------------- private -------------------- */

  private build(): void {
    const dict = this.dict()
    const tpl = translate(this.opts.baseTpl || '', dict)
    const wrapper = createEl('div', '', tpl)
    const container = wrapper.firstElementChild as HTMLElement
    container.dataset.glareId = String(this.id)
    if (this.opts.baseClass) container.classList.add(this.opts.baseClass)
    if (this.opts.modal) container.classList.add('glare-is-modal')

    this.$refs.container = container
    this.$refs.bg = $('.glare-bg', container)
    this.$refs.inner = $('.glare-inner', container)
    this.$refs.stage = $('.glare-stage', container)
    this.$refs.caption = $('.glare-caption', container)
    this.$refs.toolbar = $('.glare-toolbar', container)
    this.$refs.infobar = $('.glare-infobar', container)
    this.$refs.navigation = $('.glare-navigation', container)

    this.buildToolbar()
    this.updateChrome()

    if (!this.opts.arrows || this.group.length < 2) {
      this.$refs.navigation?.classList.add('glare-hidden')
    }
    if (!this.opts.infobar || this.group.length < 2) {
      this.$refs.infobar?.classList.add('glare-hidden')
    }

    resolveParent(this.opts.parentEl).appendChild(container)
  }

  private buildToolbar(): void {
    const toolbar = this.$refs.toolbar
    if (!toolbar) return

    const showToolbar = this.opts.toolbar === true || this.opts.toolbar === 'auto'
    if (!showToolbar) {
      toolbar.classList.add('glare-hidden')
      return
    }

    const dict = this.dict()
    const buttons = this.opts.buttons || []
    toolbar.innerHTML = ''

    for (const name of buttons) {
      if (name === 'thumbs' && this.group.length < 2) continue
      if (name === 'slideshow' && this.group.length < 2) continue
      const tpl = this.opts.btnTpl?.[name]
      if (!tpl) continue
      toolbar.insertAdjacentHTML('beforeend', translate(tpl, dict))
    }
  }

  private initModules(): void {
    const thumbsOpts = this.opts.thumbs
    if (thumbsOpts) {
      const opts =
        thumbsOpts === true
          ? { ...(defaults.thumbs as object) }
          : thumbsOpts
      this.Thumbs = new Thumbs(this, opts)
      this.Thumbs.init()
    }

    const slideShowOpts = this.opts.slideShow
    if (slideShowOpts) {
      const opts =
        slideShowOpts === true
          ? { ...(defaults.slideShow as object) }
          : slideShowOpts
      this.SlideShow = new Slideshow(this, opts)
      this.SlideShow.init()
    }

    if (this.opts.fullScreen !== false) {
      this.FullScreen = new FullScreen(this)
      this.FullScreen.init()
      const fsOpts = this.opts.fullScreen
      if (fsOpts && typeof fsOpts === 'object' && fsOpts.autoStart) {
        this.FullScreen.request()
      }
    }

    if (this.opts.share) {
      this.share = new Share(this, this.opts.share)
    }

    if (this.opts.hash && this.galleryName) {
      this.hash = new Hash(this, this.galleryName)
      this.hash.init()
    }

    if (this.opts.wheel !== false && this.$refs.stage) {
      this.wheel = new WheelNav(this, this.opts.wheel || 'auto')
      this.wheel.init(this.$refs.stage)
    }

    if (this.opts.touch !== false && this.$refs.stage) {
      this.gestures = new Gestures(this as unknown as ConstructorParameters<typeof Gestures>[0])
      this.gestures.attach(this.$refs.stage)
    }
  }

  private bindEvents(): void {
    const container = this.$refs.container
    if (!container) return

    this.cleanups.push(
      on(container, 'click', (event) => this.onClick(event as MouseEvent)),
      on(container, 'dblclick', (event) => this.onDblClick(event as MouseEvent)),
      on(document, 'keydown', (event) => this.onKeydown(event as KeyboardEvent)),
      on(window, 'resize', () => this.positionContent()),
      on(window, 'orientationchange', () => this.positionContent()),
      on(document, 'mousemove', () => this.resetIdle()),
      on(document, 'touchstart', () => this.resetIdle(), { passive: true }),
    )

    if (this.opts.trapFocus) {
      this.cleanups.push(
        on(container, 'keydown', (event) => {
          const e = event as KeyboardEvent
          if (e.key !== 'Tab') return
          const focusables = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', container)
            .filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null)
          if (!focusables.length) return
          const first = focusables[0]
          const last = focusables[focusables.length - 1]
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault()
            last.focus()
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }),
      )
    }

    if (this.opts.protect) {
      this.cleanups.push(
        on(container, 'contextmenu', (e) => {
          e.preventDefault()
        }),
        on(container, 'dragstart', (e) => {
          if ((e.target as HTMLElement).tagName === 'IMG') e.preventDefault()
        }),
      )
    }
  }

  private onClick(event: MouseEvent): void {
    if (this.gestures?.wasMoved()) {
      this.gestures.resetMoved()
      return
    }

    const target = event.target as HTMLElement

    if (target.closest('[data-glare-close]')) {
      this.close(event)
      return
    }
    if (target.closest('[data-glare-next]')) {
      this.next()
      return
    }
    if (target.closest('[data-glare-prev]')) {
      this.prev()
      return
    }
    if (target.closest('[data-glare-zoom]')) {
      this.toggleZoom(event)
      return
    }
    if (target.closest('[data-glare-slideshow]')) {
      this.SlideShow?.toggle()
      return
    }
    if (target.closest('[data-glare-thumbs]')) {
      this.Thumbs?.toggle()
      return
    }
    if (target.closest('[data-glare-fullscreen]')) {
      this.FullScreen?.toggle()
      return
    }
    if (target.closest('[data-glare-share]')) {
      this.share?.open()
      return
    }
    if (target.closest('[data-glare-download]')) {
      return
    }

    if (target.closest('.glare-content') || target.closest('.glare-space')) {
      this.handleClickAction(this.opts.clickContent, event)
      return
    }
    if (target.closest('.glare-slide')) {
      this.handleClickAction(this.opts.clickSlide, event)
      return
    }
    if (target.classList.contains('glare-bg') || target.classList.contains('glare-stage')) {
      this.handleClickAction(this.opts.clickOutside, event)
    }
  }

  private onDblClick(event: MouseEvent): void {
    const target = event.target as HTMLElement
    if (target.closest('.glare-content') || target.closest('.glare-space')) {
      this.handleClickAction(this.opts.dblclickContent, event)
    } else if (target.closest('.glare-slide')) {
      this.handleClickAction(this.opts.dblclickSlide, event)
    } else {
      this.handleClickAction(this.opts.dblclickOutside, event)
    }
  }

  private handleClickAction(action: ClickAction | undefined, event: Event): void {
    if (!action || !this.current) return
    let resolved: ClickAction | void = action
    if (typeof action === 'function') {
      resolved = action(this.current, event)
    }
    switch (resolved) {
      case 'close':
        this.close(event)
        break
      case 'next':
        this.next()
        break
      case 'nextOrClose':
        if (this.currIndex === this.group.length - 1 && !this.opts.loop) this.close(event)
        else this.next()
        break
      case 'toggleControls':
        this.toggleControls()
        break
      case 'zoom':
        this.toggleZoom(event as MouseEvent)
        break
      default:
        break
    }
  }

  private onKeydown(event: KeyboardEvent): void {
    if (!this.isActive || !this.opts.keyboard || this.opts.modal) return
    if (activeStack[activeStack.length - 1] !== this) return

    const tag = (event.target as HTMLElement)?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        this.close(event)
        break
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        this.next()
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        this.prev()
        break
      case ' ':
      case 'Spacebar':
        event.preventDefault()
        this.SlideShow?.toggle()
        break
      case 'f':
      case 'F':
        this.FullScreen?.toggle()
        break
      default:
        break
    }
  }

  private loadSlide(index: number, isOpening: boolean, _duration?: number): void {
    const stage = this.$refs.stage
    if (!stage) return

    const item = this.group[index]
    if (!item) return

    // Remove old slides except keeping adjacent for transition
    $$('.glare-slide', stage).forEach((slide) => {
      const idx = Number(slide.dataset.index)
      if (idx !== index) {
        slide.classList.add('glare-slide--out')
        setTimeout(() => slide.remove(), this.opts.transitionDuration || 366)
      }
    })

    let slide = stage.querySelector(`.glare-slide[data-index="${index}"]`) as HTMLElement | null
    if (!slide) {
      slide = createEl('div', `glare-slide${this.opts.slideClass ? ` ${this.opts.slideClass}` : ''}`)
      slide.dataset.index = String(index)
      slide.innerHTML = `
        <div class="glare-space">
          <div class="glare-content"></div>
        </div>
      `
      stage.appendChild(slide)
    }

    item.$slide = slide
    item.$content = $('.glare-content', slide)
    item.pos = index

    slide.classList.add('glare-slide--current')
    slide.classList.remove('glare-slide--out')

    if (this.shouldSmallBtn(item)) {
      const dict = this.dict()
      if (!slide.querySelector('.glare-close-small')) {
        slide.insertAdjacentHTML(
          'beforeend',
          translate(this.opts.btnTpl?.smallBtn || '', dict),
        )
      }
    }

    this.showSpinner(slide)
    this.trigger('beforeLoad', item)

    void this.resolveContent(item).then(() => {
      if (!this.isActive || this.currIndex !== index) return
      this.hideSpinner(slide!)
      this.trigger('afterLoad', item)
      this.positionContent()
      this.updateChrome()
      this.updateDownload(item)

      if (isOpening) {
        this.playOpenAnimation(item)
      } else {
        this.playTransition()
      }

      this.trigger('afterShow', item)
      this.trigger('onReveal', item)
    }).catch(() => {
      if (!this.isActive || this.currIndex !== index) return
      this.hideSpinner(slide!)
      this.showError(item)
    })

    // Preload neighbors
    if (this.opts.image?.preload) {
      ;[index - 1, index + 1].forEach((i) => {
        const neighbor = this.group[i]
        if (neighbor?.type === 'image' && neighbor.src) {
          const img = new Image()
          img.src = neighbor.src
        }
      })
    }
  }

  private shouldSmallBtn(item: SlideItem): boolean {
    if (this.opts.smallBtn === true) return true
    if (this.opts.smallBtn === false) return false
    return item.type !== 'image'
  }

  private async resolveContent(item: SlideItem): Promise<void> {
    const content = item.$content
    if (!content) throw new Error('Missing content node')
    content.innerHTML = ''
    content.className = `glare-content glare-content--${item.type}`

    switch (item.type) {
      case 'image':
        await this.loadImage(item, content)
        break
      case 'video':
        this.loadVideo(item, content)
        break
      case 'iframe':
        await this.loadIframe(item, content)
        break
      case 'inline':
        this.loadInline(item, content)
        break
      case 'ajax':
        await this.loadAjax(item, content)
        break
      case 'html':
      default:
        this.loadHtml(item, content)
        break
    }

    item.isLoaded = true
    item.isComplete = true
  }

  private loadImage(item: SlideItem, content: HTMLElement): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = createEl('img', 'glare-image') as HTMLImageElement
      img.alt = item.alt || item.caption || ''
      img.decoding = 'async'
      img.draggable = false
      if (this.opts.protect) img.style.pointerEvents = 'none'

      img.onload = () => {
        item.$image = img
        item.contentWidth = img.naturalWidth
        item.contentHeight = img.naturalHeight
        item.canZoomIn = true
        content.appendChild(img)
        this.$refs.container?.classList.add('glare-can-zoom-in')
        resolve()
      }
      img.onerror = () => {
        item.hasError = true
        reject(new Error('image error'))
      }
      img.src = item.src
    })
  }

  private loadVideo(item: SlideItem, content: HTMLElement): void {
    const format =
      item.format ||
      this.opts.video?.format ||
      (item.src.match(/\.(\w+)(?:\?|$)/)?.[1]
        ? `video/${item.src.match(/\.(\w+)(?:\?|$)/)?.[1]?.replace('ogv', 'ogg')}`
        : 'video/mp4')

    const tpl = translate(this.opts.video?.tpl || '', {
      src: item.src,
      format,
      poster: item.poster || '',
    })
    content.innerHTML = tpl
    const video = content.querySelector('video') as HTMLVideoElement | null
    item.$content = content
    if (video && (item.autoStart ?? this.opts.video?.autoStart)) {
      void video.play().catch(() => undefined)
    }
  }

  private loadIframe(item: SlideItem, content: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      const wrap = createEl('div', 'glare-iframe-wrap')
      wrap.innerHTML = this.opts.iframe?.tpl || '<iframe class="glare-iframe"></iframe>'
      const iframe = wrap.querySelector('iframe') as HTMLIFrameElement
      const attrs = this.opts.iframe?.attr || {}
      for (const [k, v] of Object.entries(attrs)) iframe.setAttribute(k, v)
      if (this.opts.iframe?.css) css(iframe, this.opts.iframe.css)
      if (item.width) css(wrap, { width: typeof item.width === 'number' ? `${item.width}px` : String(item.width) })
      if (item.height) css(wrap, { height: typeof item.height === 'number' ? `${item.height}px` : String(item.height) })

      content.appendChild(wrap)

      if (this.opts.iframe?.preload === false) {
        iframe.src = item.src
        resolve()
        return
      }

      iframe.onload = () => resolve()
      iframe.src = item.src
      // Fallback if onload never fires (cross-origin quirks)
      setTimeout(() => resolve(), 1200)
    })
  }

  private loadInline(item: SlideItem, content: HTMLElement): void {
    const target = item.src ? $(item.src) : null
    if (!target) {
      item.hasError = true
      throw new Error('inline target missing')
    }
    const clone = target.cloneNode(true) as HTMLElement
    clone.id = ''
    clone.classList.remove('glare-hidden')
    clone.hidden = false
    clone.style.display = ''
    content.appendChild(clone)
  }

  private async loadAjax(item: SlideItem, content: HTMLElement): Promise<void> {
    const settings = this.opts.ajax?.settings || {}
    const response = await fetch(item.src, settings)
    if (!response.ok) throw new Error('ajax failed')
    const html = await response.text()
    content.innerHTML = html
  }

  private loadHtml(item: SlideItem, content: HTMLElement): void {
    if (item.content instanceof HTMLElement) {
      content.appendChild(item.content)
    } else {
      content.innerHTML = item.html || item.content || item.src || ''
    }
  }

  private showSpinner(slide: HTMLElement): void {
    if (slide.querySelector('.glare-spinner')) return
    slide.insertAdjacentHTML('beforeend', this.opts.spinnerTpl || '')
  }

  private hideSpinner(slide: HTMLElement): void {
    slide.querySelector('.glare-spinner')?.remove()
  }

  private showError(item: SlideItem): void {
    item.hasError = true
    const content = item.$content
    if (!content) return
    content.className = 'glare-content glare-content--error'
    content.innerHTML = translate(this.opts.errorTpl || '', this.dict())
  }

  private playOpenAnimation(item: SlideItem): void {
    const container = this.$refs.container
    if (!container) return
    const effect = prefersReducedMotion() ? false : this.opts.animationEffect
    container.dataset.animation = effect ? String(effect) : 'none'
    container.style.setProperty('--glare-duration', `${this.opts.animationDuration || 0}ms`)

    if (effect === 'zoom' && item.$trigger && item.type === 'image' && item.$image) {
      const from = getOffset(item.$trigger)
      const to = getOffset(item.$image)
      const sx = from.width / Math.max(to.width, 1)
      const sy = from.height / Math.max(to.height, 1)
      const dx = from.left + from.width / 2 - (to.left + to.width / 2)
      const dy = from.top + from.height / 2 - (to.top + to.height / 2)
      css(item.$image, {
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(${Math.max(sx, sy)})`,
        opacity: this.opts.zoomOpacity === false ? '1' : '0.2',
        transitionDuration: '0ms',
      })
      nextFrame(() => {
        if (!item.$image) return
        css(item.$image, {
          transform: '',
          opacity: '',
          transitionDuration: `${this.opts.animationDuration || 366}ms`,
        })
      })
    }

    nextFrame(() => container.classList.add('glare-is-ready'))
  }

  private playTransition(): void {
    const container = this.$refs.container
    if (!container) return
    const effect = prefersReducedMotion() ? false : this.opts.transitionEffect
    container.dataset.transition = effect ? String(effect) : 'none'
    container.style.setProperty(
      '--glare-transition-duration',
      `${this.opts.transitionDuration || 0}ms`,
    )
  }

  private positionContent(): void {
    // Layout is mostly CSS; update caption overlap / zoom affordance
    const item = this.current
    if (!item?.$image || !item.contentWidth || !item.contentHeight) return
    const slide = item.$slide
    if (!slide) return
    const space = $('.glare-space', slide)
    if (!space) return
    const rect = getOffset(space)
    const fit = Math.min(rect.width / item.contentWidth, rect.height / item.contentHeight, 1)
    item.canZoomIn = fit < 0.98 || item.contentWidth > rect.width || item.contentHeight > rect.height
    this.$refs.container?.classList.toggle('glare-can-zoom-in', !!item.canZoomIn && this.zoom.scale <= 1.01)
  }

  private updateChrome(): void {
    const item = this.current
    if (!item) return

    if (this.$refs.infobar) {
      const el = $('.glare-infobar-index', this.$refs.infobar)
      if (el) el.textContent = `${this.currIndex + 1} / ${this.group.length}`
    }

    if (this.$refs.caption) {
      let caption = item.caption || ''
      if (typeof this.opts.caption === 'function') {
        caption = this.opts.caption(this, item)
      } else if (typeof this.opts.caption === 'string') {
        caption = this.opts.caption
      }
      this.$refs.caption.innerHTML = caption
      this.$refs.caption.classList.toggle('glare-hidden', !caption)
      this.$refs.container?.classList.toggle('glare-show-caption', !!caption)
    }

    const atStart = this.currIndex === 0 && !this.opts.loop
    const atEnd = this.currIndex === this.group.length - 1 && !this.opts.loop
    this.$refs.container?.querySelector('[data-glare-prev]')?.classList.toggle('glare-disabled', atStart)
    this.$refs.container?.querySelector('[data-glare-next]')?.classList.toggle('glare-disabled', atEnd)
    this.$refs.container?.setAttribute('aria-label', captionLabel(item, this.currIndex, this.group.length))
  }

  private updateDownload(item: SlideItem): void {
    const link = this.$refs.container?.querySelector('[data-glare-download]') as HTMLAnchorElement | null
    if (!link) return
    const href = item.downloadSrc || (item.type === 'image' ? item.src : '')
    if (href) {
      link.href = href
      link.classList.remove('glare-hidden')
    } else {
      link.classList.add('glare-hidden')
    }
  }

  private toggleZoom(event?: MouseEvent): void {
    if (!this.current || this.current.type !== 'image') return
    if (this.zoom.scale > 1.01) {
      this.scaleToFit()
    } else {
      const point = event ? { x: event.clientX, y: event.clientY } : undefined
      this.scaleToActual(point?.x, point?.y)
    }
  }

  private animateZoom(scale: number, x: number, y: number, duration = 0): void {
    const content = this.getImageWrap()
    const img = this.current?.$image
    if (!content || !img) return

    this.zoom.scale = clamp(scale, this.zoom.min, this.zoom.max)
    this.zoom.x = x
    this.zoom.y = y

    css(img, {
      transform: `translate3d(${x}px, ${y}px, 0) scale(${this.zoom.scale})`,
      transitionDuration: `${duration}ms`,
    })
  }

  private resetZoom(): void {
    this.zoom = { scale: 1, x: 0, y: 0, min: 1, max: 5 }
    this.$refs.container?.classList.remove('glare-can-zoom-out')
  }

  private updateZoomButton(): void {
    const btn = this.$refs.container?.querySelector('[data-glare-zoom]') as HTMLElement | null
    if (!btn) return
    btn.innerHTML = this.zoom.scale > 1.01 ? icons.zoomOut : icons.zoomIn
    btn.classList.toggle('is-active', this.zoom.scale > 1.01)
  }

  private resetIdle(): void {
    this.clearIdle()
    if (this.isIdle) this.toggleControls(false)
    const time = this.opts.idleTime
    if (!time || this.opts.modal) return
    this.idleTimer = setTimeout(() => {
      this.toggleControls(true)
    }, time * 1000)
  }

  private clearIdle(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer)
      this.idleTimer = null
    }
  }

  private dict(): I18nDict & Record<string, string> {
    const lang = this.opts.lang || 'en'
    return {
      ...i18nFallback,
      ...(this.opts.i18n?.en || {}),
      ...(this.opts.i18n?.[lang] || {}),
    } as I18nDict & Record<string, string>
  }

  private trigger(name: EventName, current?: SlideItem, ...args: unknown[]): unknown {
    const handler = this.opts[name] as EventHandler | undefined
    if (typeof handler === 'function') {
      return handler(this, current, ...args)
    }
    return undefined
  }

  private teardown(): void {
    this.gestures?.detach()
    this.wheel?.destroy()
    this.hash?.destroy()
    this.share?.destroy()
    this.Thumbs?.destroy()
    this.SlideShow?.destroy()
    this.FullScreen?.destroy()

    this.cleanups.forEach((fn) => fn())
    this.cleanups = []

    this.$refs.container?.remove()
    this.$refs = {
      container: null,
      stage: null,
      bg: null,
      inner: null,
      caption: null,
      toolbar: null,
      infobar: null,
      navigation: null,
    }

    const idx = activeStack.indexOf(this)
    if (idx >= 0) activeStack.splice(idx, 1)

    if (this.opts.hideScrollbar) lockScroll(false)

    if (this.opts.backFocus) {
      const el = this.openedFrom || this.previouslyFocused
      el?.focus?.({ preventScroll: true })
    }

    this.isActive = false
    this.isClosing = false
    this.trigger('afterClose', this.current || undefined)
    this.trigger('onDeactivate')
    this.trigger('onDestroy')
  }

  /* -------------------- static API -------------------- */

  static defaults = defaults

  static getInstance(id?: number): Glare | null {
    if (id != null) return activeStack.find((i) => i.id === id) || null
    return activeStack[activeStack.length - 1] || null
  }

  static getInstances(): Glare[] {
    return [...activeStack]
  }

  static open(
    items: Array<SlideSource | string> | HTMLElement[],
    options: GlareOptions = {},
    index = 0,
  ): Glare {
    const instance = new Glare(items, options, index)
    instance.open(index)
    return instance
  }

  static close(all = false): void {
    if (all) {
      ;[...activeStack].reverse().forEach((i) => i.close())
      return
    }
    activeStack[activeStack.length - 1]?.close()
  }

  static destroy(): void {
    Glare.close(true)
    boundGroups.forEach((g) => g.destroy())
    boundGroups.length = 0
  }

  static bind(
    selector: string | HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>,
    options: GlareOptions = {},
  ): { destroy: () => void } {
    const elements =
      typeof selector === 'string'
        ? $$(selector)
        : selector instanceof HTMLElement
          ? [selector]
          : Array.from(selector as ArrayLike<HTMLElement>)

    const onClick = (event: Event) => {
      const eventTarget = event.target as HTMLElement | null
      if (!eventTarget) return

      const target = elements.find((el) => el === eventTarget || el.contains(eventTarget))
      if (!target) return
      event.preventDefault()

      const groupName =
        target.getAttribute('data-glare') ||
        target.getAttribute('data-glare') ||
        ''

      const groupEls = groupName
        ? elements.filter(
            (el) =>
              (el.getAttribute('data-glare') || el.getAttribute('data-glare') || '') ===
              groupName,
          )
        : [target]

      const index = Math.max(0, groupEls.indexOf(target))
      const instance = new Glare(groupEls, options, index, groupName || 'gallery')
      instance.open(index)
    }

    const cleanups = elements.map((el) => on(el, 'click', onClick))

    const group = {
      selector: typeof selector === 'string' ? selector : '',
      options,
      elements,
      destroy: () => {
        cleanups.forEach((fn) => fn())
        const i = boundGroups.indexOf(group)
        if (i >= 0) boundGroups.splice(i, 1)
      },
    }
    boundGroups.push(group)
    return group
  }

  static fromSelector(
    selector: string,
    options: GlareOptions = {},
  ): Glare | null {
    const els = $$(selector)
    if (!els.length) return null
    const instance = new Glare(els, options, 0, 'gallery')
    instance.open(0)
    return instance
  }
}

const boundGroups: Array<{
  selector: string
  options: GlareOptions
  elements: HTMLElement[]
  destroy: () => void
}> = []

const i18nFallback: I18nDict = {
  CLOSE: 'Close',
  NEXT: 'Next',
  PREV: 'Previous',
  ERROR: 'The requested content cannot be loaded.<br/>Please try again later.',
  PLAY_START: 'Start slideshow',
  PLAY_STOP: 'Pause slideshow',
  FULL_SCREEN: 'Full screen',
  THUMBS: 'Thumbnails',
  DOWNLOAD: 'Download',
  SHARE: 'Share',
  ZOOM: 'Zoom',
}

function captionLabel(item: SlideItem, index: number, total: number): string {
  const base = item.caption || item.alt || 'Media lightbox'
  return total > 1 ? `${base} (${index + 1} of ${total})` : base
}

// Auto-bind data-glare on DOM ready
function autoBind(): void {
  if (typeof document === 'undefined') return
  const run = () => {
    const els = $$('[data-glare], [data-glare]')
    if (!els.length) return
    // Group by attribute value; bind once via delegation on document
    Glare.bind('[data-glare], [data-glare]')
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true })
  } else {
    run()
  }
}

export { autoBind }
