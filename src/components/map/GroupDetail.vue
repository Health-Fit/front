<template>
  <div >
    <template v-if="groupStore.isShow">
      <h1>그룹 정보</h1>
    <img :src="categoryImgUrl" height="50px">
    <p>그룹 명 : {{ groupStore.group.name }}</p>
    <p>그룹 설명 : {{ groupStore.group.descript }}</p>
    <p>참여 인원 : {{ groupStore.group.memberIds.length + 1 }} / {{ groupStore.group.maxMember }}</p>
    <p>그룹장</p>
    <img :src="groupStore.groupLeader.profileImg" class="user-thumbnail">
    <p>멤버</p>
    <template v-if="groupStore.groupMembers.length > 0">
      <img v-for="member in groupStore.groupMembers" :src="member.profileImg" class="user-thumbnail">
    </template>
    <template v-else>
      <p>멤버 없음</p>
    </template>
    <p>시작 일자 : {{ formattedStartDate }}</p>
    <button @click="joinGroup">참가하기</button><br>
    <button @click="showRoute(0)">자동차</button>
    <button @click="showRoute(1)">대중교통</button>
    <button @click="showRoute(2)">도보</button>
    <button @click="showRoute(3)">자전거</button>
    <!-- 길찾기 화면 -->
    <div v-if="isRouteVisible" class="route-container">
      <iframe
        ref="naverMapIframe"
        :src="routeUrl"
        width="100%"
        height="400px"
        frameborder="0"
        style="position: relative; z-index: 1;">
      </iframe>
      <!-- CSS로 좌측 메뉴 숨기기 -->
      <div class="overlay"></div>
    </div>
    </template>
    
  </div>
</template>

<script setup>
import { watch, ref } from 'vue';
import { useGroupStore } from '@/stores/group';
import { useCategoryStore } from '@/stores/category';

const groupStore = useGroupStore();
const categoryStore = useCategoryStore();

const isShow = ref(false);
const isRouteVisible = ref(false); // 길찾기 화면 표시 여부
const categoryImgUrl = ref('');
const routeUrl = ref('');
const formattedStartDate = ref('');

// group 선택이 변경된 것을 감지하여 표시
watch(
  () => groupStore.group.id,
  () => {
    if (groupStore.group) {
      categoryImgUrl.value =
        '/src/assets/' +
        categoryStore.getCategoryString(groupStore.group.exerciseCategoryId) +
        '.png';
      createRouteURL();
      formatStartDate();
    }
  }
);

// 길찾기 URL schema 형식 이용
const createRouteURL = function (routeType) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      // 현재 위치를 성공적으로 가져온 경우
      routeUrl.value =
        'http://map.naver.com/index.nhn?slng=' +
        pos.coords.longitude +
        '&slat=' +
        pos.coords.latitude +
        '&stext=현위치&elng=' +
        groupStore.group.lon +
        '&elat=' +
        groupStore.group.lat +
        '&pathType=' + routeType +
        '&showMap=true&etext=' +
        groupStore.group.name.split(' ').join('') +
        '&menu=route&route/public';

    },
    () => {
      routeUrl.value =
        'http://map.naver.com/index.nhn?slng=127&slat=37.5&stext=출발지명&elng=127.5&elat=37.4&pathType=0&showMap=true&etext=도착지명&menu=route';
    }
  );
};

// 시작 일자를 '년 월 일 시 분' 형식으로 변환하는 함수
const formatStartDate = () => {
  if (groupStore.group.startDate) {
    const startDate = new Date(groupStore.group.startDate);
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(startDate.getDate()).padStart(2, '0');
    const hours = String(startDate.getHours()).padStart(2, '0');
    const minutes = String(startDate.getMinutes()).padStart(2, '0');

    // '년 월 일 시 분' 형식으로 포맷
    formattedStartDate.value = `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
  }
};

// 길찾기 버튼 클릭 시 실행
const showRoute = () => {
  isRouteVisible.value = true;
};

// 그룹 참가
const joinGroup = () => {
  groupStore.joinGroup();
};
</script>

<style scoped>
.user-thumbnail {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}
.route-container {
  margin-top: 20px;
}
</style>
