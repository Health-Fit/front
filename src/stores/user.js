import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const users = ref([
    {
      id: 1,
      username: '김싸피',
      thumbnail: 'https://via.placeholder.com/50',
    },
    {
      id: 2,
      username: '김싸피1',
      thumbnail: 'https://via.placeholder.com/50',
    },
    {
      id: 3,
      username: '김싸피2',
      thumbnail: 'https://via.placeholder.com/50',
    },
  ]);

  
  const getUserById = (userId) => {
    return users.value.find(user => user.id === userId);
  };

  return { users, getUserById };
});
