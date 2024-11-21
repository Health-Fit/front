<template>
  <div>
    <h2>카카오 맵 보기</h2>
    <div id="map"></div>
  </div>
</template>

<style scoped>
#map {
  width: 100%;
  height: 400px;
}
</style>

<script setup>
import { ref, onMounted } from "vue";
import { useGroupStore } from "@/stores/group";

const groupStore = useGroupStore();

// map 객체 설정
const map = ref(null);

const searchCondition = ref({
	"cateogryId" : -1, 
	"time" : '2024.11.11T23:11:00',
	"left" : 125.0, 
	"right" : 127.0, 
	"bottom" : 35.0, 
	"top" : 37.0
})

// api 불러오기
const loadScript = () => {
  const script = document.createElement("script");
  script.src =
    "//dapi.kakao.com/v2/maps/sdk.js?appkey=4d17dc663675da11fb32c996f3c39c22&autoload=false";
  script.onload = () => window.kakao.maps.load(loadMap);

  document.head.appendChild(script);
};

// 맵 출력하기
const loadMap = () => {
  const container = document.getElementById("map");
  const options = {
    center: new window.kakao.maps.LatLng(33.450701, 126.570667),
    level: 3,
  };

  map.value = new window.kakao.maps.Map(container, options);

  // 타일로드 이벤트 추가하기
  kakao.maps.event.addListener(map.value, 'tilesloaded', tilesLoad)

  loadMarker();
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

    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
    });

    // 마우스오버 이벤트: InfoWindow 열기
    window.kakao.maps.event.addListener(marker, "mouseover", () => {
      infowindow.setContent(`<div style="padding:5px;">${group.name}</div>`);
      infowindow.open(map.value, marker);
    });

    // 마우스아웃 이벤트: InfoWindow 닫기
    window.kakao.maps.event.addListener(marker, "mouseout", () => {
      infowindow.close();
    });

    // 지도에 마커 추가
    marker.setMap(map.value);
    // 마커 배열에 추가.
    markers.push(marker);
  });
};

// 마커 초기화
function clearMarker(){
  for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map.value);
  }
  markers = [];
}

// 카카오 지도 타일이 로드된 뒤 작동방식
const tilesLoad = function(){
  var bounds = map.value.getBounds();
  var swLatLon = bounds.getSouthWest();
  searchCondition.value.bottom = swLatLon.getLat();
  searchCondition.value.left = swLatLon.getLng();
  var neLatLon = bounds.getNorthEast();
  searchCondition.value.top = neLatLon.getLat();
  searchCondition.value.right = neLatLon.getLng();
  loadMarker();
}

// 컴포넌트가 마운트되었을 때 지도 출력
onMounted(() => {
  groupStore.getGroups(searchCondition.value);
  if (window.kakao && window.kakao.maps) {
    loadMap();
  } else {
    loadScript();
  }
});
</script>
