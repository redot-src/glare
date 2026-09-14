import './styles/glare.css'

export type {
  AnimationEffect,
  AjaxOptions,
  BoundGroup,
  ClickAction,
  ContentType,
  EventHandler,
  EventName,
  FullscreenOptions,
  HashOptions,
  I18nDict,
  IframeOptions,
  ImageOptions,
  MediaProvider,
  GlareInstance,
  GlareOptions,
  ShareOptions,
  SlideItem,
  SlideSource,
  SlideshowOptions,
  ThumbsOptions,
  ToolbarButton,
  TouchOptions,
  TransitionEffect,
  VideoOptions,
} from './types'

export { defaults, defaultMedia, i18nEn } from './defaults'
export { Glare, autoBind } from './instance'
export { detectType, normalizeItem, itemsFromElements } from './media'

import { Glare } from './instance'

export default Glare
