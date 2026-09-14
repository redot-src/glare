# Toolbar & UI

## Buttons

```js
{
  buttons: ['zoom', 'slideshow', 'thumbs', 'share', 'download', 'fullscreen', 'close'],
}
```

Omit a button to hide it. `thumbs` and `slideshow` are skipped for single-item groups.

## Toolbar visibility

`toolbar: 'auto'` (the default) shows the full toolbar on images only. Video, iframe, and HTML slides get the compact close button instead. With `toolbar: true` the toolbar stays on every type, but image-only controls are hidden on non-image slides.

## Custom button templates

Override markup via `btnTpl`. The `data-glare-*` attribute is what wires the click:

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

After `idleTime` seconds without pointer activity the arrows, infobar, and caption fade. The toolbar stays visible so Close remains reachable. Set `idleTime: false` to keep everything visible.

## Infobar

Shows `current / total`. Hide with `infobar: false`.
