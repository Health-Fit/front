<template>
  <div v-if="isShow">
    <h1>그룹 정보</h1>
    <img :src="categoryImgUrl" height="50px">
    <p>그룹 명 : {{ groupStore.group.name }}</p>
    <p>그룹 설명 : {{ groupStore.group.descript }}</p>
    <p>참여 인원 : {{ groupStore.group.memberIds.length + 1 }} / {{ groupStore.group.maxMember }}</p>
    <p>시작 일자 : {{ formattedStartDate }}</p>
    <button>참가하기</button>
    <a :href="routeUrl" target="_blank">길찾기</a>
  </div>
</template>

<script setup>
import { watch, ref } from 'vue';
import { useGroupStore } from '@/stores/group';
import { useCategoryStore } from '@/stores/category';
const groupStore = useGroupStore();
const categoryStore = useCategoryStore();

const isShow = ref(false);

const categoryImgUrl = ref('');
const routeUrl = ref('');
const formattedStartDate = ref('');

watch(
  () => groupStore.group.id,
  (newValue, oldValue) => {
    if (groupStore.group) {
      isShow.value = true;
      categoryImgUrl.value = '/src/assets/' + 
      categoryStore.getCategoryString(groupStore.group.exerciseCategoryId) + 
      '.png';
      createRouteURL();
      formatStartDate();
    }
  }
);

const createRouteURL = function () {
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
        '&pathType=0&showMap=true&etext=' +
        groupStore.group.name.split(' ').join('') +
        '&menu=route';
      console.log(routeUrl.value);
    },
    (err) => {
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
</script>

<style scoped></style>
