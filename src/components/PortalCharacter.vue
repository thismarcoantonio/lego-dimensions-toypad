<template>
  <div
    ref="dropzoneRef"
    class="w-full aspect-square bg-slate-800 rounded relative overflow-hidden flex items-center justify-center"
    :style="{ backgroundColor: toypadColor }"
    :class="{
      'rounded-full': rounded,
      'ring ring-cyan-400': isOvered,
      'animate-pulse': toypadColor,
    }"
  >
    <button
      v-if="toypadCharacter"
      class="absolute z-10 top-1 right-1 bg-slate-600 rounded-full p-1"
      :class="{ 'top-6 right-6': rounded }"
      @click="handlePadClear"
    >
      <x-icon :size="rounded ? 16 : 14" />
    </button>
    <div
      v-show="toypadCharacter"
      ref="elementRef"
      class="touch-none absolute"
      :class="{ dragging: isDragging }"
      @pointerdown="handleDragStart"
    >
      <img
        :src="`/minifigs/${String(toypadCharacter?.id).padStart(2, '0')}.webp`"
        class="object-cover"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useDroppable, useDraggable } from '@vue-dnd-kit/core';
import { XIcon } from 'lucide-vue-next';
import { useToypadStore } from '@/stores/toypad';
import minifigs from '@/data/minifigs';
import vehicles from '@/data/vehicles';

const $props = defineProps<{
  padIndex: number;
  rounded?: boolean;
}>();

const toypadStore = useToypadStore();

const toypad = computed(() => toypadStore.pads[$props.padIndex] || toypadStore.pads[0]);

const { elementRef: dropzoneRef, isOvered } = useDroppable({
  events: {
    onDrop: async (store, payload) => {
      const data = payload.items[0]?.data;
      if (!data) return false;

      // Add new character
      if (data.character) {
        toypadStore.updateToypadMinifig($props.padIndex, data.character.id);
      }

      // Add new vehicle
      if (data.vehicle) {
        toypadStore.updateToypadVehicle($props.padIndex, data.vehicle.id);
      }

      // Move from another pad
      if (data.padIndex != null) {
        const toypad = toypadStore.pads[data.padIndex]!;
        const minifigId = toypad.minifigId;
        const vehicleId = toypad.vehicleId;
        const uid = toypad.uid;
        await toypadStore.clearPad(data.padIndex);
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (minifigId) toypadStore.updateToypadMinifig($props.padIndex, minifigId, uid);
        if (vehicleId) toypadStore.updateToypadVehicle($props.padIndex, vehicleId, uid);
      }

      return true;
    },
  },
});

const toypadCharacter = computed(() => {
  if (toypad.value?.minifigId) {
    return minifigs.find((minifig) => minifig.id === toypad.value?.minifigId);
  }

  if (toypad.value?.vehicleId) {
    return vehicles.find((vehicle) => vehicle.id === toypad.value?.vehicleId);
  }

  return null;
});

const { elementRef, isDragging, handleDragStart } = useDraggable({
  id: 'toypad-draggable',
  data: { padIndex: $props.padIndex },
});

function handlePadClear() {
  toypadStore.clearPad($props.padIndex);
}

const toypadColor = computed(() => {
  const { r, g, b } = toypad.value || { r: 0, g: 0, b: 0 };
  // If all colors are either 0 or 255, we render the UI color
  if ([r, g, b].every((color) => [0, 255].includes(color))) return;
  return `rgb(${r}, ${g}, ${b})`;
});
</script>
