<template>
  <div v-show="isShow">
    <h1>그룹 정보</h1>
    <p>그룹 명 : {{ groupStore.group.name }}</p>
    <p>그룹 설명 : {{ groupStore.group.descript }}</p>
    <a :href="routeUrl">길찾기</a>
  </div>
</template>

<script setup>
import { watch, ref } from 'vue';
import { useGroupStore } from '@/stores/group';
const groupStore = useGroupStore();

const isShow = ref(false);

const routeUrl = ref();

watch(
  () => groupStore.group.id,
  (newValue, oldValue) => {
    if (groupStore.group) {
      isShow.value = true;
      createRouteURL();
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
</script>

<style scoped></style>
