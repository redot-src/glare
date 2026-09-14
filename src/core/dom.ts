import type { GlareOptions, GlareRefs, SlideItem } from '../types'
import { slideTemplate } from '../templates'
import { $, $$, createEl, fromHtml, resolveElement } from '../utils/dom'
import { translate } from '../utils/template'

export const HIDDEN = 'glare-hidden'

export function emptyRefs(): GlareRefs {
  return {
    container: null,
    bg: null,
    inner: null,
    stage: null,
    caption: null,
    toolbar: null,
    infobar: null,
    navigation: null,
  }
}

export function buildContainer(
  opts: GlareOptions,
  dict: Record<string, string>,
  id: number,
  count: number,
): GlareRefs {
  const container = fromHtml(translate(opts.baseTpl ?? '', dict))
  container.dataset.glareId = String(id)
  if (opts.baseClass) container.classList.add(opts.baseClass)
  if (opts.modal) container.classList.add('glare-is-modal')

  const refs: GlareRefs = {
    container,
    bg: $('.glare-bg', container),
    inner: $('.glare-inner', container),
    stage: $('.glare-stage', container),
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

function buildToolbar(
  toolbar: HTMLElement,
  opts: GlareOptions,
  dict: Record<string, string>,
  single: boolean,
): void {
  if (opts.toolbar === false) {
    toolbar.classList.add(HIDDEN)
    return
  }
  for (const name of opts.buttons ?? []) {
    if (single && (name === 'thumbs' || name === 'slideshow')) continue
    const tpl = opts.btnTpl?.[name]
    if (tpl) toolbar.insertAdjacentHTML('beforeend', translate(tpl, dict))
  }
}

export function resolveParent(parentEl: GlareOptions['parentEl']): HTMLElement {
  return resolveElement(parentEl) ?? document.body
}

/** Creates a hidden slide element for `item` and appends it to the stage. */
export function mountSlide(stage: HTMLElement, item: SlideItem, opts: GlareOptions): HTMLElement {
  const slide = createEl('div', `glare-slide glare-slide--${item.type}`, slideTemplate)
  if (opts.slideClass) slide.classList.add(opts.slideClass)
  slide.dataset.index = String(item.index)
  stage.appendChild(slide)
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

export function addSmallButton(slide: HTMLElement, opts: GlareOptions, dict: Record<string, string>): void {
  if (slide.querySelector('.glare-close-small')) return
  slide.insertAdjacentHTML('beforeend', translate(opts.btnTpl?.smallBtn ?? '', dict))
}

export function showSpinner(stage: HTMLElement, tpl = ''): void {
  if (!stage.querySelector(':scope > .glare-spinner')) stage.insertAdjacentHTML('beforeend', tpl)
}

export function hideSpinner(stage: HTMLElement): void {
  stage.querySelector(':scope > .glare-spinner')?.remove()
}

export function showError(item: SlideItem, opts: GlareOptions, dict: Record<string, string>): void {
  item.hasError = true
  if (!item.$content) return
  item.$content.className = 'glare-content glare-content--error'
  item.$content.innerHTML = translate(opts.errorTpl ?? '', dict)
}

export function isToolbarVisible(opts: GlareOptions, item: SlideItem): boolean {
  if (typeof opts.toolbar === 'boolean') return opts.toolbar
  return item.type === 'image'
}

export function usesSmallButton(opts: GlareOptions, item: SlideItem): boolean {
  if (typeof opts.smallBtn === 'boolean') return opts.smallBtn
  return !isToolbarVisible(opts, item)
}

/** Shows the toolbar for images; other types only keep the close button. */
export function syncToolbar(toolbar: HTMLElement, opts: GlareOptions, item: SlideItem): void {
  if (opts.toolbar === false) return
  const visible = isToolbarVisible(opts, item)
  toolbar.classList.toggle(HIDDEN, !visible)
  if (!visible) return

  const compact = item.type !== 'image'
  for (const button of $$('.glare-button', toolbar)) {
    if (button.hasAttribute('data-glare-download')) continue
    button.classList.toggle(HIDDEN, compact && !button.hasAttribute('data-glare-close'))
  }
}

export function syncDownloadLink(container: HTMLElement, item: SlideItem): void {
  const link = container.querySelector<HTMLAnchorElement>('[data-glare-download]')
  if (!link) return
  const href = item.downloadSrc || (item.type === 'image' ? item.src : '')
  link.classList.toggle(HIDDEN, !href)
  if (href) link.href = href
}

export function setTypeClass(el: HTMLElement, type: string): void {
  const previous = el.dataset.type
  if (previous) el.classList.remove(`glare-type-${previous}`)
  el.dataset.type = type
  el.classList.add(`glare-type-${type}`)
}

export function dialogLabel(item: SlideItem, index: number, total: number): string {
  const base = item.caption || item.alt || 'Media lightbox'
  return total > 1 ? `${base} (${index + 1} of ${total})` : base
}
