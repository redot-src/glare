# Options

Every option, grouped the way you will reach for it. Pass options to `Glare.bind()` or `Glare.open()`, or change `Glare.defaults` once for the whole app.

```js
Glare.open(slides, { loop: true, buttons: ['zoom', 'close'] })
```

Options given to `bind()` or `open()` are merged over `Glare.defaults`. Module options (`slideshow`, `thumbs`, `fullscreen`) merge one level deeper, so `{ slideshow: { speed: 5000 } }` keeps `autoStart` at its default.

## Behavior

| Option          | Default    | What it does                                                                                                              |
| --------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| `loop`          | `false`    | Wrap around at the ends of a gallery. When off, the arrows are disabled on the first and last slide.                     |
| `closeExisting` | `false`    | Close any open lightbox before opening this one. Otherwise instances stack.                                               |
| `keyboard`      | `true`     | Keyboard shortcuts: <kbd>Esc</kbd>, arrows, <kbd>Space</kbd>, <kbd>F</kbd>.                                                |
| `protect`       | `false`    | Block the context menu and image dragging, to discourage saving.                                                          |
| `modal`         | `false`    | Dialog mode: no keyboard shortcuts, no idle fade, and clicks on the backdrop or around the media do nothing.              |
| `idleTime`      | `3`        | Seconds without activity before arrows, counter, and caption fade. The toolbar stays. `false` keeps everything visible.  |
| `hideScrollbar` | `true`     | Lock page scrolling while open, compensating for the scrollbar width so the page does not shift.                          |
| `autoFocus`     | `true`     | Move focus into the dialog on open.                                                                                       |
| `trapFocus`     | `true`     | Keep <kbd>Tab</kbd> inside the dialog.                                                                                    |
| `backFocus`     | `true`     | Return focus to the trigger on close.                                                                                     |
| `defaultType`   | `'image'`  | Type to assume when the URL has no recognizable extension. See [detection rules](/guide/content-types#detection-rules).  |
| `parentEl`      | `'body'`   | Where the dialog is mounted: a selector or an element.                                                                    |
| `delegate`      | —          | A same-origin window, e.g. `window.parent`, that opens the lightbox instead. See [below](#opening-in-another-window).    |
| `baseClass`     | `''`       | Extra class for the container, for scoping your CSS.                                                                      |
| `slideClass`    | `''`       | Extra class for every slide.                                                                                              |

A one-slide dialog that only the close button can dismiss:

```js
Glare.open([{ type: 'html', html: '<h3>Saved</h3><p>Your changes are live.</p>' }], { modal: true })
```

### Opening in another window

Inside a same-origin iframe, `delegate` hands the lightbox to another window so it covers the whole page rather than just the frame:

```js
Glare.bind('[data-glare]', { delegate: window.parent })
```

That window must have Glare loaded, stylesheet included, and exposed as `window.Glare` — the CDN build does this already; with a bundler, set `window.Glare = Glare` yourself. When it is missing, or the page is not framed, the lightbox opens in place. Selectors (`parentEl`, `anchor`, inline `#id` sources) and the `hash` module resolve against the delegate window.

## Chrome

The chrome is everything around the media: arrows, counter, caption, and toolbar.

| Option     | Default    | What it does                                                                                                                                                  |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `arrows`   | `true`     | Previous and next buttons. Hidden automatically for single-slide groups.                                                                                     |
| `infobar`  | `true`     | The `2 / 12` counter. Hidden automatically for single-slide groups.                                                                                          |
| `toolbar`  | `'auto'`   | `'auto'` shows the toolbar on image slides only; `true` on every slide; `false` never. Slides without a toolbar get a compact close button.                  |
| `smallBtn` | `'auto'`   | The compact close button on the slide itself. `'auto'` uses it whenever the toolbar is hidden.                                                                |
| `buttons`  | see below  | Toolbar buttons, in order: built-in names, or [objects for your own](/guide/toolbar#custom-buttons). Buttons that do not apply (thumbnails for one slide, fullscreen without browser support) are skipped.                              |
| `caption`  | —          | A string, or `(instance, current) => string`, that replaces the slide's own caption.                                                                          |

The default `buttons` list is `['zoom', 'slideshow', 'thumbs', 'download', 'fullscreen', 'close']`. Read more in [Toolbar & UI](/guide/toolbar).

## Motion

| Option               | Default   | What it does                                                                                                                  |
| -------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `animationEffect`    | `'zoom'`  | Open and close animation. `'zoom'` flies the image from its `anchor`; `'fade'` cross-fades; `false` opens instantly. Any other name is a [custom effect](/guide/styling#custom-effects). |
| `animationDuration`  | `366`     | Open and close duration in milliseconds.                                                                                      |
| `anchor`             | `'trigger'` | Where `'zoom'` starts: `'trigger'`, a position such as `'center-center'`, an element, or a selector. See below.             |
| `zoomOpacity`        | `true`    | Also fade the image while it flies in with `'zoom'`.                                                                          |
| `transitionEffect`   | `'fade'`  | Effect between slides: `'fade'`, `'slide'`, `'circular'`, `'tube'`, `'rotate'`, `'zoom-in-out'`, or `false`. They mirror when going back. Any other name is a [custom effect](/guide/styling#custom-effects). |
| `transitionDuration` | `366`     | Slide change duration in milliseconds.                                                                                        |

`anchor` accepts:

- `'trigger'`: the element that opened the slide (its `$trigger`). Slides without one fade in.
- A position, written `<vertical>-<horizontal>` from `top`/`center`/`bottom` and `left`/`center`/`right`, such as `'top-left'` or `'center-center'`. The image grows from that spot of the lightbox.
- An element, or any other string as a selector. The image flies from that element; if it is missing or not rendered, the trigger is used instead.

```js
Glare.bind('[data-glare]', { anchor: 'center-center' })
Glare.open(items, { anchor: '#gallery-cover' })
```

Both durations are written to the container as `--glare-duration` and `--glare-transition-duration`, so custom CSS can reuse them. Setting an effect to `false` and setting its duration to `0` are the same thing: nothing animates and nothing waits. Users with `prefers-reduced-motion` get instant changes regardless.

## Interaction

| Option            | Default                              | What it does                                                                                        |
| ----------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `clickContent`    | zoom images, ignore other types      | Click on the media itself.                                                                          |
| `clickSlide`      | `'close'`                            | Click on the empty area around the media, or on the backdrop.                                       |
| `dblclickContent` | `false`                              | Double-click on the media.                                                                          |
| `dblclickSlide`   | `false`                              | Double-click around the media.                                                                      |
| `wheel`           | `'auto'`                             | Mouse wheel changes slides. `'auto'` only over images that are not zoomed; `true` always; `false` never. |
| `touch`           | `{ vertical: true, momentum: true }` | Swipe, pinch, and pan. `vertical` allows swipe-down to close; `momentum` keeps panning briefly after release. `false` disables gestures. |
| `mobile`          | see below                            | Option overrides applied on touch-first devices.                                                    |

Click actions accept `false`, `'close'`, `'next'`, `'nextOrClose'`, `'toggleControls'`, `'zoom'`, or a function `(current, event)` that returns one of those. When a double-click action is set, single clicks wait briefly so a double-tap does not trigger both.

On touch-first devices the built-in `mobile` overrides change what a tap does: a tap on an image toggles the controls, a double tap zooms, a tap around non-image content closes, and `idleTime` is off so the controls never disappear on their own. Override any of them the same way:

```js
{
  mobile: {
    dblclickContent: false, // keep double-tap zoom off
    idleTime: 3,
  },
}
```

## Content

| Option          | Default                                                     | What it does                                                                                             |
| --------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `image.preload` | `false`                                                     | Start loading the previous and next image while the current one is shown.                                |
| `video`         | `{ autoStart: true, format: '', tpl }`                      | HTML5 video. `format` is a MIME type; when empty it is inferred from the extension.                      |
| `iframe`        | `{ preload: true, css: {}, attr: {…}, tpl }`                | Iframe slides. `preload: false` shows the slide before the frame has loaded. `attr` sets iframe attributes. |
| `ajax.settings` | `{ headers: { 'X-Requested-With': 'XMLHttpRequest' } }`     | `fetch()` init for AJAX slides.                                                                          |
| `media`         | YouTube, Vimeo, Google Maps                                 | URL matchers that turn share links into embeds. See [Media providers](/guide/modules#media-providers).  |

## Modules

Each module accepts `true` for its defaults, `false` to turn it off, or an object that is merged over the defaults.

| Option       | Default                              | What it does                                                                         |
| ------------ | ------------------------------------ | ------------------------------------------------------------------------------------ |
| `hash`       | `true`                               | Keep the URL hash in sync with the current slide of a named gallery.                 |
| `slideshow`  | `{ autoStart: false, speed: 3000 }`  | Autoplay. `speed` is the time per slide in milliseconds.                             |
| `thumbs`     | `{ autoStart: false, axis: 'x', fit: 'cover' }` | Thumbnail strip. `axis: 'y'` places it on the side; `fit` sets the images' `object-fit`. |
| `fullscreen` | `{ autoStart: false }`               | Fullscreen toggle. Not created where the browser lacks the Fullscreen API.          |

Details for each live in [Modules](/guide/modules).

## Text and templates

| Option                                        | Default                    | What it does                                                                                   |
| --------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------- |
| `lang`                                        | `'en'`                     | Which `i18n` dictionary to use.                                                                |
| `i18n`                                        | `{ en: { … } }`            | Dictionaries keyed by language. Missing keys fall back to English. See [Labels](/guide/accessibility#labels). |
| `baseTpl`, `btnTpl`, `spinnerTpl`, `errorTpl` | built in                   | HTML templates for the dialog, each toolbar button, the spinner, and the error message. See [Templates](/guide/toolbar#templates). |

## Events

Callbacks such as `afterShow` and `beforeClose` are options too. They are listed in [Events](/guide/events).

## Changing defaults globally

`Glare.defaults` is a plain object. Changes apply to every lightbox opened afterwards:

```js
Glare.defaults.loop = true
Glare.defaults.buttons = ['zoom', 'close']
```
