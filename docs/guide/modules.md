# Modules

Optional features you turn on or configure through options. Each accepts `true` for its defaults, `false` to turn it off, or an object merged over the defaults. Module handles live on the open instance when the module is enabled.

## Thumbnails

| Option      | Default     | What it does                                              |
| ----------- | ----------- | --------------------------------------------------------- |
| `autoStart` | `false`     | Show the strip as soon as the lightbox opens.             |
| `axis`      | `'x'`       | `'x'` for a horizontal strip; `'y'` for a side strip.     |
| `parentEl`  | lightbox    | Where to mount the strip: a selector, element, or the lightbox container. |

```js
Glare.bind('[data-glare="catalog"]', {
  thumbs: { autoStart: true, axis: 'x' },
})
```

```js
instance.thumbs?.show()
instance.thumbs?.hide()
instance.thumbs?.toggle()
instance.thumbs?.focus(index?)
```

The vertical strip is hidden on screens narrower than 720px, together with its toolbar button. Thumbnails need at least two slides.

## Slideshow

| Option      | Default | What it does                                      |
| ----------- | ------- | ------------------------------------------------- |
| `autoStart` | `false` | Start autoplay when the lightbox opens.           |
| `speed`     | `3000`  | Time per slide in milliseconds.                   |

```js
instance.slideshow?.start()
instance.slideshow?.stop()
instance.slideshow?.toggle()
instance.slideshow?.isActive()
```

<kbd>Space</kbd> toggles the slideshow. A progress bar at the top animates with `--glare-accent` for the duration of `speed`. Without `loop`, the slideshow stops on the last slide.

## Fullscreen

| Option      | Default | What it does                            |
| ----------- | ------- | --------------------------------------- |
| `autoStart` | `false` | Enter fullscreen when the lightbox opens. |

```js
instance.fullscreen?.request()
instance.fullscreen?.exit()
instance.fullscreen?.toggle()
instance.fullscreen?.isFullscreen()
```

Press <kbd>F</kbd> while open. Where the browser has no Fullscreen API the module is not created, so `instance.fullscreen` is `undefined`.

## Share

Opens an overlay with Facebook, X/Twitter, Pinterest, a copyable URL, and a Copy button. <kbd>Esc</kbd> or the close button dismisses it.

| Option | Default                         | What it does                                      |
| ------ | ------------------------------- | ------------------------------------------------- |
| `url`  | absolute `src`, else page URL   | String or `(item) => string` used as the share URL. |
| `tpl`  | built in                        | Overlay markup. See [Templates](/guide/toolbar#templates). |

```js
{
  share: {
    url: (item) => item.src || location.href,
  },
}
```

```js
instance.share?.open()
instance.share?.close()
instance.share?.isOpen
```

## Hash

| Option | Default | What it does                                                                 |
| ------ | ------- | ---------------------------------------------------------------------------- |
| `hash` | `true`  | Keep the URL hash in sync with the current slide of a named gallery.         |

Writes `#group-1` style fragments and restores them on load. Requires a gallery name from `data-glare="group"`. Opening adds one history entry, so the browser Back button closes the lightbox; moving between slides replaces that entry. Turn it off in apps with a client-side router. More detail in [Galleries](/guide/galleries#hash-deep-links).

## Media providers

Providers turn share URLs into embeds. Each entry is a `MediaProvider`:

| Field     | Meaning                                                                 |
| --------- | ----------------------------------------------------------------------- |
| `matcher` | Regular expression tested against `src`.                                |
| `type`    | Content type to assign (`embed`, `iframe`, …). Defaults to `iframe`.    |
| `url`     | Embed URL: a string with `$1`-style captures, or `(match, url) => string`. |
| `thumb`   | Optional thumbnail URL, same shapes as `url`.                           |
| `params`  | Query parameters appended to the embed URL.                             |

Built-in providers cover YouTube, Vimeo, and Google Maps. Add your own on `Glare.defaults.media`:

```js
Glare.defaults.media = {
  ...Glare.defaults.media,
  custom: {
    matcher: /mysite\.com\/watch\/(\w+)/i,
    type: 'iframe',
    url: 'https://mysite.com/embed/$1',
    params: { autoplay: 1 },
  },
}
```
