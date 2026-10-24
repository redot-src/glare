import type { GlareOptions, SlideItem, ThumbsOptions } from '../dist/index.js'

// Compile against the declarations shipped to consumers, including callback inference and fallbacks.
export const thumbnails: ThumbsOptions[] = [
  { render: (item: SlideItem) => `<span>${item.index + 1}</span>` },
  { render: () => document.createElement('span') },
  { render: () => null },
  { render: () => undefined },
]

export const options: GlareOptions = {
  thumbs: { render: (item) => item.type === 'image' ? null : String(item.index) },
}

export const invalid: ThumbsOptions = {
  // @ts-expect-error Thumbnail rendering is synchronous.
  render: async () => '<span>Async</span>',
}
