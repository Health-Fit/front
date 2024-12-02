<template>
  <div v-if="groupStore.isShow" class="group-container">
    <div v-if="groupStore.isShow" class="card">
      <div class="card" v-if="isWeatherOk">
        <h2 class="card-title">날씨</h2>
        <div class="weather-info" v-if="isWeatherOk">
          <p class="group-description">기온 {{ tmp }}℃</p>
          <img :src="sky" alt="날씨 이미지" />
          <p class="group-description">강수확률 {{ pop }}%</p>
        </div>
      </div>
      <div class="card" v-else>
        <p>날씨 정보가 없습니다.</p>
      </div>

      <div class="card">
        <div class="group-info-header"><h2 class="card-title">그룹 정보 <span class="d-day">{{ dDayMessage }}</span></h2></div>
        <img :src="categoryImgUrl" height="50px" />
        <p class="group-description">그룹 명 : {{ groupStore.group.name }}</p>
        <p class="group-description">그룹 설명 : {{ groupStore.group.descript }}</p>
        <p class="group-description">참여 인원 : {{ groupStore.group.memberIds.length + 1 }} / {{ groupStore.group.maxMember }}</p>
        <p class="group-description">그룹장</p>
        <img :src="groupStore.groupLeader.profileImg ? groupStore.groupLeader.profileImg : '/src/assets/default-profile.png'"
          class="user-thumbnail" />
        <p class="group-description">시작 일자 : {{ formattedStartDate }}</p>
        <button @click="joinGroup">참가하기</button>
      </div>

      <div class="card">
        <h2 class="card-title">멤버</h2>
        <div class="group-members">
          <div v-if="groupStore.groupMembers.length > 0">
            <img v-for="member in groupStore.groupMembers" :src="member.profileImg ? member.profileImg : '/src/assets/default-profile.png'" :key="member.id"
              class="user-thumbnail" />
          </div>
          <div v-else class="group-description">
            <p>아직 함께 할 멤버가 없어요...</p>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 class="card-title">길찾기</h2>
        <button @click="showRoute(1)">대중교통</button>
        <button @click="showRoute(0)">자동차</button>
        <button @click="showRoute(3)">도보</button>
        <button @click="showRoute(2)">자전거</button>
      </div>

      <div v-if="isRouteVisible" class="route-container">
        <iframe ref="naverMapIframe" :src="routeUrl" width="100%" height="400px" frameborder="0"></iframe>
        <div class="overlay"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, computed } from 'vue';
import { useGroupStore } from '@/stores/group';
import { useCategoryStore } from '@/stores/category';
import { useWeatherStore } from '@/stores/weather';

const groupStore = useGroupStore();
const categoryStore = useCategoryStore();
const weatherStore = useWeatherStore();

const isShow = ref(false);
const isRouteVisible = ref(false); // 길찾기 화면 표시 여부
const categoryImgUrl = ref('');
const routeUrl = ref('');
const formattedStartDate = ref('');

const isWeatherOk = ref(false);
const tmp = ref('');
const sky = ref('');
const pop = ref('');

// 디데이 계산
const dDayMessage = computed(() => {
  if (groupStore.group.startDate) {
    const startDate = new Date(groupStore.group.startDate);
    const currentDate = new Date();

    const timeDifference = startDate - currentDate;
    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (dayDifference > 0) {
      return `D-${dayDifference}`;
    } else if (dayDifference === 0) {
      return 'D-Day';
    } else {
      return `D+${Math.abs(dayDifference)}`;
    }
  }
  return '';
});

// group 선택이 변경된 것을 감지하여 표시
watch(
  () => groupStore.group.id,
  async () => {
    if (groupStore.group) {
      categoryImgUrl.value =
        '/src/assets/' +
        categoryStore.getCategoryString(groupStore.group.exerciseCategoryId) +
        '.png';

      isWeatherOk.value = false;

      const weather = await weatherStore.getWeather(
        groupStore.group.lat,
        groupStore.group.lon,
        groupStore.group.startDate
      );
      if (weather.ok) {
        isWeatherOk.value = weather.ok;
        tmp.value = weather.tmp;
        sky.value = `/src/assets/${weather.sky}.png`;
        pop.value = weather.pop;
      }
      isRouteVisible.value = false;
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
        '&pathType=' +
        routeType +
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
const showRoute = (type) => {
  createRouteURL(type);
  isRouteVisible.value = true;
};

// 그룹 참가
const joinGroup = () => {
  groupStore.joinGroup();
};
</script>

<style scoped>
/* 전체 페이지 스타일 */
.group-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/* 그룹 정보 카드 */
.card {
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 그룹 정보 헤더 스타일 */
.group-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 디데이 스타일 */
.d-day {
  font-size: 1.2em;
  color: #ff5733;
  font-weight: bold;
}

/* 그룹장 및 멤버 이미지 스타일 */
.user-thumbnail {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 5px;
  object-fit: cover;
  border: 2px solid #ccc;
}

/* 카드 제목 스타일 */
.card-title {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
}

/* 그룹 설명 스타일 */
.group-description {
  font-size: 1em;
  color: #555;
  margin-bottom: 15px;
}

/* 버튼 스타일 통일 */
button {
  background-color: #FFC300;
  color: #001D3D;
  border: 2px solid #001D3D;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #e59c00;
}

/* 날씨 정보 스타일 */
.weather-info {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.weather-info img {
  width: 50px;
  height: 50px;
  margin-left: 10px;
}

/* 그룹 멤버 스타일 */
.group-members {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

/* 길찾기 화면 스타일 */
.route-container {
  margin-top: 20px;
  padding: 20px;
  background-color: #e0f7fa;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
