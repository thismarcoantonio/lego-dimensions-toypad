import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export enum FilterTypes {
  CHARACTERS = 'Characters',
  VEHICLES = 'Vehicles',
}

export const useFiltersStore = defineStore('filters', () => {
  const type = useLocalStorage('filter-types', FilterTypes.CHARACTERS);

  function setType(value: FilterTypes) {
    type.value = value;
  }

  return {
    type,
    setType,
  };
});
