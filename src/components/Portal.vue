<template>
  <div class="px-4 mb-4">
    <!-- Round slot -->
    <div class="flex items-center -mb-12 w-35 mx-auto">
      <portal-character v-if="toypadStore.pads[0]" :pad="toypadStore.pads[0]" rounded />
    </div>

    <div class="flex justify-between gap-6">
      <!-- Left side slots -->
      <div class="grid grid-cols-2 gap-2 w-full">
        <portal-character v-if="toypadStore.pads[1]" :pad="toypadStore.pads[1]" />
        <div />
        <portal-character v-if="toypadStore.pads[2]" :pad="toypadStore.pads[2]" />
        <portal-character v-if="toypadStore.pads[3]" :pad="toypadStore.pads[3]" />
      </div>

      <!-- Right side slots -->
      <div class="grid grid-cols-2 gap-2 w-full">
        <div />
        <portal-character v-if="toypadStore.pads[4]" :pad="toypadStore.pads[4]" />
        <portal-character v-if="toypadStore.pads[5]" :pad="toypadStore.pads[5]" />
        <portal-character v-if="toypadStore.pads[6]" :pad="toypadStore.pads[6]" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useToypadStore } from '@/stores/toypad';
import PortalCharacter from '@/components/PortalCharacter.vue';

const toypadStore = useToypadStore();
</script>
