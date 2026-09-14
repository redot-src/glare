import type { ContentType, MediaProvider, SlideSource } from '../types'
import { buildQuery, expandMatch } from '../utils/template'

export const providers: Record<string, MediaProvider> = {
  youtube: {
    matcher:
      /(?:youtube\.com|youtu\.be|youtube-nocookie\.com)\/(?:watch\?(?:.*&)?v=|v\/|u\/\w\/|embed\/|shorts\/)?([\w-]{11})/i,
    type: 'iframe',
    url: 'https://www.youtube-nocookie.com/embed/$1',
    thumb: 'https://img.youtube.com/vi/$1/hqdefault.jpg',
    params: { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1 },
  },
  vimeo: {
    matcher: /vimeo\.com\/(?:video\/)?(\d+)/i,
    type: 'iframe',
    url: 'https://player.vimeo.com/video/$1',
    params: { autoplay: 1, title: 0, byline: 0, portrait: 0 },
  },
  gmap: {
    matcher:
      /(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:maps\/(?:place\/[^/]+\/)?@([^/]+)|maps\?q=([^&]+)|maps\/search\/([^/?]+))/i,
    type: 'iframe',
    url: (match) => {
      const [, tld, coords, query, search] = match
      if (coords) {
        const [lat, lng, zoom] = coords.split(',')
        const z = zoom ? Math.floor(parseFloat(zoom)) : 14
        return `https://maps.google.${tld}/maps?ll=${lat},${lng}&z=${z}&output=embed`
      }
      const q = encodeURIComponent(decodeURIComponent(query || search || ''))
      return `https://maps.google.${tld}/maps?q=${q}&output=embed`
    },
  },
}

function resolve(
  value: MediaProvider['url'],
  match: RegExpMatchArray,
  src: string,
): string | undefined {
  if (typeof value === 'function') return value(match, src)
  if (typeof value === 'string') return expandMatch(value, match)
  return undefined
}

/** Rewrites `src` through the first matching provider, or returns null. */
export function applyProvider(
  src: string,
  media: Record<string, MediaProvider> | undefined,
): Pick<SlideSource, 'src' | 'thumb'> & { type: ContentType } | null {
  for (const provider of Object.values(media ?? {})) {
    const match = src.match(provider.matcher)
    if (!match) continue

    let url = resolve(provider.url, match, src) ?? src
    if (provider.params) {
      url += (url.includes('?') ? '&' : '?') + buildQuery(provider.params)
    }

    return {
      src: url,
      type: provider.type ?? 'iframe',
      thumb: resolve(provider.thumb, match, src),
    }
  }
  return null
}
