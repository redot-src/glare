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
  --glare-fg: #f4f6f8;
  --glare-surface: #11151c; /* HTML, share, and error panels */
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

The full list lives in `src/styles/tokens.css`.

If the host app already has design tokens (for example Tabler), map them:

```css
:root {
  --glare-accent: var(--tblr-primary);
  --glare-iframe-bg: var(--tblr-body-bg);
}
```

## Layout insets

The space reserved around the media is driven by three variables on `.glare-container`. Media elements use the same values, so changing them never causes overlap:

```css
.glare-container {
  --glare-inset-top: 64px;
  --glare-inset-x: 72px;
  --glare-inset-bottom: 88px;
}
```

## State classes

On `.glare-container`:

- `.glare-is-open` / `.glare-is-closing`
- `.glare-is-idle` — arrows, infobar, and caption hidden
- `.glare-is-slideshow`, `.glare-is-fullscreen`, `.glare-is-modal`
- `.glare-can-zoom-in` / `.glare-can-zoom-out`
- `.glare-show-thumbs` with `.glare-thumbs-axis-x` or `.glare-thumbs-axis-y`
- `.glare-type-image` (and other `.glare-type-*`) — current slide type
- `[data-animation]` / `[data-transition]` — active effects

Per slide: `.glare-slide--image` (and other `--type` variants) on the slide, `.glare-content--image` on the content box.

## Class hooks

```js
{
  baseClass: 'my-lightbox',
  slideClass: 'my-slide',
}
```
