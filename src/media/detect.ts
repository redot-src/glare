import type { ContentType } from '../types'

const IMAGE_EXT = /\.(avif|bmp|gif|jpe?g|png|svg|webp|ico)(\?.*)?$/i
const VIDEO_EXT = /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i
const PDF_EXT = /\.pdf(\?.*)?$/i
const SELECTOR = /^(#[\w-]+|\.[\w-]+)$/

/** Guesses the content type from a URL; falls back to `fallback` for unknown URLs. */
export function detectType(src: string, fallback: ContentType = 'image'): ContentType {
  if (!src) return 'html'
  if (SELECTOR.test(src)) return 'inline'
  if (IMAGE_EXT.test(src)) return 'image'
  if (VIDEO_EXT.test(src)) return 'video'
  if (PDF_EXT.test(src)) return 'iframe'
  return fallback
}

export function videoMime(src: string): string {
  const ext = src.match(/\.(\w+)(?:\?|$)/)?.[1]?.toLowerCase()
  if (!ext) return 'video/mp4'
  return `video/${ext === 'ogv' ? 'ogg' : ext}`
}
