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
}
```

## Useful classes

- `.glare-container` — root dialog
- `.glare-is-open` / `.glare-is-ready` — open states
- `.glare-is-idle` — chrome hidden
- `.glare-is-slideshow` — slideshow running
- `.glare-is-fullscreen` — fullscreen active
- `.glare-can-zoom-in` / `.glare-can-zoom-out` — zoom affordance
- `.glare-show-thumbs` — thumbs visible
- `.glare-content--image` (and other `--type` variants) — per-type content

## Base / slide class hooks

```js
{
  baseClass: 'my-lightbox',
  slideClass: 'my-slide',
}
```
