import Glare from '../src/index'
import './style.css'

const nature = [
  {
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
    caption: 'Alpine lake at dusk',
  },
  {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    caption: 'Sunlit forest path',
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80',
    caption: 'Fog over rolling hills',
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
    caption: 'Sunbeams through trees',
  },
]

// Declarative galleries. Hash deep links (#nature-3) are restored automatically.
Glare.bind('[data-glare="nature"]', { loop: true })
Glare.bind('[data-glare="media"]', { loop: true })
Glare.bind('[data-glare="inline"]', { smallBtn: true })

// Buttons that open the lightbox programmatically, keyed by element id.
const examples: Record<string, () => void> = {
  'open-html': () =>
    Glare.open(
      [
        {
          type: 'html',
          html: '<h3>Hello from HTML</h3><p>Pass any markup string as a slide. Great for confirmations, pricing cards, or custom widgets.</p>',
          caption: 'HTML content slide',
        },
      ],
      { smallBtn: true },
    ),

  'open-ajax': () =>
    Glare.open([{ type: 'ajax', src: 'ajax-snippet.html', caption: 'Loaded via fetch()' }]),

  'open-programmatic': () => Glare.open(nature, { loop: true }, 1),

  'open-slideshow': () =>
    Glare.open(nature, { loop: true, slideShow: { autoStart: true, speed: 2200 }, idleTime: 2 }),

  'open-thumbs': () => Glare.open(nature, { loop: true, thumbs: { autoStart: true } }),

  'open-transition': () =>
    Glare.open(nature, { loop: true, transitionEffect: 'circular', animationEffect: 'fade' }),

  'open-protected': () =>
    Glare.open(nature.slice(0, 2), { protect: true, buttons: ['zoom', 'close'] }),

  'open-modal': () =>
    Glare.open(
      [
        {
          type: 'html',
          html: '<h3>Modal mode</h3><p>Only the close button dismisses this dialog. Keyboard navigation is disabled.</p>',
        },
      ],
      { modal: true, keyboard: false, clickSlide: false, smallBtn: true, toolbar: false },
    ),

  'open-iframe': () =>
    Glare.open([{ type: 'iframe', src: 'https://example.com', caption: 'example.com in an iframe' }]),
}

for (const [id, open] of Object.entries(examples)) {
  document.getElementById(id)?.addEventListener('click', open)
}
