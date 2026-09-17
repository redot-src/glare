import { Glare } from './core/glare'

export type {
  AjaxOptions,
  Anchor,
  AnchorPosition,
  AnimationEffect,
  BoundGroup,
  ClickAction,
  ClickActionName,
  ContentType,
  CustomButton,
  EventHandler,
  EventName,
  FullscreenOptions,
  GlareInstance,
  GlareOptions,
  GlareRefs,
  I18nDict,
  IframeOptions,
  ImageOptions,
  LifecycleEvent,
  LifecycleHandler,
  MediaProvider,
  ResolvedOptions,
  SlideEvent,
  SlideItem,
  SlideSource,
  SlideshowOptions,
  ThumbsOptions,
  ToolbarButton,
  TouchOptions,
  TransitionEffect,
  VideoOptions,
} from './types'
export type { Point, Zoom, ZoomState } from './core/zoom'

export { Glare }

export const autoBind = Glare.autoBind

export default Glare
