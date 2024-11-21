<template>
    <div class="review-section">
      <h3>리뷰</h3>
  
      <!-- New Review Form -->
      <div class="review-form">
        <textarea
          v-model="newReview.text"
          placeholder="리뷰를 작성해주세요"
          rows="4"
          class="review-input"
        ></textarea>
  
        <!-- Star Rating -->
        <div class="star-rating">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ active: star <= newReview.rating }"
            @click="setRating(star)"
          >
            ★
          </span>
        </div>
  
        <button @click="submitReview" class="submit-button">리뷰 작성</button>
      </div>
  
      <!-- Display Reviews -->
      <div v-if="reviews.length" class="reviews-list">
        <div v-for="(review, index) in reviews" :key="index" class="review-item">
          <div class="review-user">
            <img :src="review.user.thumbnail" alt="User Thumbnail" class="user-thumbnail" />
            <span class="username">{{ review.user.username }}</span>
          </div>
          <p> {{ review.text }}</p>
          <div class="review-rating">
            <span
              v-for="star in 5"
              :key="star"
              class="star"
              :class="{ active: star <= review.rating }"
            >
              ★
            </span>
            <span class="rating-text">{{ review.rating }} Stars</span>
          </div>
        </div>
      </div>
      <div v-else>
        <p>리뷰가 없습니다.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  import { useReviewStore } from '@/stores/review'; // Import the review Pinia store
  
  const props = defineProps({
    videoId: {
      type: Number,
      required: true,
    },
  });
  
  const reviewStore = useReviewStore(); // Use the Pinia store
  
  // Initialize the new review object
  const newReview = ref({ text: '', rating: 0 });
  
  // Get reviews from the Pinia store for the current videoId
  const reviews = computed(() => reviewStore.getReviews(props.videoId));
  
  // Watch for changes in videoId and update reviews
  watch(() => props.videoId, (newVideoId) => {
    reviews.value = reviewStore.getReviews(newVideoId);
  });
  
  // Set the rating based on the star clicked
  const setRating = (star) => {
    newReview.value.rating = star;
  };
  
  // Submit the review and add it to the Pinia store
  const submitReview = () => {
    if (newReview.value.text.trim() !== '') {
      reviewStore.addReview(props.videoId, { ...newReview.value, userId: 1 }); // Add review with userId
      newReview.value = { text: '', rating: 0 }; // Reset the input fields
    }
  };
  </script>
  
  <style scoped>
  /* Your existing styles */
  .review-section {
    margin-top: 30px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .review-form {
    margin-bottom: 20px;
  }
  
  .review-input {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    font-size: 16px;
    resize: none;
  }
  
  .star-rating {
    margin-bottom: 10px;
  }
  
  .star {
    font-size: 24px;
    color: #ccc;
    cursor: pointer;
  }
  
  .star.active {
    color: #ff9800;
  }
  
  .submit-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .submit-button:hover {
    background-color: #45a049;
  }
  
  .reviews-list {
    margin-top: 20px;
  }
  
  .review-item {
    margin-bottom: 10px;
    font-size: 16px;
    color: #555;
  }
  
  .review-user {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  
  .user-thumbnail {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .username {
    font-weight: bold;
    color: #333;
  }
  
  .review-rating {
    display: flex;
    align-items: center;
    margin-top: 5px;
  }
  
  .rating-text {
    margin-left: 10px;
    font-size: 14px;
    color: #555;
  }
  </style>
  