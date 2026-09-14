import type { Glare } from './Glare'

/** Stack of open instances, topmost last. */
const stack: Glare[] = []

export const registry = {
  add(instance: Glare): void {
    stack.push(instance)
  },
  remove(instance: Glare): void {
    const index = stack.indexOf(instance)
    if (index >= 0) stack.splice(index, 1)
  },
  top(): Glare | null {
    return stack[stack.length - 1] ?? null
  },
  get(id: number): Glare | null {
    return stack.find((instance) => instance.id === id) ?? null
  },
  all(): Glare[] {
    return [...stack]
  },
  get size(): number {
    return stack.length
  },
}
