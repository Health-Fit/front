<template>
  <div class="header-nav">
    <RouterLink class="logo" :to="{ name: 'home' }"
      >렛츠 고! 헬스 고!</RouterLink
    >
    <!--검색 창과 버튼-->
    <div class="search-box">
      <form @submit.prevent="searchAddress">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="주소를 입력하세요"
          class="search-input"
        />
        <button class="search-button">검색</button>
      </form>
    </div>

    <div class="auth-links">
      <RouterLink v-if="!store.isLoggedIn" :to="{ name: 'login' }"
        >로그인/회원가입</RouterLink
      >

      <template v-if="store.isLoggedIn">
        <img :src="store.member.profileImg" class="user-thumbnail">
      <RouterLink :to="{ name: 'profile' }"
        >{{ store.member.nickname }}님!</RouterLink
      >
      </template>
      
      <button
        v-if="store.isLoggedIn"
        @click="store.logout"
        class="logout-button"
      >
        로그아웃
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useSearchStore } from '@/stores/search';

const store = useUserStore();
const searchStore = useSearchStore();

// 검색어 연관
const searchQuery = ref('');
const searchCategory = ref(-1);
// 주소 검색 진행
const searchAddress = function () {
  searchStore.setSearchCondition(searchQuery.value, searchCategory.value);
  searchQuery.value = '';
  searchCategory.value = -1;
};
</script>

<style scoped>
.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #87ceeb;
  /* Sky blue */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.search-box {
  display: flex;
  align-items: center;
}

.search-input {
  padding: 5px 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}

.search-button {
  margin-left: 10px;
  padding: 5px 15px;
  font-size: 16px;
  color: white;
  background-color: #4682b4;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #5a9bd5;
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

.user-thumbnail {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>
