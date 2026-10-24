import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { afterEach, beforeEach, test } from 'node:test'
import { JSDOM } from 'jsdom'
import Glare from '../dist/glare.esm.js'

const css = await readFile(new URL('../dist/glare.css', import.meta.url), 'utf8')
let dom
let observers

beforeEach(() => {
  dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'https://example.test/',
    pretendToBeVisual: true,
  })
  const { window } = dom
  for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'DOMParser', 'MouseEvent', 'Image']) {
    Object.defineProperty(globalThis, key, { configurable: true, value: window[key] })
  }
  globalThis.getComputedStyle = window.getComputedStyle.bind(window)
  globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window)
  window.matchMedia = () => ({ matches: false })
  window.HTMLElement.prototype.scrollIntoView = () => {}
  observers = new Set()
  globalThis.ResizeObserver = class {
    constructor(callback) { this.callback = callback; observers.add(this) }
    observe() {}
    unobserve() {}
    disconnect() { observers.delete(this) }
  }
  Object.defineProperties(document, {
    fullscreenEnabled: { configurable: true, value: true },
    fullscreenElement: { configurable: true, writable: true, value: null },
  })
  const changeFullscreen = (element) => {
    document.fullscreenElement = element
    document.dispatchEvent(new window.Event('fullscreenchange'))
    return Promise.resolve()
  }
  window.HTMLElement.prototype.requestFullscreen = function () { return changeFullscreen(this) }
  document.exitFullscreen = () => changeFullscreen(null)
  // jsdom has no image decoder. Complete only slide-image loads; thumbnail failures are tested explicitly.
  const src = Object.getOwnPropertyDescriptor(window.HTMLImageElement.prototype, 'src')
  Object.defineProperty(window.HTMLImageElement.prototype, 'src', {
    ...src,
    set(value) {
      src.set.call(this, value)
      if (this.classList.contains('glare-image')) queueMicrotask(() => this.dispatchEvent(new window.Event('load')))
    },
  })
  const style = document.createElement('style')
  style.textContent = css
  document.head.append(style)
})

afterEach(() => {
  Glare.destroy()
  assert.equal(observers.size, 0, 'caption observers are disconnected on close')
  dom.window.close()
})

const slides = [{ src: '/a.jpg', caption: 'First' }, { src: '/b.jpg', caption: 'Second' }]

function open(items = slides, options = {}) {
  return new Promise((resolve, reject) => {
    Glare.open(items, {
      animationEffect: false, transitionEffect: false, idleTime: false,
      touch: false, wheel: false, hash: false, autoFocus: false, backFocus: false,
      hideScrollbar: false, toolbar: true,
      ...options,
      afterShow: resolve,
      onError: (_, item) => reject(item.error),
    })
  })
}

function exerciseToggles(instance, check) {
  instance.toggleZoom()
  check('zoom', true, 'Zoom out')
  instance.toggleZoom()
  check('zoom', false, 'Zoom')
  instance.slideshow.start()
  check('slideshow', true, 'Pause slideshow')
  instance.slideshow.stop()
  check('slideshow', false, 'Start slideshow')
  instance.fullscreen.toggle()
  check('fullscreen', true, 'Exit full screen')
  instance.fullscreen.toggle()
  check('fullscreen', false, 'Full screen')
}

test('custom toggle templates retain their nodes, listeners and icons through state changes', async () => {
  const names = ['zoom', 'slideshow', 'fullscreen']
  const instance = await open(slides, {
    btnTpl: Object.fromEntries(names.map((name) => [name,
      `<button class="glare-button" data-glare-${name}><span class="custom-icon">${name}</span></button>`,
    ])),
  })
  const container = instance.$refs.container
  const contents = Object.fromEntries(names.map((name) => [name, container.querySelector(`[data-glare-${name}]`).firstChild]))
  let clicks = 0
  contents.slideshow.addEventListener('custom-click', () => clicks++)
  exerciseToggles(instance, (name, active, label) => {
    const button = container.querySelector(`[data-glare-${name}]`)
    assert.equal(button.firstChild, contents[name])
    assert.equal(button.classList.contains('glare-is-active'), active)
    assert.equal(button.getAttribute('aria-label'), label)
    assert.equal(button.title, label)
    assert.equal(button.querySelector('svg'), null)
  })
  contents.slideshow.dispatchEvent(new window.Event('custom-click'))
  assert.equal(clicks, 1)
})

test('built-in toggle icons still change in both directions', async () => {
  const instance = await open()
  const initial = new Map()
  for (const name of ['zoom', 'slideshow', 'fullscreen']) {
    initial.set(name, instance.$refs.container.querySelector(`[data-glare-${name}] svg`).innerHTML)
  }
  exerciseToggles(instance, (name, active) => {
    const icon = instance.$refs.container.querySelector(`[data-glare-${name}] [data-glare-icon]`)
    assert.ok(icon)
    if (active) assert.notEqual(icon.innerHTML, initial.get(name))
    else assert.equal(icon.innerHTML, initial.get(name))
  })
})

test('an opted-in built-in icon slot preserves surrounding custom markup', async () => {
  const instance = await open(slides, {
    btnTpl: { slideshow: '<button class="glare-button" data-glare-slideshow><span data-glare-icon></span><span class="extra">Play</span></button>' },
  })
  const button = instance.$refs.container.querySelector('[data-glare-slideshow]')
  const extra = button.querySelector('.extra')
  instance.slideshow.start()
  assert.ok(button.querySelector('svg[data-glare-icon]'))
  instance.slideshow.stop()
  assert.equal(button.querySelector('.extra'), extra)
})

test('thumbnail renderer supports HTML, elements, empty contents and default fallbacks', async () => {
  const custom = document.createElement('span')
  custom.textContent = 'Custom node'
  let clicks = 0
  custom.addEventListener('click', () => clicks++)
  const calls = []
  const instance = await open([...slides, ...slides, { type: 'html', html: '<p>Panel</p>' }], {
    thumbs: {
      autoStart: true,
      render(item) {
        calls.push(item)
        return ['<strong>Custom HTML</strong>', custom, '', null, undefined][item.index]
      },
    },
  })
  const buttons = [...instance.$refs.container.querySelectorAll('.glare-thumbs-item')]
  assert.deepEqual(calls, instance.group)
  assert.equal(buttons[0].querySelector('strong').textContent, 'Custom HTML')
  assert.equal(buttons[1].firstChild, custom)
  assert.equal(buttons[2].childNodes.length, 0)
  assert.equal(buttons[3].querySelector('img').getAttribute('src'), '/b.jpg')
  buttons[3].querySelector('img').dispatchEvent(new window.Event('error'))
  assert.ok(buttons[3].classList.contains('glare-thumbs-item--placeholder'))
  assert.ok(buttons[4].querySelector('svg'))
  assert.equal(buttons[1].type, 'button')
  assert.equal(buttons[1].getAttribute('aria-label'), 'Go to slide 2')
  custom.click()
  assert.equal(clicks, 1)
  assert.equal(instance.currIndex, 1)
  assert.ok(buttons[1].classList.contains('glare-is-active'))
  instance.thumbs.hide()
  assert.equal(instance.thumbs.isActive, false)
})

test('thumbnail rendering works in an external parent and is removed on close', async () => {
  const parent = document.createElement('aside')
  document.body.append(parent)
  const instance = await open(slides, { thumbs: { parentEl: parent, render: (item) => String(item.index + 1) } })
  assert.equal(parent.querySelectorAll('.glare-thumbs-item').length, 2)
  instance.close()
  assert.equal(parent.childElementCount, 0)
})

test('default absolute captions follow media without inline top/bottom overrides', async () => {
  const instance = await open()
  const { caption, container } = instance.$refs
  Object.defineProperty(caption, 'offsetHeight', { value: 24 })
  Object.defineProperties(instance.current.$content, {
    offsetTop: { value: 40 }, offsetHeight: { value: 100 },
  })
  for (const observer of observers) observer.callback()
  assert.equal(container.style.getPropertyValue('--glare-caption-inset'), '24px')
  assert.equal(caption.style.getPropertyValue('--glare-caption-top'), '140px')
  assert.equal(caption.style.top, '')
  assert.equal(caption.style.bottom, '')
})

test('flow captions in a custom base template do not reserve space or receive runtime positioning', async () => {
  const instance = await open(slides, {
    baseTpl: '<div class="glare-container"><section class="glare-stage"></section><footer class="glare-caption" style="position: static"></footer></div>',
  })
  const { caption, container } = instance.$refs
  Object.defineProperty(caption, 'offsetHeight', { value: 24 })
  for (const observer of observers) observer.callback()
  assert.equal(caption.textContent, 'First')
  assert.equal(container.style.getPropertyValue('--glare-caption-inset'), '')
  assert.equal(caption.style.getPropertyValue('--glare-caption-top'), '')
  assert.equal(caption.style.top, '')
})

test('ordinary CSS can override automatic absolute caption positioning', async () => {
  const style = document.createElement('style')
  style.textContent = '.custom-layout .glare-caption { top: auto; bottom: 12px; }'
  document.head.append(style)
  const instance = await open(slides, { baseClass: 'custom-layout' })
  const { caption } = instance.$refs
  for (const observer of observers) observer.callback()
  assert.equal(getComputedStyle(caption).top, 'auto')
  assert.equal(getComputedStyle(caption).bottom, '12px')
})

test('moving a caption into normal flow clears values left by automatic positioning', async () => {
  const instance = await open()
  const { caption, container } = instance.$refs
  assert.notEqual(caption.style.getPropertyValue('--glare-caption-top'), '')
  caption.style.position = 'relative'
  caption.style.top = '8px'
  for (const observer of observers) observer.callback()
  assert.equal(container.style.getPropertyValue('--glare-caption-inset'), '')
  assert.equal(caption.style.getPropertyValue('--glare-caption-top'), '')
  assert.equal(caption.style.getPropertyValue('--glare-caption-bottom'), '')
  assert.equal(caption.style.top, '8px')
})
