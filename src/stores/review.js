import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';
import apiClient from './apiClient';

export const useReviewStore = defineStore('review', () => {
  const state = reactive({
    reviews: [],
  });

  const getReviews = async function (videoId) {
    const response = await apiClient.post(`/reviews/${videoId}`, {
      orderBy: "reg_date",
      orderDir: "asc"
    });
    state.reviews = response.data;
  };

  const addReview = async function (review) {
    await apiClient.post(`/reviews`, review);
    await getReviews(review.exerciseVideoId);
  };

  const like = async function (data, videoId) {
    await apiClient.put(`/reviews/like`, data);
    await getReviews(videoId);
  };

  const block = async function (data, videoId) {
    await apiClient.put(`/reviews/block`, data);
    await getReviews(videoId);
  };

  return { state, getReviews, addReview, like, block };
});
