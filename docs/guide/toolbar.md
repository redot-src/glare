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

After `idleTime` seconds without pointer activity, toolbar/arrows fade. Move the pointer to restore. Set `idleTime: false` to keep UI visible.

## Infobar

Shows `current / total`. Hide with `infobar: false`.
