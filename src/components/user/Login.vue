<template>
  <div class="login-container">
    <img src="@/assets/welcome.png" alt="회원가입 배너" class="welcome-banner" />
    <div class="login-buttons">
      <button @click="store.loginWithKakao" class="login-button">
        <img src="@/assets/kakao.jpg" alt="카카오 로그인" class="login-img" />
      </button>
      <button @click="store.loginWithNaver" class="login-button">
        <img src="@/assets/naver.jpg" alt="네이버 로그인" class="login-img" />
      </button>
      <button @click="store.loginWithGoogle" class="login-button">
        <img src="@/assets/google.jpg" alt="구글 로그인" class="login-img" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';

const store = useUserStore();
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: row; /* 요소들을 가로로 정렬 */
  align-items: center;
  justify-content: center;
  background-color: #001D3D; /* 배경색을 #001D3D로 수정 */
  height: 100vh; /* 화면 전체 높이 사용 */
  gap: 50px; /* 배너와 버튼들 간의 간격을 50px로 설정 */
}

.welcome-banner {
  width: 50%; /* 배너 이미지의 너비를 더 키움 */
  max-width: 500px; /* 배너 이미지의 최대 너비를 500px로 제한 */
  height: auto;
}

.login-buttons {
  display: flex;
  flex-direction: column; /* 로그인 버튼들을 세로로 정렬 */
  gap: 20px; /* 버튼 간 간격을 20px로 설정 */
}

.login-button {
  background: none;
  border: none;
  cursor: pointer;
}

.login-img {
  width: 300px; /* 버튼 이미지의 너비를 설정 */
  height: auto;
  display: block;
  margin: 0 auto; /* 이미지 가운데 정렬 */
}
</style>
