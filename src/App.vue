<template>
  <div>
    <HeaderNav />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import HeaderNav from './components/common/HeaderNav.vue';

</script>

<style scoped></style>