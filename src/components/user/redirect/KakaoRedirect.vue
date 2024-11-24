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
    // URL에서 카카오 서버에서 받은 인가코드 추출
    const code = route.query.code;
    store.getKakaoToken(code);
  });
  </script>
  
  <style scoped></style>
  