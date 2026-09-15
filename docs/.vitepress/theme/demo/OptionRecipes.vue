<script setup lang="ts">
import Glare from '@/index'
import { recipes, type Recipe } from './content'
import { formatCall } from './formatCall'

/* Each card prints the exact Glare.open() call it performs. */

function open(recipe: Recipe): void {
  Glare.open(recipe.slides, recipe.options, recipe.index)
}
</script>

<template>
  <div class="grid">
    <article v-for="recipe in recipes" :key="recipe.title" class="recipe">
      <div class="text">
        <h3>{{ recipe.title }}</h3>
        <p>{{ recipe.summary }}</p>
      </div>
      <pre class="code"><code>{{ formatCall(recipe) }}</code></pre>
      <button type="button" class="g-button open" @click="open(recipe)">Open</button>
    </article>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.recipe {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 14px;
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

.open {
  justify-self: start;
}

@media (max-width: 420px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
