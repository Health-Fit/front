<template>
  <div class="header-nav">
    <RouterLink class="logo" :to="{ name: 'home' }">SSAFIT</RouterLink>
    <form class="search-form">
      <input type="text" placeholder="영상 검색" class="search-input">
      <button class="search-button">검색</button>
    </form>
    <div class="auth-links">
      <RouterLink v-if="!isLoggedIn" :to="{ name: 'login' }">로그인</RouterLink>
      <RouterLink v-if="!isLoggedIn" :to="{ name: 'signup' }">회원가입</RouterLink>
      <button v-if="isLoggedIn" @click="logout" class="logout-button">로그아웃</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isLoggedIn = ref(true);

const logout = () => {
  isLoggedIn.value = false;
};
</script>

<style scoped>
.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #87CEEB; /* Sky blue */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.search-form {
  display: flex;
  align-items: center;
}

.search-input {
  width: 250px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
  font-size: 16px;
}

.search-input:focus {
  border-color: #4682B4; /* Steel blue */
  box-shadow: 0 0 5px rgba(70, 130, 180, 0.5);
}

.search-button {
  margin-left: 10px;
  padding: 8px 16px;
  background-color: #4682B4; /* Steel blue */
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #5A9BD3;
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
