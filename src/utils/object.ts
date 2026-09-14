export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/** Recursively merges plain objects; other values (arrays, elements, RegExps) are replaced. */
export function deepMerge<T extends object>(...sources: Array<Partial<T> | null | undefined | false>): T {
  const result: Record<string, unknown> = {}

  for (const source of sources) {
    if (!source) continue
    for (const [key, value] of Object.entries(source)) {
      if (value === undefined) continue
      const existing = result[key]
      result[key] = isPlainObject(value)
        ? deepMerge(isPlainObject(existing) ? existing : {}, value)
        : value
    }
  }

  return result as T
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
