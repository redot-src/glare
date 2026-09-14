# Accessibility

Glare mounts a `role="dialog"` container with `aria-modal="true"`.

## Focus

- `autoFocus` moves focus into the dialog on open
- `trapFocus` cycles Tab within the dialog
- `backFocus` restores the previously focused trigger on close

## Keyboard

- `Escape` — close
- `←` / `↑` — previous
- `→` / `↓` — next
- `Space` — toggle slideshow
- `F` — toggle fullscreen

Disable with `keyboard: false` (useful for true modal forms).

## Labels

Toolbar controls use `title` and `aria-label` from the i18n dictionary. Provide translations:

```js
{
  lang: 'es',
  i18n: {
    es: {
      CLOSE: 'Cerrar',
      NEXT: 'Siguiente',
      PREV: 'Anterior',
      ERROR: 'No se pudo cargar el contenido.',
      PLAY_START: 'Iniciar presentación',
      PLAY_STOP: 'Pausar',
      FULL_SCREEN: 'Pantalla completa',
      THUMBS: 'Miniaturas',
      DOWNLOAD: 'Descargar',
      SHARE: 'Compartir',
      ZOOM: 'Zoom',
    },
  },
}
```

## Reduced motion

When `prefers-reduced-motion: reduce` is set, open/transition animations collapse to instant changes.
