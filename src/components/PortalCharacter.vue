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
    <img
      v-if="toypadCharacter"
      :src="`/minifigs/${String(toypadCharacter?.id).padStart(2, '0')}.webp`"
      class="absolute object-cover"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useDroppable } from '@vue-dnd-kit/core';
import { XIcon } from 'lucide-vue-next';
import { useToypadStore } from '@/stores/toypad';
import type { ToypadPad } from '@/types/Toypad';
import minifigs from '@/data/minifigs';
import vehicles from '@/data/vehicles';

const $props = defineProps<{
  pad: ToypadPad;
  rounded?: boolean;
}>();

const toypadStore = useToypadStore();

const { elementRef: dropzoneRef, isOvered } = useDroppable({
  events: {
    onDrop: (store, payload) => {
      const data = payload.items[0]?.data;
      if (!data) return;

      if (data.character) {
        toypadStore.updateToypadMinifig($props.pad.uid, data.character);
      }

      if (data.vehicle) {
        toypadStore.updateToypadVehicle($props.pad.uid, data.vehicle);
      }
    },
  },
});

function handlePadClear() {
  toypadStore.clearPad($props.pad.uid);
}

const toypadColor = computed(() => {
  if ([$props.pad.r, $props.pad.g, $props.pad.b].every((color) => color === 0)) return;
  return `rgb(${$props.pad.r}, ${$props.pad.g}, ${$props.pad.b})`;
});

const toypadCharacter = computed(() => {
  if ($props.pad.minifigId) {
    return minifigs.find((minifig) => minifig.id === $props.pad.minifigId);
  }

  if ($props.pad.vehicleId) {
    return vehicles.find((vehicle) => vehicle.id === $props.pad.vehicleId);
  }

  return null;
});
</script>
