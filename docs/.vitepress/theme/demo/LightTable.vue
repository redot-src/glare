<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Glare from '@/index'
import type { BoundGroup } from '@/types'
import { frames } from './content'

/*
 * The hero gallery. It uses Glare the declarative way: anchors carry
 * data-glare / href / data-caption, and Glare.bind() turns them into a gallery.
 */

const root = ref<HTMLElement | null>(null)
let group: BoundGroup | null = null

onMounted(() => {
  if (root.value) group = Glare.bind(root.value.querySelectorAll('a'), { loop: true })
})

onBeforeUnmount(() => group?.destroy())

const pad = (n: number): string => String(n).padStart(2, '0')
</script>

<template>
  <div ref="root" class="table">
    <a
      v-for="(frame, i) in frames"
      :key="frame.src"
      class="slide g-focus"
      data-glare="light-table"
      :href="frame.src"
      :data-caption="frame.caption"
      :style="{ '--i': i }"
    >
      <span class="mount">
        <img :src="frame.thumb" :alt="frame.caption" width="640" height="480" :loading="i < 3 ? 'eager' : 'lazy'" />
      </span>
      <span class="edge">
        <span class="g-label counter">{{ pad(i + 1) }} / {{ pad(frames.length) }}</span>
        <span class="caption">{{ frame.caption }}</span>
      </span>
    </a>
  </div>
</template>

<style scoped>
/* The lit surface the slides rest on. */
.table {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background:
    radial-gradient(70% 80% at 50% 40%, var(--g-glow), transparent 100%),
    var(--vp-c-bg-alt);
}

.slide {
  display: block;
  color: inherit;
  text-decoration: none;
  animation: settle 0.5s var(--glare-ease) both;
  animation-delay: calc(var(--i) * 60ms);
}

.mount {
  display: block;
  padding: 6px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  box-shadow: var(--g-shadow);
  transition:
    transform 0.25s var(--glare-ease),
    box-shadow 0.25s var(--glare-ease);
}

.slide:hover .mount {
  transform: translateY(-3px);
  box-shadow:
    0 2px 4px rgba(23, 25, 30, 0.08),
    0 20px 40px -12px rgba(23, 25, 30, 0.28);
}

.dark .slide:hover .mount {
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.5),
    0 24px 48px -12px rgba(0, 0, 0, 0.7);
}

img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 5px;
  object-fit: cover;
  background: var(--vp-c-bg-alt);
}

.edge {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  padding: 0 4px;
  font-size: 13px;
  line-height: 1.4;
}

.counter {
  flex-shrink: 0;
  color: var(--vp-c-text-3);
}

.caption {
  overflow: hidden;
  color: var(--vp-c-text-2);
  text-overflow: ellipsis;
  white-space: nowrap;
}

@keyframes settle {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
}

@media (max-width: 767px) {
  .table {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    padding: 14px;
    border-radius: 14px;
  }

  .caption {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .slide,
  .mount {
    animation: none;
    transition: none;
  }
}
</style>
