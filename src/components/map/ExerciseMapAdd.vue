<template>
  <div class="map-container">
    <h2 class="map-title">모임 위치 설정</h2>
    <div class="map-wrap">
      <div id="drawingMap" class="drawing-map"></div>
      <div id="map" class="map"></div>
      <p class="modes">
        <button @click="setCurCenter" class="current-location-button">현재 위치</button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.map-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.map-title {
  font-size: 1.8rem;
  color: #0056b3;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}

.map-wrap {
  width: 100%;
  position: relative;
}

.map {
  width: 100%;
  height: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modes {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
}

.current-location-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.current-location-button:hover {
  background-color: #0056b3;
}

.drawing-map {
  display: none; /* 현재 사용되지 않으므로 숨김 처리 */
}
</style>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useGroupStore } from '@/stores/group';
import { useCategoryStore } from '@/stores/category';
import { useSearchStore } from '@/stores/search';

const groupStore = useGroupStore();
const categoryStore = useCategoryStore();
const searchStore = useSearchStore();

// 선택된 위치
const selectPos = ref({
  lat:0,
  lon:0,
})

// 선택 위치가 변경될때 발생하는 매서드
watch(selectPos, ()=>{

})

// 화면 중심 위치 (초기 위치는 역삼역)
const center_latitude = ref(37.501294);
const center_longitude = ref(127.03961);

// map 객체 설정
const map = ref(null);
// 주소-좌표 변환 객체 생성
const geocoder = ref(null);

// 모임의 위치를 표시할 마커 표시
var selectMarker;

// 검색 조건을 확인하고 해당 주소를 활용해서 화면 찾기
watch(
  () => searchStore.searchCondition,
  (newCondition) => {
    searchAddress(newCondition.value.address);
  },
  { deep: true }
);

const searchAddress = (query) => {
  console.log(query);
  geocoder.value.addressSearch(query, (result, status) => {
    // 주소 검색이 괜찮았다면
    if (status === kakao.maps.services.Status.OK) {
      const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

      // 지도 중심 이동
      map.value.setCenter(coords);
    } else {
      alert('검색 결과가 없습니다.');
    }
  });
};

// api 불러오기
const loadScript = () => {
  const script = document.createElement('script');
  script.src =
    `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&autoload=false&libraries=services`;
  script.onload = () => window.kakao.maps.load(loadMap);

  document.head.appendChild(script);
};

// 맵 출력하기
const loadMap = () => {
  const container = document.getElementById('map');
  // GeoLocation으로 현재 위치를 받아오고, 해당 위치를 기반으로 화면 중심을 잡는다.
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      // 현재 위치를 성공적으로 가져온 경우
      center_latitude.value = pos.coords.latitude;
      center_longitude.value = pos.coords.longitude;
      initializeMap(center_latitude.value, center_longitude.value, container);

      setCurMarker(pos);
    },
    (err) => {
      console.error('Geolocation Error:', err);
      // 현재 위치를 가져오지 못한 경우 기본값으로 초기화
      initializeMap(center_latitude.value, center_longitude.value, container);
    }
  );
};

// 지도 초기화 함수
const initializeMap = (latitude, longitude, container) => {
  const options = {
    center: new window.kakao.maps.LatLng(latitude, longitude),
    level: 3,
  };

  // map 변수에 카카오 지도를 할당
  map.value = new window.kakao.maps.Map(container, options);
  // 지오 코더 기능 할당
  geocoder.value = new window.kakao.maps.services.Geocoder();

  // 지도에 클릭 이벤트를 등록합니다
  // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
  kakao.maps.event.addListener(map.value, 'click', function(mouseEvent) {        
  // 클릭한 위도, 경도 정보를 가져옵니다 
  var latlng = mouseEvent.latLng;
  // 후에 저장을 위해 위도, 경도 정보를 가져온다.
  groupStore.groupForAdd.lat = Math.round(latlng.getLat() * 1000000) / 1000000;
  groupStore.groupForAdd.lon = Math.round(latlng.getLng() * 1000000) / 1000000;
  if (selectMarker){
      selectMarker.setPosition(latlng);
  }
  else{

      const marker = new kakao.maps.Marker({
          position: latlng,
      });
      marker.setMap(map.value);
      selectMarker = marker;
  }
  });
}
// 컴포넌트가 마운트되었을 때 지도 출력
onMounted(() => {
  if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
    loadMap();
    geocoder.value = new kakao.maps.services.Geocoder();
  } else {
    loadScript();
  }
});

// 현재 위치로 중앙 위치 변경
const setCurCenter = function () {
  // GeoLocation으로 현재 위치를 받아오고, 해당 위치를 기반으로 화면 중심을 잡는다.
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      // 현재 위치를 성공적으로 가져온 경우
      center_latitude.value = pos.coords.latitude;
      center_longitude.value = pos.coords.longitude;
      var moveLatLon = new kakao.maps.LatLng(
        pos.coords.latitude,
        pos.coords.longitude
      );
      map.value.panTo(moveLatLon);
    },
    (err) => {
      alert('현재 위치를 받아올 수 없습니다.');
    }
  );
};

// 현재 위치 마커
var curPos_Marker;

const setCurMarker = function (pos) {
  var imageSrc = '/src/assets/curpos.png', // 마커이미지의 주소입니다
    imageSize = new kakao.maps.Size(40, 55), // 마커이미지의 크기입니다
    imageOption = { offset: new kakao.maps.Point(20, 40) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

  // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
  var markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    ),
    markerPosition = new kakao.maps.LatLng(
      pos.coords.latitude,
      pos.coords.longitude
    ); // 마커가 표시될 위치입니다

  // 마커를 생성합니다
  curPos_Marker = new kakao.maps.Marker({
    position: markerPosition,
    image: markerImage, // 마커이미지 설정
  });

  // 마커가 지도 위에 표시되도록 설정합니다
  curPos_Marker.setMap(map.value);
};
</script>