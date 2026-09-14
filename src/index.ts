import './styles/index.css'

import { Glare } from './core/Glare'

export type {
  AjaxOptions,
  AnimationEffect,
  BoundGroup,
  ClickAction,
  ClickActionName,
  ContentType,
  EventHandler,
  EventName,
  FullscreenOptions,
  GlareInstance,
  GlareOptions,
  GlareRefs,
  I18nDict,
  IframeOptions,
  ImageOptions,
  MediaProvider,
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

export { Glare }
export { defaults } from './defaults'
export { i18nEn } from './i18n'
export { providers as defaultMedia } from './media/providers'
export { detectType } from './media/detect'
export { itemsFromElements, normalizeItem } from './media/items'

export const autoBind = Glare.autoBind

export default Glare
