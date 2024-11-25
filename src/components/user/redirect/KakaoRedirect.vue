<template>
  <div class="kakao-login-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">카카오 로그인 처리 중...</p>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

const store = useUserStore();
const route = useRoute();

onMounted(() => {
  // URL에서 카카오 서버에서 받은 인가코드 추출
  const code = route.query.code;
  store.getKakaoToken(code);
});
</script>

<style scoped>
.kakao-login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* 화면 전체 높이 사용 */
  background-color: #FEE500; /* 카카오 로그인 색상에 맞춰 배경 설정 */
  color: #3c1e1e; /* 텍스트 색상은 카카오 로고와 어울리게 설정 */
  font-family: Arial, sans-serif;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 6px solid #f3f3f3; /* 회색 배경 */
  border-top: 6px solid #3c1e1e; /* 어두운 회색으로 상단 변경 */
  border-radius: 50%;
  animation: spin 1s linear infinite; /* 회전 애니메이션 */
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
      transform: rotate(0deg);
  }
  100% {
      transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}
</style>
