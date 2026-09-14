# Modules

## Thumbnails

```js
{
  thumbs: {
    autoStart: false,
    axis: 'x', // or 'y' for a vertical strip
    parentEl: undefined, // defaults to the lightbox container
  },
}
```

Toggle from the toolbar or:

```js
instance.thumbs?.toggle()
```

The vertical strip is hidden on screens narrower than 720px, together with its toolbar button.

## Slideshow

```js
{
  slideshow: {
    autoStart: false,
    speed: 3000,
  },
}
```

```js
instance.slideshow?.start()
instance.slideshow?.stop()
instance.slideshow?.toggle()
```

Space toggles the slideshow. A progress bar at the top animates with `--glare-accent` for the duration of `speed`. Without `loop`, the slideshow stops on the last slide.

## Fullscreen

```js
{
  fullscreen: { autoStart: false },
}
```

```js
instance.fullscreen?.toggle()
```

Press `F` while open. Where the browser has no Fullscreen API the module is not created, so `instance.fullscreen` is `undefined`.

## Share

Opens an overlay with Facebook, X/Twitter, Pinterest, a copyable URL, and a Copy button. Escape or the close button dismisses it.

```js
{
  share: {
    url: (item) => item.src || location.href,
  },
}
```

## Hash

```js
{ hash: true }
```

Writes `#group-1` style fragments and restores them on load. Requires a gallery name from `data-glare="group"`. Opening adds one history entry, so the browser's Back button closes the lightbox; moving between slides replaces that entry.

## Media providers

Extend or replace the URL matchers. `url` and `thumb` accept a string with `$1`-style capture references or a function:

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
