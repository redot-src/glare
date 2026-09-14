# Options

Pass options to `Glare.bind()`, `Glare.open()`, or mutate `Glare.defaults` before opening.

## Core

- `closeExisting` (`false`) — close other instances before opening
- `loop` (`false`) — wrap around gallery ends
- `gutter` (`50`) — spacing hint between slides
- `keyboard` (`true`) — enable keyboard shortcuts
- `arrows` (`true`) — show prev/next
- `infobar` (`true`) — show index indicator
- `toolbar` (`'auto'`) — show toolbar
- `smallBtn` (`'auto'`) — compact close on non-image content
- `buttons` — toolbar controls; default `['zoom','slideshow','thumbs','share','download','fullscreen','close']`
- `idleTime` (`3`) — seconds before chrome hides; `false` to disable
- `protect` (`false`) — block context menu / image drag
- `modal` (`false`) — modal styling; pairs well with disabled outside click
- `parentEl` (`'body'`) — mount node
- `hideScrollbar` (`true`) — lock page scroll while open
- `autoFocus` / `backFocus` / `trapFocus` (`true`) — focus management
- `lang` (`'en'`) — i18n language key
- `i18n` — dictionaries, default `{ en: {...} }`
- `animationEffect` (`'zoom'`) — open animation: `fade`, `zoom`, `slide`, `circular`, `tube`, `rotate`, `zoom-in-out`, or `false`
- `animationDuration` (`366`) — open animation duration in ms
- `transitionEffect` (`'fade'`) — slide change animation
- `transitionDuration` (`366`) — transition duration in ms
- `clickContent` — click action on content (default zooms images)
- `clickSlide` (`'close'`) — click on empty slide area
- `clickOutside` (`'close'`) — click on backdrop
- `dblclickContent` / `dblclickSlide` / `dblclickOutside` (`false`) — double-click actions
- `mobile` — overrides applied on coarse pointers
- `wheel` (`'auto'`) — mouse-wheel navigation
- `touch` (`{ vertical: true, momentum: true }`) — gestures; `false` to disable
- `hash` (`true`) — URL hash sync
- `image.preload` (`false`) — preload neighbors
- `video.autoStart` (`true`) — autoplay HTML5 video
- `iframe.preload` (`true`) — wait for iframe load
- `slideShow` (`{ autoStart: false, speed: 3000 }`) — slideshow module
- `thumbs` (`{ autoStart: false, axis: 'y', ... }`) — thumbnails module
- `fullScreen` (`{ autoStart: false }`) — fullscreen module
- `share` (`true`) — share overlay
- `media` — URL matchers for embeds (built-ins included)
- `caption` — string or `(instance, current) => string`

## Click actions

Allowed values: `false`, `'close'`, `'next'`, `'nextOrClose'`, `'toggleControls'`, `'zoom'`, or a function returning one of those.

## Changing defaults globally

```js
Glare.defaults.loop = true
Glare.defaults.buttons = ['zoom', 'close']
```
