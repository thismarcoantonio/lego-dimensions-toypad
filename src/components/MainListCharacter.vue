<template>
  <div
    ref="elementRef"
    class="touch-none"
    :class="{ dragging: isDragging }"
    @pointerdown="handleDragStart"
  >
    <li
      class="w-full aspect-square bg-gray-900 relative flex items-center justify-center overflow-hidden rounded"
    >
      <img
        :src="`/minifigs/${String($props.character.id).padStart(2, '0')}.webp`"
        class="absolute object-cover"
      />
    </li>
  </div>
</template>

<script lang="ts" setup>
import { useDraggable } from '@vue-dnd-kit/core';
import type { Character } from '@/types/Character';

const $props = defineProps<{
  character: Character;
}>();

const { elementRef, isDragging, handleDragStart } = useDraggable({
  id: 'character-draggable',
  data: { character: $props.character },
});
</script>
