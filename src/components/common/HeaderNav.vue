<template>
  <div class="header-nav">
    <!-- 로고 이미지 추가 -->
    <RouterLink class="logo" :to="{ name: 'home' }">
      <img src="@/assets/logo.png" alt="sweat tohether!" class="logo-img" />
    </RouterLink>

    <!--검색 창과 버튼-->
    <div class="search-box">
      <form @submit.prevent="searchAddress">
        <input v-model="searchQuery" type="text" placeholder="주소를 입력하세요" class="search-input" />
        <button class="search-button">검색</button>
      </form>
    </div>

    <div class="auth-links">
      <RouterLink v-if="!store.isLoggedIn" :to="{ name: 'login' }" class="login-button">
        로그인/회원가입
      </RouterLink>
      <template v-if="store.isLoggedIn">
        <div class="user-dropdown" @click="toggleDropdown">
          <img :src="store.member.profileImg" class="user-thumbnail">
          <span>{{ store.member.nickname }}님!</span>
          <div v-if="isDropdownOpen" class="dropdown-menu">
            <RouterLink :to="{ name: 'mypage' }">마이페이지</RouterLink>
            <RouterLink :to="{ name: 'profileUpdate' }">회원 정보 수정</RouterLink>
          </div>
        </div>
      </template>

      <button v-if="store.isLoggedIn" @click="store.logout" class="logout-button">
        로그아웃
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useUserStore } from '@/stores/user';
import { useSearchStore } from '@/stores/search';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();

const store = useUserStore();
const searchStore = useSearchStore();

// 검색어 연관
const searchQuery = ref('');
const searchCategory = ref(-1);
// 주소 검색 진행
const searchAddress = async function () {
  if (route.path !== '/' && route.path !== '/groupadd') {
    await router.push('/');
  }
  searchStore.setSearchCondition(searchQuery.value, searchCategory.value);
  searchQuery.value = '';
  searchCategory.value = -1;
};

// 드롭다운 상태 관리
// 드롭다운 상태 관리
const isDropdownOpen = ref(false);
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// 드롭다운 외부 클릭 시 닫기 위한 핸들러
const handleClickOutside = (event) => {
  const dropdownElement = document.querySelector('.user-dropdown');
  if (dropdownElement && !dropdownElement.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.header-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #FFC300;
  padding: 10px 20px;
}

.logo-img {
  height: 40px;
  border-radius: 8px;
  border: 2px solid #001D3D;
}

.search-input {
  padding: 5px 10px;
  border: 2px solid #001D3D;
  border-radius: 8px;
  margin-right: 10px;
}

.search-button {
  background-color: #001D3D;
  color: #F0C800;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 8px;
}

.logout-button {
  background-color: transparent;
  color: #001D3D;
  border: 2px solid #001D3D;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 8px;
}

.user-thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.auth-links {
  display: flex;
  align-items: center;
  gap: 15px;
}

.auth-links a {
  color: #001D3D;
  text-decoration: none;
}

.auth-links .login-button {
  background-color: #001D3D;
  /* 버튼의 배경색을 어둡게 설정 */
  color: #FFC300;
  /* 글자 색상을 #FFC300으로 설정 */
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease, border 0.3s ease;
}

.auth-links .login-button:hover {
  background-color: #F0C800;
  /* 버튼에 마우스를 올렸을 때 배경색 변경 */
  color: #001D3D;
  /* 글자 색상 변경 */
  border: 2px solid #001D3D;
  /* 테두리 추가 */
}

/* 드롭다운 메뉴 스타일링 */
.user-dropdown {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: rgba(255, 255, 255, 0.7);
  border: 1px solid #001D3D;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dropdown-menu a {
  color: #001D3D;
  text-decoration: none;
}
</style>
