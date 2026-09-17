<script setup lang="ts">
/* The card shared by the option demos: what it does, the call it makes, and its controls. */

defineProps<{ title: string; summary: string; code: string }>()
</script>

<template>
  <article class="recipe">
    <div class="text">
      <h3>{{ title }}</h3>
      <p>{{ summary }}</p>
    </div>
    <pre class="code"><code>{{ code }}</code></pre>
    <div class="actions">
      <slot />
    </div>
  </article>
</template>

<style scoped>
.recipe {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 14px;
  min-width: 0;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

/* These h3/p sit inside .vp-doc, whose defaults add margins and borders. */
.text h3 {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
}

.text p {
  margin: 4px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.5;
}

.code {
  margin: 0;
  padding: 12px 14px;
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  line-height: 1.6;
  overflow-x: auto;
  tab-size: 2;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
