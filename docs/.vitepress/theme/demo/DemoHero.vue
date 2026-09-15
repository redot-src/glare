<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import CopyCommand from './CopyCommand.vue'
import LightTable from './LightTable.vue'

const version = __GLARE_VERSION__

// Markdown links get this treatment automatically; a plain <a> in a component does not.
const { site } = useData()
const startHref = computed(() =>
  withBase(`/guide/getting-started${site.value.cleanUrls ? '' : '.html'}`),
)
</script>

<template>
  <section class="hero">
    <div class="intro">
      <p class="facts">
        <span>@redot-src/glare</span>
        <span>v{{ version }}</span>
        <span>Zero dependencies</span>
        <span>MIT</span>
      </p>
      <h1 class="g-display">Click any frame.</h1>
      <p class="lede">
        Glare is a touch-first lightbox for the web. It opens images, video, YouTube, Vimeo, maps,
        iframes, nodes from the page, and plain HTML, with zoom, swipe, thumbnails, and a
        slideshow built in.
      </p>
      <div class="actions">
        <a class="g-button g-button--primary" :href="startHref">Get started</a>
        <CopyCommand command="npm i @redot-src/glare" />
      </div>
    </div>

    <LightTable />
  </section>
</template>

<style scoped>
.hero {
  padding-top: 40px;
}

.intro {
  max-width: 44rem;
  margin-bottom: 40px;
}

/* Package facts, set in mono like a label but not uppercased: names and versions are case-sensitive. */
.facts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 0;
  margin: 0 0 20px;
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  letter-spacing: 0.04em;
}

.facts span + span::before {
  content: '·';
  margin: 0 10px;
  color: var(--vp-c-text-3);
}

/* Larger than .vp-doc h1; the type role (Archivo) comes from .g-display. */
.hero h1 {
  margin: 0;
  font-size: clamp(2.75rem, 2rem + 4vw, 5rem);
  line-height: 0.98;
}

.lede {
  margin: 20px 0 0;
  color: var(--vp-c-text-2);
  font-size: 1.125rem;
  line-height: 1.6;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

@media (min-width: 960px) {
  .hero {
    padding-top: 64px;
  }
}
</style>
