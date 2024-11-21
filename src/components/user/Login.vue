<template>
  <div class="login-container">
    <button @click="store.loginWithKakao">
      <img src="@/assets/kakao.jpg" alt="카카오 로그인">
    </button>
    <button @click="store.loginWithNaver">
      <img src="@/assets/naver.jpg" alt="네이버 로그인">
    </button>
    <button @click="store.loginWithGoogle">
      <img src="@/assets/google.jpg" alt="구글 로그인">
    </button>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';

const store = useUserStore();
</script>

<style scoped></style>