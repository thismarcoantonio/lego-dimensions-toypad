<template>
  <ul class="grid grid-cols-4 gap-3 mt-6 px-4 pb-4 overflow-auto pr-10">
    <template v-if="filtersStore.type === FilterTypes.CHARACTERS">
      <main-list-character v-for="minifig in minifigs" :key="minifig.id" :character="minifig" />
    </template>
    <template v-if="filtersStore.type === FilterTypes.VEHICLES">
      <main-list-vehicle v-for="vehicle in vehicles" :key="vehicle.id" :vehicle="vehicle" />
    </template>
  </ul>
</template>

<script lang="ts" setup>
import { useFiltersStore, FilterTypes } from '@/stores/filters';
import minifigs from '@/data/minifigs';
import vehicles from '@/data/vehicles';
import MainListCharacter from '@/components/MainListCharacter.vue';
import MainListVehicle from '@/components/MainListVehicle.vue';

const filtersStore = useFiltersStore();
</script>
