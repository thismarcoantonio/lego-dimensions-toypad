<template>
  <div
    ref="dropzoneRef"
    class="w-full aspect-square bg-slate-800 rounded relative overflow-hidden flex items-center justify-center"
    :class="{ 'rounded-full': rounded, 'ring ring-cyan-400': isOvered }"
  >
    <button
      v-if="active"
      class="absolute z-10 top-1 right-1 bg-slate-600 rounded-full p-1"
      :class="{ 'top-6 right-6': rounded }"
      @click="handlePadClear"
    >
      <x-icon :size="rounded ? 16 : 14" />
    </button>
    <img
      v-if="active"
      :src="`/minifigs/${String(active.id).padStart(2, '0')}.webp`"
      class="absolute object-cover"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useDroppable } from '@vue-dnd-kit/core';
import { XIcon } from 'lucide-vue-next';
import { useToypadStore } from '@/stores/toypad';
import type { Character } from '@/types/Character';
import type { ToypadPad } from '@/types/Toypad';

const $props = defineProps<{
  pad: ToypadPad;
  rounded?: boolean;
}>();

const toypadStore = useToypadStore();

const active = ref<Character>();

const { elementRef: dropzoneRef, isOvered } = useDroppable({
  events: {
    onDrop: (store, payload) => {
      const data = payload.items[0]?.data;
      if (!data) return;

      if (data.character) {
        active.value = data.character;
        toypadStore.updateToypadMinifig($props.pad.uid, data.character);
      }

      if (data.vehicle) {
        active.value = data.vehicle;
        toypadStore.updateToypadVehicle($props.pad.uid, data.vehicle);
      }
    },
  },
});

function handlePadClear() {
  active.value = undefined;
  toypadStore.clearPad($props.pad.uid);
}
</script>
