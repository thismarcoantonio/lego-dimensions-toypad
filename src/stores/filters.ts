import { defineStore } from 'pinia';
import { ref } from 'vue';

export enum FilterTypes {
  CHARACTERS = 'Characters',
  VEHICLES = 'Vehicles',
}

export const useFiltersStore = defineStore('filters', () => {
  const type = ref(FilterTypes.CHARACTERS);

  function setType(value: FilterTypes) {
    type.value = value;
  }

  return {
    type,
    setType,
  };
});
