import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import '@/styles/index.css'
import './styles/tokens.css'
import './styles/docs.css'
import DemoHero from './demo/DemoHero.vue'
import ContentTypes from './demo/ContentTypes.vue'
import OptionRecipes from './demo/OptionRecipes.vue'

/** The default theme, restyled, with the demo components available in markdown. */
const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DemoHero', DemoHero)
    app.component('ContentTypes', ContentTypes)
    app.component('OptionRecipes', OptionRecipes)
  },
}

export default theme
