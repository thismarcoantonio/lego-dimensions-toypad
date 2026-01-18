<template>
  <button class="w-full py-2" :class="{ 'text-cyan-400 border-b-2': active }">
    <slot />
  </button>
</template>

<script lang="ts" setup>
defineProps<{
  active?: boolean;
}>();
</script>
