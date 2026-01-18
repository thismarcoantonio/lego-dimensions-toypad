<template>
  <div class="px-4 mb-4">
    <!-- Round slot -->
    <div class="flex items-center -mb-12 w-35 mx-auto">
      <portal-character :pad="toypadStore.pads[0]!" rounded />
    </div>

    <div class="flex justify-between gap-6">
      <!-- Left side slots -->
      <div class="grid grid-cols-2 gap-2 w-full">
        <portal-character :pad="toypadStore.pads[1]!" />
        <div />
        <portal-character :pad="toypadStore.pads[2]!" />
        <portal-character :pad="toypadStore.pads[3]!" />
      </div>

      <!-- Right side slots -->
      <div class="grid grid-cols-2 gap-2 w-full">
        <div />
        <portal-character :pad="toypadStore.pads[4]!" />
        <portal-character :pad="toypadStore.pads[5]!" />
        <portal-character :pad="toypadStore.pads[6]!" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useToypadStore } from '@/stores/toypad';
import PortalCharacter from '@/components/PortalCharacter.vue';

const toypadStore = useToypadStore();
</script>
