import type { Recipe } from './content'

/** Prints a plain object as JavaScript source: unquoted keys, single-quoted strings. */
export function formatObject(value: unknown, indent = ''): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => formatObject(item, indent)).join(', ')}]`
  }
  if (typeof value === 'string') return `'${value}'`
  if (typeof value !== 'object' || value === null) return String(value)

  const inner = indent + '  '
  const entries = Object.entries(value).map(
    ([key, item]) => `${inner}${key}: ${formatObject(item, inner)},`,
  )
  return `{\n${entries.join('\n')}\n${indent}}`
}

/** The `Glare.open(...)` call a recipe performs, as it would appear in user code. */
export function formatCall(recipe: Pick<Recipe, 'options' | 'index'>): string {
  const args = ['slides', formatObject(recipe.options)]
  if (recipe.index) args.push(String(recipe.index))
  return `Glare.open(${args.join(', ')})`
}
