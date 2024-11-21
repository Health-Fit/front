import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useUserStore } from './user'; // Import the user store

export const useReviewStore = defineStore('review', () => {
  const reviews = ref([
    {
      videoId: 1,
      userId: 1,
      text: '좋은 내용이네요 많은 도움이 돼요.',
      rating: 5,
    },
    {
      videoId: 1,
      userId: 2,
      text: '좋지만 아쉬운 영상이네요.',
      rating: 4,
    },
  ]);

  const userStore = useUserStore(); // Access the user store

  // Get reviews for a specific video ID
  const getReviews = (videoId) => {
    return reviews.value.filter(review => review.videoId === videoId).map(review => {
      // For each review, get user info based on userId
      const user = userStore.getUserById(review.userId);
      return { ...review, user }; // Add user info to the review
    });
  };

  // Add a review (include userId)
  const addReview = (videoId, review) => {
    reviews.value.push({ ...review, videoId });
  };

  return { reviews, getReviews, addReview };
});
