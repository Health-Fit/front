import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';
import apiClient from './apiClient';

export const useSearchStore = defineStore('search', () => {
  const searchCondition = reactive({});

  const setSearchCondition = function (address, category) {
    searchCondition.value = {
      address,
      category,
    };
  };

  return { searchCondition, setSearchCondition };
});
