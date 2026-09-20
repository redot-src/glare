<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Glare from '@/index'

/*
 * The page behind the `iframe` content example (docs/demo/frame.md). It is a separate
 * window with its own copy of Glare, and its button opens this same page again. With
 * `delegate` the new lightbox stacks in the window holding the frame; without it, the
 * lightbox opens inside the frame.
 */

const level = ref(1)
const delegate = ref(true)

onMounted(() => {
  level.value = Number(new URLSearchParams(location.search).get('level')) || 1
})

function open(): void {
  const next = level.value + 1
  Glare.open(
    [{ type: 'iframe', src: `${location.pathname}?level=${next}`, caption: `Level ${next}` }],
    delegate.value ? { delegate: window.parent } : {},
  )
}
</script>

<template>
  <main class="page">
    <p class="g-label level">same-origin iframe · level {{ level }}</p>
    <h1 class="g-display title">This page opens itself.</h1>
    <p class="text">
      It has Glare loaded too. With <code>delegate</code>, the next lightbox is handed to the
      parent window and covers the whole page. Without it, the lightbox stays inside this frame.
    </p>
    <div class="actions">
      <button type="button" class="g-button g-button--primary" @click="open">Open this page again</button>
      <label class="toggle">
        <input v-model="delegate" type="checkbox" />
        <code>delegate: window.parent</code>
      </label>
    </div>
  </main>
</template>

<style scoped>
.page {
  display: grid;
  align-content: center;
  gap: 14px;
  max-width: 560px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 32px 24px;
}

.level {
  color: var(--vp-c-brand-1);
}

.title {
  font-size: 2rem;
  line-height: 1.1;
}

.text {
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  cursor: pointer;
}
</style>
