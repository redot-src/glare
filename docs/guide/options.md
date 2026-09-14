# Options

Pass options to `Glare.bind()`, `Glare.open()`, or mutate `Glare.defaults` before opening.

## Behaviour

- `closeExisting` (`false`) — close other instances before opening
- `loop` (`false`) — wrap around gallery ends
- `keyboard` (`true`) — enable keyboard shortcuts
- `protect` (`false`) — block the context menu and image dragging
- `modal` (`false`) — modal mode: no keyboard shortcuts, no idle fade, backdrop ignores clicks
- `idleTime` (`3`) — seconds before arrows, infobar, and caption fade; the toolbar stays visible. `false` disables it
- `hideScrollbar` (`true`) — lock page scroll while open
- `autoFocus` / `backFocus` / `trapFocus` (`true`) — focus management
- `defaultType` (`'image'`) — type used when a URL has no recognizable extension
- `parentEl` (`'body'`) — mount node
- `baseClass` / `slideClass` — extra classes for the container and each slide

## Chrome

- `arrows` (`true`) — show prev/next buttons
- `infobar` (`true`) — show the `2 / 12` counter
- `toolbar` (`'auto'`) — `'auto'` shows the toolbar for images only; `true` always; `false` never
- `smallBtn` (`'auto'`) — compact close button on the slide; `'auto'` uses it whenever the toolbar is hidden
- `buttons` — toolbar controls; default `['zoom', 'slideshow', 'thumbs', 'share', 'download', 'fullscreen', 'close']`
- `caption` — string or `(instance, current) => string` overriding the item caption

## Motion

- `animationEffect` (`'zoom'`) — open animation: `'zoom'` flies the image in from its trigger, `'fade'` cross-fades, `false` disables it
- `animationDuration` (`366`) — open/close duration in ms
- `zoomOpacity` (`true`) — dim the image while it flies in
- `transitionEffect` (`'fade'`) — slide change: `'fade'`, `'slide'`, `'circular'`, `'tube'`, `'rotate'`, `'zoom-in-out'`, or `false`
- `transitionDuration` (`366`) — slide change duration in ms

## Interaction

- `clickContent` — click on the media itself; default zooms images
- `clickSlide` (`'close'`) — click on the empty area around the media or on the backdrop
- `dblclickContent` / `dblclickSlide` (`false`) — double-click actions
- `wheel` (`'auto'`) — mouse-wheel navigation: `'auto'` on images only, `true` on every slide, `false` off
- `touch` (`{ vertical: true, momentum: true }`) — gestures; `false` disables them
- `mobile` — option overrides applied on touch-first devices

Click actions accept `false`, `'close'`, `'next'`, `'nextOrClose'`, `'toggleControls'`, `'zoom'`, or a function `(current, event)` returning one of those.

## Content

- `image.preload` (`false`) — preload neighbouring images
- `video` — `{ tpl, format, autoStart: true }`
- `iframe` — `{ preload: true, css, attr, tpl }`; `preload: false` reveals the slide before the frame loads
- `ajax.settings` — `fetch()` options for AJAX slides
- `media` — URL matchers for embeds; see [Modules](/guide/modules#media-providers)

## Modules

- `hash` (`true`) — sync the URL hash with the current slide of a named gallery
- `slideShow` (`{ autoStart: false, speed: 3000 }`) — `true` for defaults, `false` to disable
- `thumbs` (`{ autoStart: false, axis: 'x', hideOnClose: true }`) — `axis: 'y'` for a side strip
- `fullScreen` (`{ autoStart: false }`)
- `share` (`true`) — share overlay; accepts `{ url, tpl }`

## Text and templates

- `lang` (`'en'`) — dictionary key
- `i18n` — dictionaries, default `{ en: { ... } }`
- `baseTpl`, `btnTpl`, `spinnerTpl`, `errorTpl` — markup templates; see [Toolbar & UI](/guide/toolbar)

## Changing defaults globally

```js
Glare.defaults.loop = true
Glare.defaults.buttons = ['zoom', 'close']
```
