<template>
  <div>
    <h1>그룹 정보 입력</h1>
    <form @submit.prevent="createGroup">
      <label for="group-category">카테고리 :</label>
      <select v-model="groupForAdd.exerciseCategoryId">
        <option
          v-for="category in categoryStore.categories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>
      <br />

      <label for="group-name">그룹 명 :</label>
      <input
        type="text"
        v-model="groupForAdd.name"
        id="group-name"
        name="group-name"
      />
      <br />

      <label for="group-maxMember">최대 인원 수 :</label>
      <input
        type="number"
        v-model="groupForAdd.maxMember"
        id="group-maxMember"
        name="group-maxMember"
      />
      <br />

      <label for="group-descript">그룹 설명 :</label>
      <textarea
        v-model="groupForAdd.descript"
        id="group-descript"
        name="group-descript"
      ></textarea>
      <br />

      <!-- 시작 시각 선택 -->
      <label for="group-start-time">시작 시각 :</label>
      <input
        type="datetime-local"
        v-model="groupForAdd.startDate"
        id="group-start-time"
      />
      <br />

      <!-- 종료 시각 선택 -->
      <label for="group-end-time">종료 시각 :</label>
      <input
        type="datetime-local"
        v-model="groupForAdd.endDate"
        id="group-end-time"
      />
      <br />

      <p v-if="formattedDuration">총 {{ formattedDuration }}</p>

      <button type="submit">생성하기</button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useGroupStore } from '@/stores/group';
import { useCategoryStore } from '@/stores/category';

const groupStore = useGroupStore();
const categoryStore = useCategoryStore();

const groupForAdd = groupStore.groupForAdd; // Use store's reactive state directly
const formattedDuration = ref(''); // For formatted duration like days, hours, minutes

// 시간 차이를 계산하는 함수
const calculateTimeDifference = () => {
  if (!groupForAdd.startDate || !groupForAdd.endDate) {
    formattedDuration.value = '';
    return;
  }

  const start = new Date(groupForAdd.startDate);
  const end = new Date(groupForAdd.endDate);

  if (start > end) {
    groupForAdd.endDate = groupForAdd.startDate; // Reset to start time
    formattedDuration.value = '';
    return;
  }

  const diffInMs = end - start; // Milliseconds difference
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // Convert to minutes

  // Convert to days, hours, and minutes
  const days = Math.floor(diffInMinutes / (24 * 60));
  const hours = Math.floor((diffInMinutes % (24 * 60)) / 60);
  const minutes = diffInMinutes % 60;

  let duration = '';
  if (days > 0) duration += `${days}일 `;
  if (hours > 0) duration += `${hours}시간 `;
  if (minutes > 0) duration += `${minutes}분`;

  formattedDuration.value = duration.trim(); // Final formatted string
};

// `watch`에서 반응형 상태 추적
watch(
  () => [groupForAdd.startDate, groupForAdd.endDate], // 추적할 데이터 지정
  calculateTimeDifference // 변경 시 호출할 함수
);

// 그룹 생성 함수
const createGroup = async () => {
  if (!groupForAdd.name || !groupForAdd.startDate) {
    alert('그룹 이름과 시작 시각을 입력해주세요.');
    return;
  }

  try {
    // 그룹 생성
    await groupStore.addGroup();
  } catch (error) {
    console.error(error);
    alert('그룹 생성에 실패했습니다.');
  }
};

onMounted(() => {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // 1시간 뒤로 기본 설정
  // 화면 새로 로드될 경우 해당 화면 초기화
  groupStore.clearGroupForAdd();
  groupForAdd.startDate = now.toISOString().slice(0, 16); // 시작일을 ISO 형식으로 지정
  groupForAdd.endDate = oneHourLater.toISOString().slice(0, 16); // 종료일을 1시간 뒤로 지정
});
</script>

<style scoped>
/* 스타일은 필요에 따라 추가하세요 */
</style>
