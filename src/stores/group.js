import { ref } from 'vue';
import { defineStore } from 'pinia';
import apiClient from './apiClient';

export const useGroupStore = defineStore('group', () => {
  const groups = ref([]);

  const getGroups = async function (searchCondition) {
    const response = await apiClient.get(`/groups`, {
      cateogryId: searchCondition.cateogryId,
      time: searchCondition.time,
      left: searchCondition.left,
      right: searchCondition.right,
      bottom: searchCondition.bottom,
      top: searchCondition.top,
    });
    groups.value = response.data;
  };

  const group = ref({});

  const selectGroup = function (selected) {
    group.value = selected;
  };

  return { groups, getGroups, group, selectGroup };
});
