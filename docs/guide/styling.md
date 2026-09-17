# Styling

Import the stylesheet once, then override CSS variables and state classes. Durations are not tokens: set `animationDuration` and `transitionDuration` in options, and the runtime writes them onto the container.

```js
import '@redot-src/glare/style.css'
```

## CSS variables

Override on `:root` or `.glare-container`:

| Variable                   | Default                                              | What it controls                          |
| -------------------------- | ---------------------------------------------------- | ----------------------------------------- |
| `--glare-z`                | `100000`                                             | Stacking order of the dialog.             |
| `--glare-font`             | system UI stack                                      | Toolbar, caption, and panel type.         |
| `--glare-bg`               | `rgba(12, 14, 18, 0.92)`                             | Backdrop color.                           |
| `--glare-fg`               | `#f4f6f8`                                            | Primary foreground text and icons.        |
| `--glare-muted`            | `rgba(244, 246, 248, 0.62)`                          | Secondary text.                           |
| `--glare-surface`          | `#11151c`                                            | HTML and error panels.                    |
| `--glare-border`           | `rgba(255, 255, 255, 0.08)`                          | Panel borders.                            |
| `--glare-accent`           | `#ff4d4d`                                            | Accent color (progress bar, links).       |
| `--glare-accent-soft`      | `rgba(255, 77, 77, 0.18)`                            | Soft accent fill.                         |
| `--glare-toolbar-bg`       | `rgba(12, 14, 18, 0.55)`                             | Toolbar background.                       |
| `--glare-toolbar-bg-hover` | `rgba(12, 14, 18, 0.8)`                              | Toolbar background on hover.              |
| `--glare-button-bg`        | `rgba(255, 255, 255, 0.08)`                          | Button background.                        |
| `--glare-button-hover`     | `rgba(255, 255, 255, 0.16)`                          | Button background on hover.               |
| `--glare-button-size`      | `44px`                                               | Toolbar button size.                      |
| `--glare-caption-bg`       | `transparent`                                        | Caption band, below the slide.            |
| `--glare-radius`           | `14px`                                               | Corner radius.                            |
| `--glare-shadow`           | large dark shadow                                    | Panel shadow.                             |
| `--glare-backdrop`         | `blur(14px)`                                         | Backdrop filter.                          |
| `--glare-blur`             | `blur(12px)`                                         | Surface blur.                             |
| `--glare-ease`             | `cubic-bezier(0.22, 1, 0.36, 1)`                     | Motion easing.                            |
| `--glare-iframe-bg`        | `#fff`                                               | Background behind iframes.                |
| `--glare-iframe-radius`    | `5px`                                                | Iframe corner radius.                     |
| `--glare-thumbs-size`      | `95px`                                               | Thumbnail strip size.                     |

Map host design tokens when you already have them:

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

| Selector / class                         | Meaning                                                                 |
| ---------------------------------------- | ----------------------------------------------------------------------- |
| `.glare-is-open` / `.glare-is-closing`   | Open and close transitions on the container.                            |
| `.glare-is-idle`                         | Arrows, infobar, and caption hidden; toolbar stays.                     |
| `.glare-is-slideshow`                    | Slideshow is running.                                                   |
| `.glare-is-fullscreen`                   | Dialog is fullscreen.                                                   |
| `.glare-is-modal`                        | Opened with `modal: true`.                                              |
| `.glare-can-zoom-in` / `.glare-can-zoom-out` | Current image can zoom in or is zoomed.                             |
| `.glare-show-thumbs` with `.glare-thumbs-axis-x` / `-y` | Thumbnail strip visible and its axis.                  |
| `.glare-type-image` (and other `.glare-type-*`) | Current slide type on the container.                             |
| `[data-animation]` / `[data-transition]` | Active open and slide-change effects.                                   |
| `[data-glare-id]`                        | Instance id, for `Glare.getInstance(id)`.                               |
| `.glare-is-active`                       | Toolbar toggles while on, and the current thumbnail.                    |
| `.glare-is-disabled`                     | Prev/next at the ends of a non-looping gallery.                         |
| `.glare-slide--image` / `.glare-content--image` | Type variants on the slide and content box.                      |

## Class hooks

```js
Glare.open(slides, {
  baseClass: 'store-lightbox',
  slideClass: 'store-slide',
})
```

```css
.store-lightbox {
  --glare-bg: rgba(8, 10, 14, 0.94);
  --glare-accent: #5eead4;
  --glare-radius: 18px;
}
```
