<template>
  <div class="px-4 mb-4">
    <!-- Round slot -->
    <div class="flex items-center -mb-12 w-35 mx-auto">
      <portal-character :padIndex="0" rounded />
    </div>

    <div class="flex justify-between gap-6">
      <!-- Left side slots -->
      <div class="grid grid-cols-2 gap-2 w-full">
        <portal-character :padIndex="1" />
        <div />
        <portal-character :padIndex="2" />
        <portal-character :padIndex="3" />
      </div>

      <!-- Right side slots -->
      <div class="grid grid-cols-2 gap-2 w-full">
        <div />
        <portal-character :padIndex="4" />
        <portal-character :padIndex="5" />
        <portal-character :padIndex="6" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PortalCharacter from '@/components/PortalCharacter.vue';
</script>
