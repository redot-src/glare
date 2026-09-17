# Toolbar & UI

The chrome around the media: toolbar buttons, caption, idle fade, and the infobar. Pass these options to `Glare.bind()` or `Glare.open()`.

## Buttons

The default `buttons` list is, in order:

```js
{
  buttons: ['zoom', 'slideshow', 'thumbs', 'download', 'fullscreen', 'close'],
}
```

Omit a name to hide it. `thumbs` and `slideshow` are skipped for single-item groups, and `fullscreen` is skipped where the browser has no Fullscreen API (for example iPhone Safari).

On screens up to 720px wide, Close stays visible and every other available action moves into an animated More options menu. That keeps the toolbar clear of the slide counter without changing the configured `buttons` list.

The download button targets `downloadSrc`, or the image URL for image slides. Browsers ignore the `download` attribute for cross-origin files unless the server sends `Content-Disposition: attachment`, so the link opens in a new tab rather than navigating away from your page.

### Custom buttons

Put an object in `buttons` to add your own. Glare renders it with the same markup as the built-in buttons, so it is styled, labelled, and folded into the More options menu like them, and calls `click` with the instance, the current slide, and the event:

```js
{
  buttons: [
    'zoom',
    {
      name: 'shuffle',
      label: 'Random slide',
      icon: '<svg viewBox="0 0 24 24">…</svg>',
      click: (instance) => instance.jumpTo(Math.floor(Math.random() * instance.group.length)),
    },
    'close',
  ],
}
```

`name` identifies the button and becomes its `glare-button--{name}` class. `icon` is inserted as HTML, so only pass markup you trust.

## Toolbar visibility

| Option     | Default  | What it does                                                                                                                              |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `toolbar`  | `'auto'` | `'auto'` shows the toolbar on image slides only; `true` on every slide; `false` never. Slides without a toolbar get a compact close button. |
| `smallBtn` | `'auto'` | The compact close button on the slide itself. `'auto'` uses it whenever the toolbar is hidden.                                            |

With `toolbar: true`, the toolbar stays on every type and only the zoom button is hidden on non-image slides.

## Caption

The caption is a band below the slide and above the thumbnail strip. Slides shrink to make room for it, however many lines it takes, so it never covers the media.

Captions come from `data-caption` (or `title`), or from a string / function option that replaces the slide's own caption. HTML is allowed in the caption area; where a plain string is needed (dialog label, image `alt`) the markup is stripped.

```html
<a data-glare href="a.jpg" data-caption="Shot on film · <em>2024</em>"></a>
```

```js
{
  caption: (instance, current) =>
    `${current.caption} — ${instance.currIndex + 1}/${instance.group.length}`,
}
```

## Idle chrome and infobar

After `idleTime` seconds (default `3`) without pointer movement, clicks, touches, or keyboard activity, the arrows, infobar, and caption fade. The toolbar stays so Close remains reachable. Set `idleTime: false` to keep everything visible.

The infobar shows `current / total`. Hide it with `infobar: false`. It is already hidden for single-item groups.

## Templates

Every piece of markup is an option. Placeholders in `{{UPPER_CASE}}` come from the active [i18n dictionary](/guide/accessibility#labels); lower-case ones are filled per slide.

| Option                                    | Placeholders                                                                 | Must contain                                                                                                      |
| ----------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `baseTpl`                                 | dictionary                                                                   | `.glare-bg`, `.glare-inner`, `.glare-stage`, plus `.glare-toolbar`, `.glare-infobar`, `.glare-navigation`, `.glare-caption`, `.glare-live` for the matching features |
| `btnTpl[name]`                            | dictionary                                                                   | the built-in button's `data-glare-{name}` attribute, which wires its click; `smallBtn` is the compact close button |
| `spinnerTpl`                              | dictionary                                                                   | —                                                                                                                 |
| `errorTpl`                                | dictionary                                                                   | —                                                                                                                 |
| `video.tpl`                               | dictionary, `{{src}}`, `{{format}}`, `{{poster}}`                            | a `<video>`                                                                                                       |
| `iframe.tpl`                              | —                                                                            | an `<iframe>`                                                                                                     |

Override one button without replacing the rest:

```js
{
  btnTpl: {
    close: `<button type="button" class="glare-button" data-glare-close aria-label="{{CLOSE}}">✕</button>`,
  },
}
```

The defaults live in `src/templates.ts`.
