import type { GlareOptions, ResolvedOptions } from '../types'
import { defaults } from '../defaults'
import { isMobile } from '../utils/env'
import { deepMerge } from '../utils/object'

/** Merges user options over the defaults, then applies `mobile` overrides on touch devices. */
export function resolveOptions(options: GlareOptions): ResolvedOptions {
  const merged = deepMerge<ResolvedOptions>(defaults, options)
  return isMobile() && merged.mobile ? deepMerge<ResolvedOptions>(merged, merged.mobile) : merged
}

/** Normalizes a `T | boolean` module option: `true` yields the defaults, falsy disables it. */
export function moduleOptions<T extends object>(value: Partial<T> | boolean | undefined, fallback: T): T | null {
  if (!value) return null
  return value === true ? { ...fallback } : { ...fallback, ...value }
}
