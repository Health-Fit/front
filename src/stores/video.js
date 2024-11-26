import { ref } from 'vue';
import { defineStore } from 'pinia';
import apiClient from './apiClient';

export const useVideoStore = defineStore('video', () => {

  const videos = ref([]);

  const getVideos = async function (categoryId) {
    if (categoryId === 'all') {
      categoryId = 0
    }
    const response = await apiClient.post('/videos', {
      categoryId: categoryId,
      searchValue: null
    });
    videos.value = response.data;
  };

  const video = ref({})

  const getVideoById = async function (id) {
    const response = await apiClient.get(`/videos/${id}`);
    video.value = response.data;
  };

  const exampleVideos = ref([]);

  const getExampleVideos = async function () {
    const response = await apiClient.get('/videos/ex');
    exampleVideos.value = response.data;
  };

  const getThumbnailUrl = function (videoUrl) {
    return `https://img.youtube.com/vi/${videoUrl}/maxresdefault.jpg`;
  }

  const getPlayer = function (videoUrl) {
    return `https://www.youtube.com/embed/${videoUrl}`;
  }

  const like = async function () {
    const response = await apiClient.put('/videos/like', {
      "videoId": video.value.id,
      "like": !video.value.liked
    });
    video.value.liked = !video.value.liked;
  };

  const likedVideos = ref([])

  const getLikedVideos = async function () {
    const response = await apiClient.get('/videos/like');
    likedVideos.value = response.data;
  };

  return { videos, getVideos, video, getVideoById, getThumbnailUrl, getPlayer, exampleVideos, getExampleVideos, like, getLikedVideos, likedVideos };
});
