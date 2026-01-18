<template>
  <div v-if="bluetoothStore.device" class="flex flex-col overflow-hidden max-h-screen">
    <div class="shrink-0">
      <main-header />
      <portal />
      <category-filter />
    </div>
    <character-list />
  </div>
  <div v-else class="flex justify-center items-center h-dvh flex-col -mt-10">
    <span class="text-2xl font-semibold">LEGO DIMENSIONS</span>
    <span class="text-lg mb-8">Digital Toypad</span>
    <button
      class="rounded-full bg-slate-900 w-60 aspect-square relative"
      @click="bluetoothStore.connect"
    >
      <div>Connect to Bluetooth Device</div>
      <div
        class="rounded-full w-full h-full absolute top-0 left-0 -z-10 shadow-glow shadow-cyan-400 animate-pulse"
      />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useBluetoothStore } from '@/stores/bluetooth';
import MainHeader from '@/components/MainHeader.vue';
import Portal from '@/components/Portal.vue';
import CharacterList from '@/components/MainList.vue';
import CategoryFilter from '@/components/CategoryFilter.vue';

const bluetoothStore = useBluetoothStore();
</script>

<style>
@import 'tailwindcss';

body {
  @apply bg-slate-950 text-white;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.shadow-glow {
  box-shadow: 0 0 10px 2px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
}
</style>
