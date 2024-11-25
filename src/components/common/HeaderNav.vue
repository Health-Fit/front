<template>
  <div class="header-nav">
    <!-- 로고 이미지 추가 -->
    <RouterLink class="logo" :to="{ name: 'home' }">
      <img src="@/assets/logo.png" alt="렛츠 고! 헬스 고!" class="logo-img" />
    </RouterLink>
    
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
        <RouterLink :to="{ name: 'profileUpdate' }"
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
  align-items: center;
  justify-content: space-between;
  background-color: #FFC300;
  padding: 10px 20px;
  border-radius: 8px; /* 모서리를 둥글게 만듭니다 */
}

.logo-img {
  height: 40px;
  border-radius: 8px; /* 로고 이미지의 모서리 둥글게 */
  border: 2px solid #001D3D; /* 로고 이미지에 테두리 추가 */
}

.search-input {
  padding: 5px 10px;
  border: 2px solid #001D3D;
  border-radius: 8px; /* 검색 입력창의 모서리를 둥글게 */
  margin-right: 10px;
}

.search-button {
  background-color: #001D3D;
  color: #F0C800;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 8px; /* 검색 버튼의 모서리를 둥글게 */
}

.logout-button {
  background-color: transparent;
  color: #001D3D;
  border: 2px solid #001D3D;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 8px; /* 로그아웃 버튼의 모서리를 둥글게 */
}

.user-thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 50%; /* 사용자 썸네일을 둥글게 (원 형태) */
  margin-right: 10px;
}

.auth-links {
  display: flex;
  align-items: center;
  gap: 15px; /* 요소 간 간격을 15px로 설정 */
}

.auth-links .user-thumbnail {
  margin-right: 10px; /* 썸네일과 닉네임 사이의 간격 */
}

.auth-links a {
  margin-right: 15px; /* 닉네임과 로그아웃 버튼 사이의 간격 */
  color: #001D3D; /* 텍스트 색상을 #001D3D로 변경 */
  text-decoration: none;
}
</style>
