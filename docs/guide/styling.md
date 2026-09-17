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
| `--glare-caption-bg`       | `transparent`                                        | Caption backdrop, under the media.        |
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
| `[data-animation]` / `[data-transition]` | Active open and slide-change effects. `data-transition` appears with the first slide change. |
| `[data-glare-id]`                        | Instance id, for `Glare.getInstance(id)`.                               |
| `.glare-is-active`                       | Toolbar toggles while on, and the current thumbnail.                    |
| `.glare-is-disabled`                     | Prev/next at the ends of a non-looping gallery.                         |
| `.glare-slide--image` / `.glare-content--image` | Type variants on the slide and content box.                      |

## Custom effects

`animationEffect` and `transitionEffect` accept any name. Glare writes it to `data-animation` or `data-transition` on the container, and your CSS does the rest, the same way the built-in effects work.

| Hook                           | What it is                                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------------------- |
| `.glare-slide--in`             | The slide entering through a slide change.                                                     |
| `.glare-slide--out`            | The slide leaving. It fades out and is removed after `transitionDuration`.                     |
| `.glare-slide--opening`        | The first slide, shown as the lightbox opens. Slide-change effects never touch it.             |
| `--glare-direction`            | On every slide: `1` when moving to a later slide, `-1` to an earlier one. Multiply by it to mirror an effect. |
| `--glare-transition-duration`  | `transitionDuration`, or `0ms` when the effect is off or the user prefers reduced motion.      |
| `--glare-duration`             | The same for `animationDuration`.                                                              |
| `--glare-ease`                 | The easing the built-in effects use.                                                           |

A slide-change effect animates the entering slide with a keyframe and gives the leaving one a target to transition to:

```css
[data-transition='flip'] .glare-slide--in {
  animation: flip-in var(--glare-transition-duration) var(--glare-ease);
}

[data-transition='flip'] .glare-slide--out {
  transform: perspective(1200px) rotateY(calc(var(--glare-direction) * -70deg));
}

@keyframes flip-in {
  from {
    transform: perspective(1200px) rotateY(calc(var(--glare-direction) * 70deg));
    opacity: 0;
  }
}
```

```js
Glare.bind('[data-glare]', { transitionEffect: 'flip' })
```

An open animation targets the opening slide, and the current slide while the container is `.glare-is-closing`. The backdrop and chrome fade in and out on their own:

```css
[data-animation='drop'] .glare-slide--opening {
  animation: drop-in var(--glare-duration) var(--glare-ease);
}

[data-animation='drop'].glare-is-closing .glare-slide--current {
  transform: translate3d(0, 60px, 0);
  transition: transform var(--glare-duration) var(--glare-ease);
}

@keyframes drop-in {
  from {
    transform: translate3d(0, -60px, 0);
  }
}
```

```js
Glare.bind('[data-glare]', { animationEffect: 'drop' })
```

Set `animationDuration` and `transitionDuration` as usual; a duration of `0`, or `prefers-reduced-motion`, turns a custom effect off like any other.

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
