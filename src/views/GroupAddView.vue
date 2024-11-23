<template>
  <div class="home-container">
    <h2>운동 메이트 찾기</h2>
    <ExerciseMapAdd />  <!-- 맵 컴포넌트 -->
    <GroupDetailAdd />  <!-- 그룹 상세 컴포넌트 -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ExerciseMapAdd from '@/components/map/ExerciseMapAdd.vue';
import GroupDetailAdd from '@/components/map/GroupDetailAdd.vue';
import { useGroupStore } from '@/stores/group';

// groupStore 가져오기
const groupStore = useGroupStore();

// 컴포넌트가 마운트될 때 groupForAdd 초기화
onMounted(() => {
  // 그룹 데이터를 초기화합니다.
  groupStore.groupForAdd.name = ''; // 그룹 이름
  groupStore.groupForAdd.lat = 0; // 초기 위도
  groupStore.groupForAdd.lon = 0; // 초기 경도
  groupStore.groupForAdd.exerciseCategoryId = 1; // 기본 운동 카테고리 (예: 1번 카테고리)
  groupStore.groupForAdd.startDate = new Date().toISOString().slice(0, 16); // 기본 시작 시간
  groupStore.groupForAdd.endDate = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16); // 1시간 후 종료 시간
  groupStore.groupForAdd.maxMember = 10; // 최대 인원수
  groupStore.groupForAdd.descript = ''; // 기본 설명
});
</script>

<style scoped>
.home-container {
  padding: 20px;
}
</style>
