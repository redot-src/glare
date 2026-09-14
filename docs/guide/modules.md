# Modules

## Thumbnails

```js
{
  thumbs: {
    autoStart: false,
    hideOnClose: true,
    axis: 'y', // or 'x'
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

Spacebar toggles slideshow when the instance is active.

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
{
  hash: true,
}
```

Uses `#group-1` style fragments. Requires a gallery name from `data-glare="group"`.

## Media providers

Extend or replace matchers:

```js
Glare.defaults.media = {
  ...Glare.defaults.media,
  custom: {
    matcher: /mysite\.com\/watch\/(\w+)/i,
    type: 'iframe',
    url: (m) => `https://mysite.com/embed/${m[1]}`,
    params: { autoplay: 1 },
  },
}
```
