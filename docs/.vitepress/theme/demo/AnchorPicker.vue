<script setup lang="ts">
import { computed, ref } from 'vue'
import Glare from '@/index'
import type { Anchor, GlareOptions } from '@/types'
import { anchorChoices, anchorTargetId, frameSlides } from './content'
import { formatCall } from './formatCall'
import RecipeCard from './RecipeCard.vue'

/* A recipe card with a choice: pick an anchor, read the call it makes, run it. */

const anchor = ref<Anchor>('center-center')
const options = computed<GlareOptions>(() => ({ anchor: anchor.value }))

function open(): void {
  Glare.open(frameSlides, options.value)
}
</script>

<template>
  <RecipeCard
    title="Anchor"
    summary="Where the zoom starts: a position in the lightbox, or an element by selector. Here, this Open button."
    :code="formatCall({ options })"
  >
    <select v-model="anchor" class="select g-focus" aria-label="Anchor">
      <optgroup v-for="group in anchorChoices" :key="group.label" :label="group.label">
        <option v-for="choice in group.anchors" :key="String(choice)" :value="choice">{{ choice }}</option>
      </optgroup>
    </select>
    <button :id="anchorTargetId" type="button" class="g-button" @click="open">Open</button>
  </RecipeCard>
</template>

<style scoped>
.select {
  flex: 1;
  min-width: 0;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
}
</style>
