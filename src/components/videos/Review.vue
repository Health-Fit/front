<template>
  <div class="review-section">
    <h3>리뷰</h3>

    <!-- 리뷰 작성 폼 -->
    <div class="review-form">
      <textarea v-model="newReview.content" placeholder="리뷰를 작성해주세요" rows="4" class="review-input"></textarea>

      <!-- 별점 -->
      <div class="star-rating">
        <span v-for="star in 5" :key="star" class="star" :class="{ active: star <= newReview.rating }"
          @click="setRating(star)">
          ★
        </span>
      </div>

      <button @click="submitReview" class="submit-button">리뷰 작성</button>
    </div>

    <!-- 리뷰 목록 -->
    <div v-if="reviews.length" class="reviews-list">
      <div v-for="review in reviews" :key="review.id" class="review-item">
        <div class="review-user">
          <img :src="review.profileImg" alt="User Thumbnail" class="user-thumbnail" />
          <span class="username">{{ review.nickname }}</span>
        </div>
        <p> {{ review.content }}</p>
        <div class="review-rating">
          <span v-for="star in 5" :key="star" class="star" :class="{ active: star <= review.rating }">
            ★
          </span>
          <span class="rating-text">{{ review.rating }}점</span>
        </div>

        <!-- 좋아요 / 싫어요 버튼 -->
        <div class="like-block">
          <button @click="toggleLike(review.id, liked)" :class="{ liked: review.liked }">
            👍 {{ review.likeCnt }}
          </button>
          <button @click="toggleBlock(review.id, blocked)" :class="{ blocked: review.blocked }">
            👎
          </button>
        </div>

        <!-- 작성일 / 수정일 표시 -->
        <div class="review-dates">
          <span>
            작성일: {{ formatDate(review.regDate) }}
          </span>
          <span v-if="review.updateDate">
            (수정됨: {{ formatDate(review.updateDate) }})
          </span>
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
import { useReviewStore } from '@/stores/review';

const reviewStore = useReviewStore();

const props = defineProps({
  videoId: {
    type: Number,
    required: true,
  },
});

const reviews = computed(() => reviewStore.state.reviews.filter(review => review.exerciseVideoId === props.videoId));
const newReview = ref({ content: '', rating: 0, exerciseVideoId: -1, regDate: 0 });

watch(() => props.videoId, (newVideoId) => {
  reviews.value = reviewStore.getReviews(newVideoId);
});

const setRating = (star) => {
  newReview.value.rating = star;
};

const submitReview = async () => {
  if (newReview.value.content.trim() !== '') {
    await reviewStore.addReview({
      content: newReview.value.content,
      rating: newReview.value.rating,
      exerciseVideoId: props.videoId,
      regDate: new Date().toISOString().slice(0, 19),
    });

    newReview.value = { content: '', rating: 0 };
  }
};

const formatDate = function (date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
}

const toggleLike = function (reviewId, status) {
  reviewStore.like(
    {
      id: reviewId,
      like: !status
    },
    props.videoId
  );
}

const toggleBlock = function (reviewId, status) {
  reviewStore.block(
    {
      id: reviewId,
      block: !status
    },
    props.videoId);
}

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

.like-block {
  margin-top: 10px;
}

.like-block button {
  padding: 5px 10px;
  margin-right: 5px;
  cursor: pointer;
}

.like-block .liked {
  color: #ff9800;
}

.like-block .blocked {
  color: #f44336;
}

.review-dates {
  margin-top: 5px;
  font-size: 14px;
  color: #777;
}
</style>
