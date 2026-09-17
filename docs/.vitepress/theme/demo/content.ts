/*
 * Everything the demo shows. Components in this folder render this data and
 * hand it to Glare unchanged, so what you see on the page is what runs.
 */
import { withBase } from 'vitepress'
import type { Anchor, AnchorPosition, ContentType, CustomButton, GlareOptions, SlideSource } from '@/types'

const unsplash = (id: string, width: number): string =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`

/** One slide on the light table: the full image, its thumbnail, and its caption. */
export interface Frame {
  src: string
  thumb: string
  caption: string
}

const frame = (id: string, caption: string): Frame => ({
  src: unsplash(id, 1600),
  thumb: unsplash(id, 640),
  caption,
})

export const frames: Frame[] = [
  frame('photo-1501785888041-af3ef285b470', 'Alpine lake at dusk'),
  frame('photo-1469474968028-56623f02e42e', 'Sunlit forest path'),
  frame('photo-1470071459604-3b5ec3a7fe05', 'Fog over rolling hills'),
  frame('photo-1441974231531-c6227db76b6e', 'Sunbeams through trees'),
  frame('photo-1472214103451-9374bd1c798e', 'Green valley after rain'),
  frame('photo-1500530855697-b586d89ba3ee', 'Desert dunes at golden hour'),
]

/** The frames as Glare slides, for the programmatic examples. */
export const frameSlides: SlideSource[] = frames.map(({ src, caption }) => ({ src, caption }))

/** One non-image content type, opened as a single slide. */
export interface ContentExample {
  /** The `type` Glare resolves for this slide. Shown as the card label. */
  type: ContentType
  title: string
  /** How the type is recognized or supplied. */
  note: string
  slide: SlideSource
}

/** Rendered (hidden) by ContentTypes.vue and cloned into the lightbox by the `inline` example. */
export const inlineSourceId = 'demo-inline-source'

export const contentExamples: ContentExample[] = [
  {
    type: 'video',
    title: 'HTML5 video',
    note: 'Detected from the .mp4 extension',
    slide: {
      src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      caption: 'Sample HTML5 video',
    },
  },
  {
    type: 'embed',
    title: 'YouTube',
    note: 'Detected from the watch URL',
    slide: { src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', caption: 'YouTube embed' },
  },
  {
    type: 'embed',
    title: 'Vimeo',
    note: 'Detected from the vimeo.com URL',
    slide: { src: 'https://vimeo.com/1084537', caption: 'Vimeo embed' },
  },
  {
    type: 'embed',
    title: 'Google Maps',
    note: 'Detected from the maps place URL',
    slide: {
      src: 'https://www.google.com/maps/place/Tokyo+Tower/@35.6585805,139.7454389,17z',
      caption: 'Tokyo Tower',
    },
  },
  {
    type: 'iframe',
    title: 'Any page',
    note: 'type: "iframe" with a URL',
    slide: { type: 'iframe', src: 'https://example.com', caption: 'example.com in an iframe' },
  },
  {
    type: 'html',
    title: 'Markup string',
    note: 'type: "html" with an html string',
    slide: {
      type: 'html',
      html: '<h3>Hello from HTML</h3><p>Pass any markup string as a slide. Good for confirmations, pricing cards, or custom widgets.</p>',
      caption: 'HTML content slide',
    },
  },
  {
    type: 'inline',
    title: 'Node from this page',
    note: `type: "inline" with src: "#${inlineSourceId}"`,
    slide: { type: 'inline', src: `#${inlineSourceId}`, caption: 'Inline content' },
  },
  {
    type: 'ajax',
    title: 'Fetched fragment',
    note: 'type: "ajax" with a URL to fetch',
    slide: { type: 'ajax', src: withBase('/demo/ajax-snippet.html'), caption: 'Loaded via fetch()' },
  },
]

/** A call to `Glare.open(slides, options, index)`, shown as code and runnable. */
export interface Recipe {
  title: string
  summary: string
  slides: SlideSource[]
  options: GlareOptions
  /** Start index; omitted from the code when it is 0. */
  index?: number
  /** Shown instead of the generated call, for options that do not print well (functions, markup). */
  code?: string
}

const shuffleIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 14 4 4-4 4"/><path d="m18 2 4 4-4 4"/><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"/><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"/><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"/></svg>'

/** The custom toolbar button of the 'Custom button' recipe: jumps to a random other slide. */
const shuffle: CustomButton = {
  name: 'shuffle',
  label: 'Random slide',
  icon: shuffleIcon,
  click: (instance) => {
    const step = 1 + Math.floor(Math.random() * (instance.group.length - 1))
    instance.jumpTo(instance.currIndex + step)
  },
}

export const recipes: Recipe[] = [
  {
    title: 'Slideshow',
    summary: 'Autoplays on open. Controls hide after two idle seconds.',
    slides: frameSlides,
    options: { loop: true, slideshow: { autoStart: true, speed: 2200 }, idleTime: 2 },
  },
  {
    title: 'Thumbnails',
    summary: 'The thumbnail strip is visible from the start.',
    slides: frameSlides,
    options: { loop: true, thumbs: { autoStart: true } },
  },
  {
    title: 'Circular transition',
    summary: 'Slides rotate through; the dialog fades in instead of zooming.',
    slides: frameSlides,
    options: { loop: true, transitionEffect: 'circular', animationEffect: 'fade' },
  },
  {
    title: 'Start at a slide',
    summary: 'The third argument is the index to open on.',
    slides: frameSlides,
    options: { loop: true },
    index: 2,
  },
  {
    title: 'Protected images',
    summary: 'Blocks the context menu and dragging. Only zoom and close remain.',
    slides: frameSlides.slice(0, 2),
    options: { protect: true, buttons: ['zoom', 'close'] },
  },
  {
    title: 'Custom button',
    summary: 'shuffle is an object: { name, label, icon, click }. It looks like the built-in buttons and runs click.',
    slides: frameSlides,
    options: { loop: true, buttons: ['zoom', shuffle, 'close'] },
    code: `const shuffle = { ... }

Glare.open(slides, {
  loop: true,
  buttons: ['zoom', shuffle, 'close'],
})`,
  },
  {
    title: 'Modal',
    summary: 'Only the close button dismisses it. Keyboard and backdrop clicks are ignored.',
    slides: [
      {
        type: 'html',
        html: '<h3>Modal mode</h3><p>Only the close button dismisses this dialog. Keyboard shortcuts and backdrop clicks are ignored.</p>',
      },
    ],
    options: { modal: true },
  },
]

/** The anchor picker's Open button, which its selector choice flies from. */
export const anchorTargetId = 'demo-anchor-open'

const anchorPositions: AnchorPosition[] = (['top', 'center', 'bottom'] as const).flatMap((y) =>
  (['left', 'center', 'right'] as const).map((x): AnchorPosition => `${y}-${x}`),
)

/** Choices in the anchor picker, grouped the way its select shows them. */
export const anchorChoices: Array<{ label: string; anchors: Anchor[] }> = [
  { label: 'Position', anchors: anchorPositions },
  { label: 'Selector', anchors: [`#${anchorTargetId}`] },
]
