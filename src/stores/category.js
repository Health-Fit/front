import { ref } from 'vue';
import { defineStore } from 'pinia';
import apiClient from './apiClient';

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([]);

  const getCategories = async function () {
    const response = await apiClient.get(`/categories`);
    categories.value = response.data;
  };

  // 주어진 id와 일치하는 카테고리의 name 반환
  const getCategoryString = function (id) {
    const category = categories.value.find((cat) => cat.id === id);
    return category ? category.name : null; // id와 일치하는 name 반환, 없으면 null 반환
  };
  return { categories, getCategories, getCategoryString };
});
