import type { BoundGroup, GlareOptions } from '../types'
import { parseHash } from '../modules/hash'
import { $$, on } from '../utils/dom'
import { resolveOptions } from './options'

export type BindTarget = string | HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>

/** Opens `elements` as a gallery named `gallery`, starting at `index`. */
type Opener = (elements: HTMLElement[], index: number, gallery: string) => void

const groups: BoundGroup[] = []

const galleryOf = (el: HTMLElement): string => el.getAttribute('data-glare') ?? ''

function toElements(target: BindTarget): HTMLElement[] {
  if (typeof target === 'string') return $$(target)
  if (target instanceof HTMLElement) return [target]
  return Array.from(target)
}

/** Attaches click handlers that open a lightbox for the clicked element's gallery. */
export function bind(target: BindTarget, options: GlareOptions, open: Opener): BoundGroup {
  const elements = toElements(target)

  const openFrom = (el: HTMLElement) => {
    const gallery = galleryOf(el)
    const members = gallery ? elements.filter((item) => galleryOf(item) === gallery) : [el]
    open(members, members.indexOf(el), gallery)
  }

  const offs = elements.map((el) =>
    on(el, 'click', (event) => {
      event.preventDefault()
      openFrom(el)
    }),
  )

  const group: BoundGroup = {
    elements,
    destroy() {
      offs.forEach((off) => off())
      const index = groups.indexOf(group)
      if (index >= 0) groups.splice(index, 1)
    },
  }
  groups.push(group)

  if (resolveOptions(options).hash) restoreFromHash(elements, openFrom)
  return group
}

export function unbindAll(): void {
  for (const group of [...groups]) group.destroy()
}

/** Opens the slide referenced by the current URL hash, if it belongs to a bound gallery. */
function restoreFromHash(elements: HTMLElement[], openFrom: (el: HTMLElement) => void): void {
  const parsed = parseHash()
  if (!parsed) return

  const members = elements.filter((el) => galleryOf(el) === parsed.gallery)
  const el = members[parsed.index]
  if (el) openFrom(el)
}
