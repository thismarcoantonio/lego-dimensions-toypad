<template>
  <div ref="elementRef" @pointerdown="handleDragStart" :class="{ dragging: isDragging }">
    <li
      class="w-full aspect-square bg-gray-900 relative flex items-center justify-center overflow-hidden rounded"
    >
      {{ $props.vehicle.name }}
    </li>
  </div>
</template>

<script lang="ts" setup>
import { useDraggable } from '@vue-dnd-kit/core';
import type { Vehicle } from '@/types/Vehicle';

const $props = defineProps<{
  vehicle: Vehicle;
}>();

const { elementRef, isDragging, handleDragStart } = useDraggable({
  id: 'vehicle-draggable',
  data: { vehicle: $props.vehicle },
});
</script>
