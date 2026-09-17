<script setup lang="ts">
import Glare from '@/index'
import { recipes, type Recipe } from './content'
import { formatCall } from './formatCall'
import AnchorPicker from './AnchorPicker.vue'
import RecipeCard from './RecipeCard.vue'

/* Each card prints the exact Glare.open() call it performs. */

function open(recipe: Recipe): void {
  Glare.open(recipe.slides, recipe.options, recipe.index)
}
</script>

<template>
  <div class="grid">
    <RecipeCard
      v-for="recipe in recipes"
      :key="recipe.title"
      :title="recipe.title"
      :summary="recipe.summary"
      :code="formatCall(recipe)"
    >
      <button type="button" class="g-button" @click="open(recipe)">Open</button>
    </RecipeCard>
    <AnchorPicker />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

@media (max-width: 420px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
