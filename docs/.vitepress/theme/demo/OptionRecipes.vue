<script setup lang="ts">
import { reactive } from 'vue'
import Glare from '@/index'
import type { GlareOptions } from '@/types'
import { recipes, type Recipe } from './content'
import { formatCall } from './formatCall'
import RecipeCard from './RecipeCard.vue'

/* Each card prints the exact Glare.open() call it performs. Cards with a `pick` add a select for one option. */

const picked = reactive<Record<string, string>>(
  Object.fromEntries(recipes.flatMap((recipe) => (recipe.pick ? [[recipe.title, recipe.pick.initial]] : []))),
)

function optionsOf(recipe: Recipe): GlareOptions {
  return recipe.pick ? { ...recipe.options, [recipe.pick.option]: picked[recipe.title] } : recipe.options
}

function open(recipe: Recipe): void {
  Glare.open(recipe.slides, optionsOf(recipe), recipe.index)
}
</script>

<template>
  <div class="grid">
    <RecipeCard
      v-for="recipe in recipes"
      :key="recipe.title"
      :title="recipe.title"
      :summary="recipe.summary"
      :code="recipe.code ?? formatCall({ options: optionsOf(recipe), index: recipe.index })"
    >
      <select v-if="recipe.pick" v-model="picked[recipe.title]" class="select g-focus" :aria-label="recipe.pick.option">
        <template v-for="(group, i) in recipe.pick.groups" :key="i">
          <optgroup v-if="group.label" :label="group.label">
            <option v-for="value in group.values" :key="value" :value="value">{{ value }}</option>
          </optgroup>
          <option v-for="value in group.values" v-else :key="value" :value="value">{{ value }}</option>
        </template>
      </select>
      <button :id="recipe.buttonId" type="button" class="g-button" @click="open(recipe)">Open</button>
    </RecipeCard>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

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

@media (max-width: 420px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
