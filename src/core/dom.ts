import type { CustomButton, GlareRefs, I18nDict, ResolvedOptions, SlideItem } from '../types'
import { icons } from '../icons'
import { $, $$, createEl, fromHtml, toText } from '../utils/dom'
import { supportsFullscreen } from '../utils/env'
import { translate } from '../utils/template'

const HIDDEN = 'glare-hidden'

export function buildContainer(opts: ResolvedOptions, dict: I18nDict, id: number, count: number): GlareRefs {
  const container = fromHtml(translate(opts.baseTpl, dict))
  container.dataset.glareId = String(id)
  if (opts.baseClass) container.classList.add(opts.baseClass)
  if (opts.modal) container.classList.add('glare-is-modal')

  const stage = $('.glare-stage', container)
  if (!stage) throw new Error('baseTpl must contain a .glare-stage element')

  const refs: GlareRefs = {
    container,
    bg: $('.glare-bg', container),
    inner: $('.glare-inner', container),
    stage,
    caption: $('.glare-caption', container),
    toolbar: $('.glare-toolbar', container),
    infobar: $('.glare-infobar', container),
    navigation: $('.glare-navigation', container),
  }

  const single = count < 2
  refs.navigation?.classList.toggle(HIDDEN, !opts.arrows || single)
  refs.infobar?.classList.toggle(HIDDEN, !opts.infobar || single)
  if (refs.toolbar) buildToolbar(refs.toolbar, opts, dict, single)

  return refs
}

function buildToolbar(toolbar: HTMLElement, opts: ResolvedOptions, dict: I18nDict, single: boolean): void {
  if (opts.toolbar === false) {
    toolbar.classList.add(HIDDEN)
    return
  }

  const menu = createEl('div', 'glare-toolbar-menu')
  menu.id = `glare-toolbar-menu-${toolbar.closest<HTMLElement>('.glare-container')?.dataset.glareId ?? ''}`

  for (const name of opts.buttons) {
    if (typeof name !== 'string') {
      menu.appendChild(createCustomButton(name))
      continue
    }

    if (single && (name === 'thumbs' || name === 'slideshow')) continue
    if (name === 'fullscreen' && !supportsFullscreen()) continue
    if (name === 'more' || name === 'close') continue

    const tpl = opts.btnTpl[name]
    if (tpl) menu.insertAdjacentHTML('beforeend', translate(tpl, dict))
  }

  if (menu.childElementCount) {
    toolbar.appendChild(menu)
    const moreTpl = opts.btnTpl.more
    if (moreTpl) {
      toolbar.insertAdjacentHTML('beforeend', translate(moreTpl, dict))
      toolbar.querySelector('[data-glare-more]')?.setAttribute('aria-controls', menu.id)
    }
  }

  if (opts.buttons.includes('close')) {
    const closeTpl = opts.btnTpl.close
    if (closeTpl) toolbar.insertAdjacentHTML('beforeend', translate(closeTpl, dict))
  }
}

/** A button defined inline in `buttons`: the built-in markup, matched back to its `click` by name. */
function createCustomButton({ name, label, icon }: CustomButton): HTMLElement {
  const button = createEl('button', `glare-button glare-button--${name}`, icon)

  button.type = 'button'
  button.title = label
  button.dataset.glareCustom = name
  button.setAttribute('aria-label', label)

  return button
}

/** Creates a hidden slide with an empty content box and appends it to the stage. */
export function mountSlide(stage: HTMLElement, item: SlideItem, opts: ResolvedOptions): HTMLElement {
  const slide = createEl('div', `glare-slide glare-slide--${item.type}`)
  if (opts.slideClass) slide.classList.add(opts.slideClass)

  const content = createEl('div', 'glare-content')
  slide.appendChild(content)
  stage.appendChild(slide)

  item.$slide = slide
  item.$content = content
  return slide
}

/** Makes a mounted slide the current one, fading it in unless `instant`. */
export function revealSlide(slide: HTMLElement, instant: boolean): void {
  if (instant) slide.style.transition = 'none'

  // Force a style flush so the opacity change below is transitioned (or not) as intended.
  void slide.offsetWidth
  slide.classList.add('glare-slide--current')

  if (instant) {
    void slide.offsetWidth
    slide.style.transition = ''
  }
}

/** Fades out every slide except `keep` and removes it after `delay`. */
export function retireSlides(stage: HTMLElement, keep: HTMLElement, delay: number): void {
  for (const slide of $$('.glare-slide', stage)) {
    if (slide === keep) continue
    slide.classList.remove('glare-slide--current')
    slide.classList.add('glare-slide--out')
    setTimeout(() => slide.remove(), delay)
  }
}

export function addSmallButton(slide: HTMLElement, opts: ResolvedOptions, dict: I18nDict): void {
  slide.insertAdjacentHTML('beforeend', translate(opts.btnTpl.smallBtn ?? '', dict))
}

export function showSpinner(stage: HTMLElement, opts: ResolvedOptions, dict: I18nDict): void {
  if (!stage.querySelector(':scope > .glare-spinner')) {
    stage.insertAdjacentHTML('beforeend', translate(opts.spinnerTpl, dict))
  }
}

export function hideSpinner(stage: HTMLElement): void {
  stage.querySelector(':scope > .glare-spinner')?.remove()
}

export function showError(item: SlideItem, error: unknown, opts: ResolvedOptions, dict: I18nDict): void {
  item.hasError = true
  item.error = error
  if (!item.$content) return

  item.$content.className = 'glare-content glare-content--error'
  item.$content.innerHTML = translate(opts.errorTpl, dict)
}

function isToolbarVisible(opts: ResolvedOptions, item: SlideItem): boolean {
  if (typeof opts.toolbar === 'boolean') return opts.toolbar
  return item.type === 'image'
}

export function usesSmallButton(opts: ResolvedOptions, item: SlideItem): boolean {
  if (typeof opts.smallBtn === 'boolean') return opts.smallBtn
  return !isToolbarVisible(opts, item)
}

/** Updates every piece of chrome that depends on the current slide. */
export function syncChrome(refs: GlareRefs, opts: ResolvedOptions, dict: I18nDict, item: SlideItem, total: number, caption: string): void {
  const { container, toolbar, infobar } = refs

  setTypeClass(container, item.type)
  if (toolbar) syncToolbar(toolbar, opts, item)
  syncDownloadLink(container, item)
  if (infobar) syncInfobar(infobar, item.index, total)
  if (refs.caption) syncCaption(refs.caption, caption)
  syncArrows(container, opts, item.index, total)
  syncDialogLabel(container, dict, item, total)
}

/** Shows the toolbar for images; with `toolbar: true` other types keep everything except zoom. */
function syncToolbar(toolbar: HTMLElement, opts: ResolvedOptions, item: SlideItem): void {
  if (opts.toolbar === false) return

  toolbar.classList.remove('glare-toolbar--expanded')
  toolbar.querySelector('[data-glare-more]')?.setAttribute('aria-expanded', 'false')

  const visible = isToolbarVisible(opts, item)
  toolbar.classList.toggle(HIDDEN, !visible)
  if (!visible) return

  const zoomable = item.type === 'image'
  $('[data-glare-zoom]', toolbar)?.classList.toggle(HIDDEN, !zoomable)
}

function syncDownloadLink(container: HTMLElement, item: SlideItem): void {
  const link = container.querySelector<HTMLAnchorElement>('[data-glare-download]')
  if (!link) return

  const href = item.downloadSrc || (item.type === 'image' ? item.src : '')
  link.classList.toggle(HIDDEN, !href)
  if (href) link.href = href
}

function syncInfobar(infobar: HTMLElement, index: number, total: number): void {
  const indexEl = $('.glare-infobar-index', infobar)
  if (indexEl) indexEl.textContent = `${index + 1} / ${total}`
}

function syncCaption(caption: HTMLElement, html: string): void {
  caption.innerHTML = html
  caption.classList.toggle(HIDDEN, !html)
}

function syncArrows(container: HTMLElement, opts: ResolvedOptions, index: number, total: number): void {
  const atStart = !opts.loop && index === 0
  const atEnd = !opts.loop && index === total - 1
  setDisabled($('[data-glare-prev]', container), atStart)
  setDisabled($('[data-glare-next]', container), atEnd)
}

function setDisabled(button: HTMLElement | null, disabled: boolean): void {
  if (!button) return
  button.classList.toggle('glare-is-disabled', disabled)
  button.setAttribute('aria-disabled', String(disabled))
}

/** Labels the dialog and announces the slide change through the live region. */
function syncDialogLabel(container: HTMLElement, dict: I18nDict, item: SlideItem, total: number): void {
  const base = toText(item.caption) || item.alt || dict.LIGHTBOX
  const label = total > 1 ? `${base} (${item.index + 1} of ${total})` : base

  container.setAttribute('aria-label', label)
  const live = $('.glare-live', container)
  if (live) live.textContent = label
}

function setTypeClass(el: HTMLElement, type: string): void {
  const previous = el.dataset.type
  if (previous) el.classList.remove(`glare-type-${previous}`)
  el.dataset.type = type
  el.classList.add(`glare-type-${type}`)
}

export function syncZoomButton(container: HTMLElement, dict: I18nDict, zoomed: boolean, hasImage: boolean): void {
  container.classList.toggle('glare-can-zoom-out', zoomed)
  container.classList.toggle('glare-can-zoom-in', !zoomed && hasImage)

  const button = $('[data-glare-zoom]', container)
  const state = zoomed ? 'out' : 'in'
  if (!button || button.dataset.state === state) return

  button.dataset.state = state
  setToggleState(button, zoomed, zoomed ? dict.ZOOM_OUT : dict.ZOOM, zoomed ? icons.zoomOut : icons.zoomIn)
}

/** Swaps a toolbar toggle's label and icon and marks it active. */
export function setToggleState(button: HTMLElement, active: boolean, label: string, icon: string): void {
  button.setAttribute('title', label)
  button.setAttribute('aria-label', label)
  button.innerHTML = icon
  button.classList.toggle('glare-is-active', active)
}
