<script setup lang="ts">
import Glare from '@/index'
import { contentExamples, inlineSourceId, type ContentExample } from './content'

/* One card per non-image content type. Each opens its slide as a single-item lightbox. */

function open(example: ContentExample): void {
  Glare.open([example.slide])
}
</script>

<template>
  <div class="grid">
    <button
      v-for="example in contentExamples"
      :key="example.title"
      type="button"
      class="card g-focus"
      @click="open(example)"
    >
      <span class="g-label type">{{ example.type }}</span>
      <strong class="title">{{ example.title }}</strong>
      <span class="note">{{ example.note }}</span>
    </button>
  </div>

  <!--
    Source node for the `inline` example. Glare clones it into the lightbox and the
    page keeps this hidden original. Styled by styles/demo-panel.css, shared with
    the AJAX fragment in public/demo/.
  -->
  <article :id="inlineSourceId" class="demo-panel" hidden>
    <p class="demo-panel__label">inline · #{{ inlineSourceId }}</p>
    <h3 class="demo-panel__title">Cloned from this page.</h3>
    <p class="demo-panel__text">
      This node sits in the page, hidden. Glare copies it into the lightbox, so forms, buttons,
      and event handlers you attach after opening all work.
    </p>
    <label class="demo-panel__field">
      <span>Name</span>
      <input type="text" placeholder="Type here" />
      <small>The hidden original keeps its own value.</small>
    </label>
  </article>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 12px;
  margin-top: 24px;
}

.card {
  display: grid;
  gap: 6px;
  padding: 18px 18px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s,
    transform 0.25s var(--glare-ease);
}

.card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.type {
  color: var(--vp-c-brand-1);
}

.title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
}

.note {
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.45;
}

@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }
}
</style>
