<template>
  <div v-if="bluetoothStore.device" class="flex flex-col overflow-hidden max-h-screen">
    <div class="shrink-0">
      <main-header />
      <portal />
      <category-filter />
    </div>
    <character-list />
  </div>
  <div v-else>
    <button @click="bluetoothStore.connect">Connect to Bluetooth Device</button>
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
</style>
