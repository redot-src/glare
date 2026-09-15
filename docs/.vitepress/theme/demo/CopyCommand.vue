<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ command: string }>()

const copied = ref(false)

async function copy(): Promise<void> {
  await navigator.clipboard.writeText(props.command)
  copied.value = true
  setTimeout(() => (copied.value = false), 1600)
}
</script>

<template>
  <button type="button" class="g-button command" :aria-label="`Copy ${command}`" @click="copy">
    <span class="prompt" aria-hidden="true">$</span>
    <code>{{ command }}</code>
    <span class="status" aria-live="polite">{{ copied ? 'Copied' : 'Copy' }}</span>
  </button>
</template>

<style scoped>
.command {
  padding-right: 6px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  font-weight: 400;
}

.prompt {
  color: var(--vp-c-text-3);
}

/* Plain text: .vp-doc gives inline code a pill background, which would double up the button. */
.command code {
  padding: 0;
  background: none;
  color: var(--vp-c-text-1);
  font-size: inherit;
}

.status {
  margin-left: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-base);
  font-size: 12px;
  font-weight: 500;
}
</style>
