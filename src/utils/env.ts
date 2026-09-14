export function isMobile(): boolean {
  return navigator.maxTouchPoints > 0 && window.matchMedia('(pointer: coarse)').matches
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function supportsFullscreen(): boolean {
  const doc = document as Document & { webkitFullscreenEnabled?: boolean }
  return Boolean(doc.fullscreenEnabled ?? doc.webkitFullscreenEnabled)
}

const LOCK_CLASS = 'glare-lock'

/** Locks page scrolling while compensating for the scrollbar width. */
export function lockScroll(lock: boolean): void {
  const html = document.documentElement
  if (lock) {
    const scrollbar = window.innerWidth - html.clientWidth
    html.classList.add(LOCK_CLASS)
    if (scrollbar > 0) html.style.marginRight = `${scrollbar}px`
  } else {
    html.classList.remove(LOCK_CLASS)
    html.style.marginRight = ''
  }
}
