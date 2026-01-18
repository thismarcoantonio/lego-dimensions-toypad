<template>
  <div class="flex items-center p-4 gap-2">
    <h1 class="font-semibold">Roll limitless - LEGO DIMENSIONS</h1>
    <button class="bg-cyan-400 py-0.5 rounded-full">
      <bluetooth-icon :size="16" class="text-slate-950" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { BluetoothIcon } from 'lucide-vue-next';
</script>
