<template>
  <div class="home-container">
    <h2>운동 메이트 찾기</h2>
    <RouterLink :to="{name:'groupadd'}">그룹 추가하기</RouterLink>

    <div class="filter-options">
      <div class="filter-group">
        <label for="category">카테고리:</label>
        <select v-model="selectedCategory">
          <option value='all'>모든 카테고리</option>
          <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>

    <ExerciseMap>맵</ExerciseMap>
    <GroupDetail></GroupDetail>
    <ExerciseVideoList />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useVideoStore } from '@/stores/video';
import { useCategoryStore } from '@/stores/category';
import ExerciseMap from '@/components/map/ExerciseMap.vue';
import GroupDetail from '@/components/map/GroupDetail.vue';
import ExerciseVideoList from '@/components/videos/ExerciseVideoList.vue';

const videoStore = useVideoStore();
const categoryStore = useCategoryStore();

const selectedCategory = ref('all'); // 선택된 카테고리 상태 관리

const applyFilters = (categoryId) => {
  categoryStore.changeCategory(categoryId); // 카테고리 변경
  videoStore.getVideos(categoryId);         // 비디오 목록 갱신
};

// 선택된 카테고리 값 변경을 감지
watch(selectedCategory, (newCategoryId) => {
  applyFilters(newCategoryId);
});

onMounted(() => {
  categoryStore.getCategories(); // 카테고리 데이터 로드
});
</script>


<style scoped>
.home-container {
  padding: 20px;
}

h2 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.filter-options {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-options label {
  font-size: 16px;
  color: #444;
}

.filter-options select {
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.filter-options select:hover {
  background-color: #f1f1f1;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.video-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.3s ease;
  height: 380px;
}

.video-card:hover {
  transform: scale(1.05);
}

.card-wrapper {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-wrapper:hover {
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.video-thumbnail {
  width: 100%;
  height: auto;
  border-bottom: 1px solid #ddd;
}

.video-info {
  display: flex;
  padding: 10px 15px;
  flex: 1;
  justify-content: space-between;
}

.channel-thumbnail {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 10px;
}

.video-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
}

.video-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.3;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.video-channel {
  font-size: 14px;
  color: #555;
}

.video-stats {
  font-size: 13px;
  color: #888;
}
</style>
