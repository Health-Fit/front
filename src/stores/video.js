import { ref } from 'vue';
import { defineStore } from 'pinia';
import apiClient from './apiClient';

export const useVideoStore = defineStore('video', () => {
  
  const videos = ref([]);

  const getVideos = async function(categoryId, searchValue) {
    try {
        const response = await apiClient.post('/videos', {
            categoryId: categoryId,
            searchValue: searchValue
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching videos:', error);
        throw error; 
    }
};

  const getVideoById = (videoId) => {
    return videos.value.find(video => video.id === videoId);
  };

  return { videos, getVideos, getVideoById };
});
