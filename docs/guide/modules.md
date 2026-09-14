# Modules

## Thumbnails

```js
{
  thumbs: {
    autoStart: false,
    hideOnClose: true,
    axis: 'x', // or 'y' for a vertical strip
    parentEl: undefined, // defaults to the lightbox container
  },
}
```

Toggle from the toolbar or:

```js
instance.Thumbs?.toggle()
```

## Slideshow

```js
{
  slideShow: {
    autoStart: false,
    speed: 3000,
  },
}
```

```js
instance.SlideShow?.start()
instance.SlideShow?.stop()
instance.SlideShow?.toggle()
```

Space toggles the slideshow. A progress bar at the top animates with `--glare-accent` for the duration of `speed`.

## Fullscreen

```js
{
  fullScreen: { autoStart: false },
}
```

```js
instance.FullScreen?.toggle()
```

Press `F` while open.

## Share

Opens an overlay with Facebook, X/Twitter, Pinterest, and a copyable URL.

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

Writes `#group-1` style fragments and restores them on load. Requires a gallery name from `data-glare="group"`.

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
