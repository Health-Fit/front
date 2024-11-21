<template>
  <div class="header-nav">
    <RouterLink class="logo" :to="{ name: 'home' }">Health GO!</RouterLink>
    <div class="auth-links">
      <RouterLink v-if="!store.isLoggedIn" :to="{ name: 'login' }">로그인/회원가입</RouterLink>
      <RouterLink v-if="store.isLoggedIn" :to="{ name: 'profile' }">{{ store.member.nickname}}님!</RouterLink>
      <button v-if="store.isLoggedIn" @click="store.logout" class="logout-button">로그아웃</button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';

const store = useUserStore();
</script>

<style scoped>
.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #87CEEB;
  /* Sky blue */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.auth-links a,
.logout-button {
  margin-left: 15px;
  font-size: 18px;
  color: white;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
}

.auth-links a:hover,
.logout-button:hover {
  text-decoration: underline;
}

.logout-button {
  font-size: 18px;
  color: white;
}
</style>