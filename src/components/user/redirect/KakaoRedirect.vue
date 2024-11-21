<template>
    <div>카카오 로그인 처리 중...</div>
  </template>
  
  <script setup>
  import { useUserStore } from '@/stores/user';
  import { useRoute } from 'vue-router';
  import { onMounted } from 'vue';

  
  const store = useUserStore();
  const route = useRoute();
  
  onMounted(() => {
    // URL에서 code 추출
    const code = route.query.code;
  
    if (code) {
      // user.js의 getKakaoToken 호출
      store.getKakaoToken(code);
    } else {
      console.error('카카오 로그인 코드가 없습니다.');
      // 필요한 경우, 에러 페이지로 리다이렉트
    }
  });
  </script>
  
  <style scoped></style>
  