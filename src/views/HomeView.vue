<template>
  <div class="home-container">
    <div class="top-section">
      <div class="filter-options">
        <div class="filter-group">
          <label for="category"></label>
          <select v-model="selectedCategory" class="category-select">
            <option value="all">모든 운동</option>
            <option
              v-for="category in categoryStore.categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
          <span class="filter-description">같이 할 친구 지도에서 찾기!</span>
        </div>
      </div>
      <RouterLink :to="{ name: 'groupadd' }" class="group-add-button">그룹 만들기</RouterLink>
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
  videoStore.getVideos(categoryId); // 비디오 목록 갱신
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
  background-color: #001D3D; /* 배경 색상을 #001D3D로 설정 */
  color: #FFFFFF; /* 텍스트 색상을 흰색으로 설정하여 가독성 유지 */
  padding: 20px;
  border-radius: 8px;
}

.top-section {
  display: flex;
  justify-content: space-between; /* 버튼과 필터 옵션이 양쪽 끝에 위치하도록 설정 */
  align-items: center; /* 요소들이 수직 중앙에 정렬되도록 설정 */
  margin-bottom: 20px; /* 상단 섹션과 나머지 내용의 간격을 설정 */
}

.filter-options {
  margin-bottom: 0; /* 상단에서 이미 여백을 설정했으므로 필터 옵션에 추가적인 여백을 제거 */
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px; /* 내부 요소들 간의 간격을 10px로 설정 */
}

label {
  margin-right: 10px;
  color: #FFFFFF; /* 레이블 텍스트를 흰색으로 설정 */
}

.category-select {
  padding: 10px;
  border: 2px solid #FFC300; /* 테두리 색상을 노란색으로 설정 */
  border-radius: 8px;
  background-color: #FFFFFF; /* 드롭다운 배경색을 흰색으로 설정 */
  color: #001D3D; /* 텍스트 색상을 네이비로 설정 */
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

.category-select:hover {
  background-color: #F0E68C; /* 마우스를 올렸을 때 배경 색상을 밝은 노란색으로 변경 */
  border-color: rgb(255, 255, 255); /* 테두리 색상을 흰색으로 변경 */
}

.filter-description {
  color: #FFFFFF; /* span 텍스트를 흰색으로 설정 */
}

.group-add-button {
  background-color: #FFC300; /* 버튼 배경을 노란색으로 설정 */
  color: #001D3D; /* 텍스트 색상은 네이비로 설정 */
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.2s;
}

.group-add-button:hover {
  background-color: #FFFFFF; /* 마우스를 올렸을 때 버튼 배경 색상을 더 밝은 색으로 변경 */
  transform: translateY(-3px); /* 마우스를 올렸을 때 약간 위로 움직임 */
}

.group-add-button:active {
  transform: translateY(0); /* 클릭 시 원래 위치로 돌아옴 */
}

.RouterLink:hover {
  text-decoration: underline;
}
</style>
