import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Glare from '@/index'
import '@/styles/index.css'
import './styles/tokens.css'
import './styles/docs.css'
import './styles/demo-panel.css'
import './styles/demo-effects.css'
import DemoHero from './demo/DemoHero.vue'
import ContentTypes from './demo/ContentTypes.vue'
import OptionRecipes from './demo/OptionRecipes.vue'

/** The default theme, restyled, with the demo components available in markdown. */
const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // This site has a client-side router. Glare's hash module adds a history entry so
    // Back can close the lightbox; VitePress treats leaving that entry as navigation and
    // scrolls to the top. Deep links are not needed in the demo, so turn it off site-wide.
    Glare.defaults.hash = false

    app.component('DemoHero', DemoHero)
    app.component('ContentTypes', ContentTypes)
    app.component('OptionRecipes', OptionRecipes)
  },
}

export default theme
