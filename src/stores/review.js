import { ref } from 'vue';
import { defineStore } from 'pinia';
import apiClient from './apiClient';


export const useReviewStore = defineStore('review', () => {
  const reviews = ref([]);

  const getReviews = async function (videoId) {
    const response = await apiClient.post(`/videos/reviews/${videoId}`, {
      orderBy: "reg_date",
      orderDir: "asc"
    });
    reviews.value = response.data;
  };

  // Add a review (include userId)
  const addReview = (videoId, review) => {
    reviews.value.push({ ...review, videoId });
  };

  return { reviews, getReviews, addReview };
});
