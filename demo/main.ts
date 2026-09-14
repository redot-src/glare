import '../src/styles/glare.css'
import './style.css'
import Glare from '../src/index'

const natureItems = [
  {
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
    caption: 'Alpine lake at dusk',
    thumb: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=60',
  },
  {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    caption: 'Sunlit forest path',
    thumb: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=60',
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80',
    caption: 'Fog over rolling hills',
    thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=60',
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
    caption: 'Sunbeams through trees',
    thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=60',
  },
]

// Declarative galleries
Glare.bind('[data-glare="nature"]', {
  loop: true,
  thumbs: { autoStart: false, axis: 'y' },
  hash: true,
  buttons: ['zoom', 'slideshow', 'thumbs', 'share', 'download', 'fullscreen', 'close'],
})

Glare.bind('[data-glare="media"]', {
  loop: true,
  toolbar: true,
})

Glare.bind('[data-glare]:not([data-glare="nature"]):not([data-glare="media"])', {
  smallBtn: true,
})

document.getElementById('open-html')?.addEventListener('click', () => {
  Glare.open(
    [
      {
        type: 'html',
        html: `
          <h3 style="margin:0 0 8px">Hello from HTML</h3>
          <p style="margin:0;color:#9aa3b2">Pass any markup string as a slide. Great for confirmations, pricing cards, or custom widgets.</p>
        `,
        caption: 'HTML content slide',
      },
    ],
    { smallBtn: true },
  )
})

document.getElementById('open-ajax')?.addEventListener('click', () => {
  Glare.open(
    [
      {
        type: 'ajax',
        src: './ajax-snippet.html',
        caption: 'Loaded via fetch()',
      },
    ],
    { smallBtn: true },
  )
})

document.getElementById('open-programmatic')?.addEventListener('click', () => {
  Glare.open(natureItems, {
    loop: true,
    animationEffect: 'zoom',
    transitionEffect: 'fade',
  }, 1)
})

document.getElementById('open-slideshow')?.addEventListener('click', () => {
  Glare.open(natureItems, {
    loop: true,
    slideShow: { autoStart: true, speed: 2200 },
    idleTime: 2,
  })
})

document.getElementById('open-thumbs')?.addEventListener('click', () => {
  Glare.open(natureItems, {
    loop: true,
    thumbs: { autoStart: true, axis: 'x' },
  })
})

document.getElementById('open-transition')?.addEventListener('click', () => {
  Glare.open(natureItems, {
    loop: true,
    transitionEffect: 'circular',
    animationEffect: 'fade',
  })
})

document.getElementById('open-protected')?.addEventListener('click', () => {
  Glare.open(natureItems.slice(0, 2), {
    protect: true,
    buttons: ['zoom', 'close'],
  })
})

document.getElementById('open-modal')?.addEventListener('click', () => {
  Glare.open(
    [
      {
        type: 'html',
        html: `<h3 style="margin-top:0">Modal mode</h3><p>Escape and outside-click closing still work via the close button. Keyboard nav is disabled.</p>`,
      },
    ],
    {
      modal: true,
      clickOutside: false,
      clickSlide: false,
      keyboard: false,
      smallBtn: true,
      toolbar: false,
    },
  )
})

document.getElementById('open-iframe')?.addEventListener('click', () => {
  Glare.open(
    [
      {
        type: 'iframe',
        src: 'https://example.com',
        caption: 'example.com in an iframe',
        width: '90%',
        height: '80%',
      },
    ],
    { smallBtn: true },
  )
})

// Deep-link support for demo gallery name "nature"
const parsed = location.hash.match(/^#nature-(\d+)$/)
if (parsed) {
  const index = Math.max(0, parseInt(parsed[1], 10) - 1)
  const els = Array.from(document.querySelectorAll('[data-glare="nature"]')) as HTMLElement[]
  if (els[index]) {
    Glare.open(els, { loop: true, hash: true }, index)
  }
}

console.info('Glare demo ready', Glare.defaults)
