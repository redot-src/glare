# Accessibility

Glare mounts a `role="dialog"` container with `aria-modal="true"`. Slide changes are announced through a polite live region, and toolbar toggles expose their state through their labels (`aria-expanded` for thumbnails).

## Focus

| Option       | Default | What it does                                      |
| ------------ | ------- | ------------------------------------------------- |
| `autoFocus`  | `true`  | Move focus into the dialog on open.               |
| `trapFocus`  | `true`  | Keep <kbd>Tab</kbd> inside the dialog.            |
| `backFocus`  | `true`  | Return focus to the trigger on close.             |

Controls hidden by the idle fade leave the tab order until the next key press, pointer move, click, or touch.

## Keyboard

| Key                         | Action                                                              |
| --------------------------- | ------------------------------------------------------------------- |
| <kbd>Esc</kbd>              | Close. Collapses the More options menu first when it is open.                                |
| <kbd>←</kbd> / <kbd>↑</kbd> | Previous slide.                                                     |
| <kbd>→</kbd> / <kbd>↓</kbd> | Next slide.                                                         |
| <kbd>Space</kbd>            | Toggle slideshow.                                                   |
| <kbd>F</kbd>                | Toggle fullscreen.                                                  |

Disable shortcuts with `keyboard: false`, or use `modal: true`, which also ignores backdrop clicks and turns off idle fade.

## Labels

Every built-in string comes from the i18n dictionary. Provide translations under `i18n` and pick them with `lang`. Missing keys fall back to English. The full English key list:

| Key                 | English default                                              |
| ------------------- | ------------------------------------------------------------ |
| `CLOSE`             | Close                                                        |
| `NEXT`              | Next                                                         |
| `PREV`              | Previous                                                     |
| `ERROR`             | The requested content cannot be loaded…                      |
| `LOADING`           | Loading                                                      |
| `LIGHTBOX`          | Media lightbox                                               |
| `GO_TO_SLIDE`       | Go to slide {{index}}                                        |
| `VIDEO_UNSUPPORTED` | Your browser does not support HTML5 video.                   |
| `PLAY_START`        | Start slideshow                                              |
| `PLAY_STOP`         | Pause slideshow                                              |
| `FULL_SCREEN`       | Full screen                                                  |
| `FULL_SCREEN_EXIT`  | Exit full screen                                             |
| `THUMBS`            | Thumbnails                                                   |
| `DOWNLOAD`          | Download                                                     |
| `MORE`              | More options                                                 |
| `ZOOM`              | Zoom                                                         |
| `ZOOM_OUT`          | Zoom out                                                     |

```js
Glare.bind('[data-glare]', {
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
      MORE: 'Más opciones',
      ZOOM: 'Zoom',
      ZOOM_OUT: 'Alejar',
    },
  },
})
```

## Reduced motion

When `prefers-reduced-motion: reduce` is set, open and transition animations collapse to instant changes.
