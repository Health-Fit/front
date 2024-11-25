<template>
  <div class="app-container">
    <HeaderNav />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import HeaderNav from './components/common/HeaderNav.vue';
</script>

<style scoped>
.app-container {
  background-color: #0000; /* 배경 색상을 #001D3D로 설정 */
  min-height: 100vh; /* 화면 전체 높이를 사용하여 배경색이 적용되도록 설정 */
}
</style>
