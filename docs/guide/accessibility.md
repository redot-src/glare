# Accessibility

Glare mounts a `role="dialog"` container with `aria-modal="true"`. Slide changes are announced through a polite live region, and toolbar toggles expose their state through their labels (`aria-expanded` for thumbnails).

## Focus

- `autoFocus` moves focus into the dialog on open
- `trapFocus` cycles Tab within the dialog
- `backFocus` restores the previously focused trigger on close

Controls hidden by the idle fade leave the tab order until the next key press, pointer move, click, or touch.

## Keyboard

- `Escape` — close (closes the share overlay first when it is open)
- `←` / `↑` — previous
- `→` / `↓` — next
- `Space` — toggle slideshow
- `F` — toggle fullscreen

Disable with `keyboard: false`, or use `modal: true` which also ignores backdrop clicks.

## Labels

Every built-in string comes from the i18n dictionary. Provide translations:

```js
{
  lang: 'es',
  i18n: {
    es: {
      CLOSE: 'Cerrar',
      NEXT: 'Siguiente',
      PREV: 'Anterior',
      ERROR: 'No se pudo cargar el contenido.',
      LOADING: 'Cargando',
      LIGHTBOX: 'Visor multimedia',
      GO_TO_SLIDE: 'Ir a la diapositiva {{index}}',
      VIDEO_UNSUPPORTED: 'Tu navegador no admite vídeo HTML5.',
      PLAY_START: 'Iniciar presentación',
      PLAY_STOP: 'Pausar',
      FULL_SCREEN: 'Pantalla completa',
      FULL_SCREEN_EXIT: 'Salir de pantalla completa',
      THUMBS: 'Miniaturas',
      DOWNLOAD: 'Descargar',
      SHARE: 'Compartir',
      COPY: 'Copiar enlace',
      ZOOM: 'Zoom',
      ZOOM_OUT: 'Alejar',
    },
  },
}
```

Missing keys fall back to English.

## Reduced motion

When `prefers-reduced-motion: reduce` is set, open/transition animations collapse to instant changes.
