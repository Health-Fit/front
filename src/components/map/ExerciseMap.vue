<template>
  <div>
    <h2>카카오 맵 보기</h2>
    <div class="map_wrap">
      <div id="drawingMap"></div>
      <div id="map"></div>
      <p class="modes">
        <button @click="setCurCenter">현재 위치</button>
      </p>
    </div>
  </div>
</template>

<style scoped>
#map {
  width: 100%;
  height: 400px;
}
.map_wrap {
  width: 100%;
  position: relative;
}
.modes {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
}
#map {
  width: 100%;
  height: 350px;
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

// 검색 조건이 바뀐경우 (즉 검색된 경우)
// watch(searchStore.searchCondition.value, () => {
//   console.log(searchStore.searchCondition);
//   searchAddress(searchStore.searchCondition.address);
// });

watch(
  () => searchStore.searchCondition,
  (newCondition) => {
    console.log('검색 조건 변경됨:', newCondition);
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

const searchCondition = ref({
  cateogryId: -1,
  time: '2023.11.11T23:11:00',
  left: 125.0,
  right: 127.0,
  bottom: 35.0,
  top: 37.0,
});

// 해당 SearchCondition이 변경되면 바로 검색을 진행할 수 있도록 함.
watch(searchCondition.value, () => {
  groupStore.getGroups(searchCondition.value);
  loadMarker();
});

// api 불러오기
const loadScript = () => {
  const script = document.createElement('script');
  script.src =
    '//dapi.kakao.com/v2/maps/sdk.js?appkey=4d17dc663675da11fb32c996f3c39c22&autoload=false&libraries=services';
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

var markers = [];

// 지정한 위치에 마커 불러오기
// 지정한 위치에 여러 개의 마커 생성하기
const loadMarker = () => {
  // 중복 마커 삭제
  clearMarker();
  if (!groupStore.groups || groupStore.groups.length === 0) return;

  // InfoWindow를 재사용하도록 초기화
  const infowindow = new window.kakao.maps.InfoWindow({
    zIndex: 1, // z-index 설정
  });

  groupStore.groups.forEach((group) => {
    const markerPosition = new window.kakao.maps.LatLng(group.lat, group.lon);

    var imageSrc =
      '/src/assets/' +
      categoryStore.getCategoryString(group.exerciseCategoryId) +
      '.png';

    var imageSize = new kakao.maps.Size(40, 40), // 마커이미지의 크기입니다
      imageOption = { offset: new kakao.maps.Point(20, 20) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    var markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    );

    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
      image: markerImage,
    });

    // 마우스오버 이벤트: InfoWindow 열기
    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
      infowindow.setContent(`<div style="padding:5px;">${group.name}</div>`);
      infowindow.open(map.value, marker);
    });

    // 마우스아웃 이벤트: InfoWindow 닫기
    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
      infowindow.close();
    });

    // 마우스클릭 이벤트
    window.kakao.maps.event.addListener(marker, 'click', () => {
      groupStore.selectGroup(group);
    });

    // 지도에 마커 추가
    marker.setMap(map.value);
    // 마커 배열에 추가.
    markers.push(marker);
  });
};

// 마커 초기화
function clearMarker() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map.value);
  }
  markers = [];
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
    geocoder.value = new web.kakao.maps.services.Geocoder();
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

  // 화면 이동 후에 변경된 위치를 기준으로 값을 받아온다.
  tilesLoad();
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
