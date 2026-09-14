# Toolbar & UI

## Buttons

```js
{
  buttons: ['zoom', 'slideshow', 'thumbs', 'share', 'download', 'fullscreen', 'close'],
}
```

Omit a button to hide it. `thumbs` and `slideshow` are skipped for single-item groups, and `fullscreen` is skipped where the browser has no Fullscreen API (iPhone Safari).

On screens up to 720px wide, Close stays visible and every other available action moves into an animated More options menu. This keeps the toolbar clear of the slide counter without changing the configured `buttons` list.

The download button targets `downloadSrc`, or the image URL for image slides. Browsers ignore the `download` attribute for cross-origin files unless the server sends `Content-Disposition: attachment`, so the link opens in a new tab rather than navigating away from your page.

## Toolbar visibility

`toolbar: 'auto'` (the default) shows the toolbar on images only. Video, embed, iframe, and HTML slides get the compact close button instead. With `toolbar: true` the toolbar stays on every type and only the zoom button is hidden on non-image slides.

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

Captions are HTML. Where a plain string is needed (the dialog label, image `alt`, share text) the markup is stripped.

## Idle chrome

After `idleTime` seconds without pointer or keyboard activity the arrows, infobar, and caption fade. The toolbar stays visible so Close remains reachable. Set `idleTime: false` to keep everything visible.

## Infobar

Shows `current / total`. Hide with `infobar: false`.

## Templates

Every piece of markup is an option. Placeholders in `{{UPPER_CASE}}` come from the active [i18n dictionary](/guide/accessibility#labels); lower-case ones are filled per slide.

| Option | Placeholders | Must contain |
| --- | --- | --- |
| `baseTpl` | dictionary | `.glare-bg`, `.glare-inner`, `.glare-stage`, plus `.glare-toolbar`, `.glare-infobar`, `.glare-navigation`, `.glare-caption`, `.glare-live` for the matching features |
| `btnTpl[name]` | dictionary | a `data-glare-{name}` attribute, which wires the click; `smallBtn` is the compact close button |
| `spinnerTpl` | dictionary | — |
| `errorTpl` | dictionary | — |
| `video.tpl` | dictionary, `{{src}}`, `{{format}}`, `{{poster}}` | a `<video>` |
| `iframe.tpl` | — | an `<iframe>` |
| `share.tpl` | dictionary, `{{url_direct}}`, `{{url_facebook}}`, `{{url_twitter}}`, `{{url_pinterest}}` | `data-glare-share-close` and `data-glare-share-copy` for the close and copy buttons |

```js
{
  btnTpl: {
    close: `<button type="button" class="glare-button" data-glare-close aria-label="{{CLOSE}}">✕</button>`,
  },
}
```

The defaults live in `src/templates.ts`.
