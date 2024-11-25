<template>
  <div class="home-container">
    <h2 class="title">운동 메이트 찾기</h2>
    <ExerciseMapAdd class="map-component" />
    <!-- 맵 컨포넌트 -->
    <GroupDetailAdd class="group-detail-component" />
    <!-- 그룹 상세 컨포넌트 -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ExerciseMapAdd from '@/components/map/ExerciseMapAdd.vue';
import GroupDetailAdd from '@/components/map/GroupDetailAdd.vue';
import { useGroupStore } from '@/stores/group';
import { useCategoryStore } from '@/stores/category';

const groupStore = useGroupStore();
const categoryStore = useCategoryStore();

// 컨포넌트가 마우트되어야할 때 groupForAdd 초기화
onMounted(() => {
  categoryStore.getCategories(); // 카테고리 데이터 로드
  // 그룹 데이터를 초기화합니다.
  groupStore.groupForAdd.name = ''; // 그룹 이름
  groupStore.groupForAdd.lat = 0; // 초기 위도
  groupStore.groupForAdd.lon = 0; // 초기 경도
  groupStore.groupForAdd.exerciseCategoryId = 1; // 기본 운동 카테고리 (예: 1번 카테고리)
  groupStore.groupForAdd.startDate = new Date().toISOString().slice(0, 16); // 기본 시작 시간
  groupStore.groupForAdd.endDate = new Date(
    new Date().getTime() + 60 * 60 * 1000
  )
    .toISOString()
    .slice(0, 16); // 1시간 후 종료 시간
  groupStore.groupForAdd.maxMember = 10; // 최대 인원수
  groupStore.groupForAdd.descript = ''; // 기본 설명
});
</script>

<style scoped>
.home-container {
  padding: 30px;
  background-color: #f0f4f8;
  border-radius: 12px;
  max-width: 900px;
  margin: 40px auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.title {
  font-size: 2rem;
  color: #0056b3;
  margin-bottom: 20px;
  font-weight: bold;
}

.map-component {
  margin-bottom: 20px;
}

.group-detail-component {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

button {
  padding: 10px 20px;
  margin-top: 20px;
  border-radius: 8px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}
</style>
