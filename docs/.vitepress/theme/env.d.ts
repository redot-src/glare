declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

/** Injected by `vite.define` in `.vitepress/config.ts` from package.json. */
declare const __GLARE_VERSION__: string
