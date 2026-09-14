# Styling

Import the stylesheet once:

```js
import '@redot-src/glare/style.css'
```

## CSS variables

Override on `:root` or `.glare-container`:

```css
:root {
  --glare-bg: rgba(8, 10, 14, 0.94);
  --glare-accent: #5eead4;
  --glare-accent-soft: rgba(94, 234, 212, 0.18);
  --glare-radius: 18px;
  --glare-button-size: 46px;
  --glare-duration: 280ms;
  --glare-font: "Your Font", system-ui, sans-serif;
  --glare-iframe-bg: #fff;
  --glare-iframe-radius: 5px;
  --glare-thumbs-size: 95px;
}
```

If the host app already has a primary/body token (for example Tabler), map them:

```css
:root {
  --glare-accent: var(--tblr-primary);
  --glare-iframe-bg: var(--tblr-body-bg);
}
```

## Useful classes

- `.glare-container` — root dialog
- `.glare-is-open` / `.glare-is-ready` — open states
- `.glare-is-idle` — arrows/infobar/caption hidden; toolbar stays
- `.glare-is-slideshow` — slideshow running
- `.glare-is-fullscreen` — fullscreen active
- `.glare-can-zoom-in` / `.glare-can-zoom-out` — zoom affordance
- `.glare-show-thumbs` — thumbs visible
- `.glare-thumbs-axis-x` / `.glare-thumbs-axis-y` — thumbnail orientation
- `.glare-type-image` (and other `.glare-type-*`) — current slide type on the root
- `.glare-slide--iframe` (and other `--type` variants) — per-slide type
- `.glare-content--image` (and other `--type` variants) — per-type content

## Base / slide class hooks

```js
{
  baseClass: 'my-lightbox',
  slideClass: 'my-slide',
}
```
