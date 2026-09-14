import { icons } from './icons'

const button = (name: string, label: string, icon: string, attrs = ''): string =>
  `<button type="button" class="glare-button glare-button--${name}" data-glare-${name} title="{{${label}}}" aria-label="{{${label}}}"${attrs}>${icon}</button>`

export const baseTemplate = `
<div class="glare-container" role="dialog" aria-modal="true" tabindex="-1">
  <div class="glare-bg"></div>
  <div class="glare-progress" hidden></div>
  <div class="glare-inner">
    <div class="glare-live glare-sr-only" aria-live="polite" aria-atomic="true"></div>
    <div class="glare-infobar"><span class="glare-infobar-index"></span></div>
    <div class="glare-toolbar"></div>
    <div class="glare-navigation">
      ${button('prev', 'PREV', icons.prev)}
      ${button('next', 'NEXT', icons.next)}
    </div>
    <div class="glare-stage"></div>
    <div class="glare-caption"></div>
  </div>
</div>`

export const buttonTemplates: Record<string, string> = {
  zoom: button('zoom', 'ZOOM', icons.zoomIn),
  slideshow: button('slideshow', 'PLAY_START', icons.play),
  thumbs: button('thumbs', 'THUMBS', icons.thumbs, ' aria-expanded="false"'),
  share: button('share', 'SHARE', icons.share),
  fullscreen: button('fullscreen', 'FULL_SCREEN', icons.fullscreen),
  more: button('more', 'MORE', icons.more, ' aria-expanded="false" aria-haspopup="true"'),
  close: button('close', 'CLOSE', icons.close),
  download: `<a class="glare-button glare-button--download" data-glare-download download target="_blank" rel="noopener" title="{{DOWNLOAD}}" aria-label="{{DOWNLOAD}}">${icons.download}</a>`,
  smallBtn: `<button type="button" class="glare-button glare-close-small" data-glare-close title="{{CLOSE}}" aria-label="{{CLOSE}}">${icons.close}</button>`,
}

export const spinnerTemplate = '<div class="glare-spinner" role="status" aria-label="{{LOADING}}"></div>'

export const errorTemplate = '<div class="glare-error"><p>{{ERROR}}</p></div>'

export const videoTemplate =
  '<video class="glare-video" controls playsinline controlsList="nodownload" poster="{{poster}}">' +
  '<source src="{{src}}" type="{{format}}"/>' +
  '{{VIDEO_UNSUPPORTED}}' +
  '</video>'

export const iframeTemplate = '<iframe class="glare-iframe"></iframe>'

export const shareTemplate = `
<div class="glare-share" role="dialog" aria-label="{{SHARE}}">
  <div class="glare-share-head">
    <h4 class="glare-share-title">{{SHARE}}</h4>
    <button type="button" class="glare-button glare-share-close" data-glare-share-close title="{{CLOSE}}" aria-label="{{CLOSE}}">${icons.close}</button>
  </div>
  <p><a class="glare-share-link" href="{{url_facebook}}" target="_blank" rel="noopener">Facebook</a></p>
  <p><a class="glare-share-link" href="{{url_twitter}}" target="_blank" rel="noopener">X / Twitter</a></p>
  <p><a class="glare-share-link" href="{{url_pinterest}}" target="_blank" rel="noopener">Pinterest</a></p>
  <div class="glare-share-row">
    <input class="glare-share-input" type="text" value="{{url_direct}}" readonly />
    <button type="button" class="glare-share-copy" data-glare-share-copy>{{COPY}}</button>
  </div>
</div>`
