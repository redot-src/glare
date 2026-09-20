const svg = (paths: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`

export const icons = {
  close: svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
  next: svg('<path d="m9 18 6-6-6-6"/>'),
  prev: svg('<path d="m15 18-6-6 6-6"/>'),
  zoomIn: svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/>'),
  zoomOut: svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/>'),
  download: svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>'),
  thumbs: svg('<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>'),
  play: svg('<polygon points="6 3 20 12 6 21 6 3"/>'),
  pause: svg('<rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/>'),
  fullscreen: svg('<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>'),
  fullscreenExit: svg('<path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>'),
  more: svg('<circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/>'),
  thumbImage: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 17 5-5 4 4 2-2 5 5"/>'),
  thumbVideo: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3Z"/>'),
  thumbEmbed: svg('<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/>'),
  thumbIframe: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 8h18"/><circle cx="6" cy="6" r=".5" fill="currentColor" stroke="none"/><circle cx="9" cy="6" r=".5" fill="currentColor" stroke="none"/>'),
  thumbInline: svg('<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>'),
  thumbAjax: svg('<path d="M20 15a4 4 0 0 0-3-3.87A6 6 0 1 0 6 14"/><path d="m9 16 3 3 3-3M12 12v7"/>'),
  thumbHtml: svg('<path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14"/>'),
  thumbSlide: svg('<path d="M6 3h9l4 4v14H6Z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>'),
} as const
