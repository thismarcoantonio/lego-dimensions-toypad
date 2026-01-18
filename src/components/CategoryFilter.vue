<template>
  <div class="px-4">
    <div class="bg-gray-600 rounded-md flex overflow-hidden mb-3">
      <category-filter-button
        v-for="filterType in FilterTypes"
        :key="filterType"
        :active="filtersStore.type === filterType"
        @click="filtersStore.setType(filterType)"
      >
        {{ filterType }}
      </category-filter-button>
    </div>
  </div>
  <div class="overflow-hidden">
    <div class="flex gap-2 overflow-x-auto px-4">
      <button class="px-2 bg-gray-600 rounded-full text-cyan-400">All</button>
      <button class="px-2 bg-gray-600 rounded-full">Favourite</button>
      <button class="px-2 bg-gray-600 rounded-full">Recent</button>
      <button class="px-2 bg-gray-600 rounded-full">Worlds</button>
      <button class="px-2 bg-gray-600 rounded-full">Sets</button>
      <button class="px-2 bg-gray-600 rounded-full">Abilities</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useFiltersStore, FilterTypes } from '@/stores/filters';
import CategoryFilterButton from '@/components/CategoryFilterButton.vue';

const filtersStore = useFiltersStore();
</script>
