<template>
  <div>
    <div class="map_wrap">
      <div id="drawingMap"></div>
      <div id="map"></div>
      <p class="modes">
        <button @click="setCurCenter" class="current-location-button">현재 위치</button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.map_wrap {
  width: 100%;
  height: 500px; /* 지도의 높이를 더 키워 더 시원하게 보이도록 설정 */
  position: relative;
  border-radius: 15px; /* 지도의 모서리를 둥글게 만들어 디자인 개선 */
  overflow: hidden; /* 둥근 모서리 밖에 요소가 보이지 않도록 설정 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 지도의 그림자를 추가하여 입체감 부여 */
  margin: 20px 0; /* 지도와 다른 요소들 간의 여백 추가 */
}

#map {
  width: 100%;
  height: 100%;
}

.modes {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 2;
}

.current-location-button {
  padding: 10px 15px;
  border: none;
  background-color: #FFC300; /* 버튼 배경을 노란색으로 설정 */
  color: #001D3D; /* 텍스트 색상은 네이비로 설정 */
  font-weight: bold;
  border-radius: 8px; /* 버튼 모서리를 둥글게 설정 */
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 버튼에 그림자를 추가하여 입체감을 부여 */
  transition: background-color 0.3s, color 0.3s, transform 0.2s; /* 호버 시 배경색, 텍스트 색상과 크기 변화 효과 추가 */
}

.current-location-button:hover {
  background-color: #001D3D; /* 마우스를 올렸을 때 버튼 배경색을 네이비로 변경 */
  color: #FFC300; /* 마우스를 올렸을 때 텍스트 색상을 노란색으로 변경 */
  transform: scale(1.05); /* 마우스를 올렸을 때 살짝 확대되는 효과 */
}

.current-location-button:active {
  transform: scale(1); /* 클릭 시 원래 크기로 돌아옴 */
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

// map 객체 설정
const map = ref(null);
// 주소-좌표 변환 객체 생성
const geocoder = ref(null);

// 검색 조건을 확인하고 해당 주소를 활용해서 화면 찾기
watch(
  () => searchStore.searchCondition,
  (newCondition) => {
    searchAddress(newCondition.value.address);
  },
  { deep: true }
);

// 카테고리 조건을 확인하고 해당 카테고리만 가진 화면 찾기
watch(
  () => categoryStore.selectedCategoryId,
  (newCategoryId) => {
    if (newCategoryId === 'all') {
      searchCondition.value.categoryId = 0;
    } else {
      searchCondition.value.categoryId = newCategoryId;
    }
  }
);

const searchAddress = (query) => {
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

const searchCondition = ref({
  categoryId: 0,
  time: '2023-11-11T23:11:00',
  left: 125.0,
  right: 127.0,
  bottom: 35.0,
  top: 37.0,
});

// 해당 SearchCondition이 변경되면 바로 검색을 진행할 수 있도록 함.
watch(searchCondition.value, async () => {
  await groupStore.getGroups(searchCondition.value);
  loadMarker();
});

// api 불러오기
const loadScript = () => {
  const script = document.createElement('script');
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&autoload=false&libraries=services`;
  script.onload = () => window.kakao.maps.load(loadMap);

  document.head.appendChild(script);
};

// 화면 중심 위치 (초기 위치는 역삼역)
const center_latitude = ref(37.501294);
const center_longitude = ref(127.03961);

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

  // 타일로드 이벤트 추가하기
  kakao.maps.event.addListener(map.value, 'tilesloaded', tilesLoad);
};

const markers = ref([]);

// 지정한 위치에 마커 불러오기
const loadMarker = () => {
  // 중복 마커 삭제
  clearMarker();
  if (!groupStore.groups || groupStore.groups.length === 0) return;

  const infowindow = new window.kakao.maps.InfoWindow({
    zIndex: 1, // z-index 설정
  });

  groupStore.groups.forEach((group) => {
    const markerPosition = new window.kakao.maps.LatLng(group.lat, group.lon);

    var imageSrc =
      '/src/assets/' +
      categoryStore.getCategoryString(group.exerciseCategoryId) +
      '.png';

    var imageSize = new kakao.maps.Size(40, 40),
      imageOption = { offset: new kakao.maps.Point(20, 20) };

    var markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    );

    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
      image: markerImage,
    });

    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
      infowindow.setContent(`<div style="padding:5px;">${group.name}</div>`);
      infowindow.open(map.value, marker);
    });

    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
      infowindow.close();
    });

    window.kakao.maps.event.addListener(marker, 'click', () => {
      groupStore.selectGroup(group);
    });

    marker.setMap(map.value);
    markers.value.push(marker);
  });
};

// 마커 초기화
function clearMarker() {
  if (markers.value.length > 0){
    for (var i = 0; i < markers.value.length; i++) {
    markers.value[i].setMap(null);
  }
  markers.value = [];
  }
}

// 카카오 지도 타일이 로드된 뒤 작동방식
const tilesLoad = function () {
  var bounds = map.value.getBounds();
  var swLatLon = bounds.getSouthWest();
  searchCondition.value.bottom = swLatLon.getLat();
  searchCondition.value.left = swLatLon.getLng();
  var neLatLon = bounds.getNorthEast();
  searchCondition.value.top = neLatLon.getLat();
  searchCondition.value.right = neLatLon.getLng();
};

// 컴포넌트가 마운트되었을 때 지도 출력
onMounted(() => {
  groupStore.getGroups(searchCondition.value);
  if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
    loadMap();
    geocoder.value = new kakao.maps.services.Geocoder();
  } else {
    loadScript();
  }
});

// 현재 위치로 중앙 위치 변경
const setCurCenter = function () {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
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

  tilesLoad();
};

// 현재 위치 마커
var curPos_Marker;

const setCurMarker = function (pos) {
  var imageSrc = '/src/assets/curpos.png',
    imageSize = new kakao.maps.Size(40, 55),
    imageOption = { offset: new kakao.maps.Point(20, 40) };

  var markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    ),
    markerPosition = new kakao.maps.LatLng(
      pos.coords.latitude,
      pos.coords.longitude
    );

  curPos_Marker = new kakao.maps.Marker({
    position: markerPosition,
    image: markerImage,
  });

  curPos_Marker.setMap(map.value);
};
</script>
