# Toolbar & UI

## Buttons

Configure which controls appear:

```js
{
  buttons: ['zoom', 'slideshow', 'thumbs', 'share', 'download', 'fullscreen', 'close'],
}
```

Omit a button to hide it. `thumbs` and `slideshow` are skipped automatically for single-item groups.

## Custom button templates

Override SVG/markup via `btnTpl`:

```js
{
  btnTpl: {
    close: `<button type="button" class="glare-button" data-glare-close>✕</button>`,
  },
}
```

Placeholders like `{{CLOSE}}` are replaced from the active `i18n` dictionary.

## Caption

```html
<a data-glare href="a.jpg" data-caption="Shot on film · <em>2024</em>"></a>
```

```js
{
  caption: (instance, current) =>
    `${current.caption} — ${instance.currIndex + 1}/${instance.group.length}`,
}
```

## Idle chrome

After `idleTime` seconds without pointer activity, arrows, infobar, and caption fade. The toolbar stays visible so Close remains reachable. Move the pointer to restore the rest. Set `idleTime: false` to keep all UI visible.

`toolbar: 'auto'` (the default) shows the full toolbar on images only. Video, iframe, and HTML slides get the compact close button instead. Pass `toolbar: true` to keep a toolbar on every type — image-only controls such as zoom are still hidden on non-image slides.

## Infobar

Shows `current / total`. Hide with `infobar: false`.
