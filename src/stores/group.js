import { ref } from 'vue';
import { defineStore } from 'pinia';
import apiClient from './apiClient';

export const useGroupStore = defineStore('group', () => {
  // 검색한 그룹 정보를 가지고 있음
  const groups = ref([]);

  // 그룹에 대한 정보를 검색해 옴
  const getGroups = async function (searchCondition) {
    const response = await apiClient.get(`/groups`, {
      cateogryId: searchCondition.cateogryId,
      time: searchCondition.time,
      left: searchCondition.left,
      right: searchCondition.right,
      bottom: searchCondition.bottom,
      top: searchCondition.top,
    });
    groups.value = response.data;
  };

  // 선택된 그룹 표시 기능
  const group = ref({});

  // 지도에서 그룹 선택하기 기능 수행
  const selectGroup = function (selected) {
    group.value = selected;
  };

  
  // 그룹 참가하기 -> 선택된 그룹 기준으로 참가하기 기능 수행
  const joinGroup = async function (){
    const response = await apiClient.get(`/groups/${group.value.id}`);
    // 제대로 추가가 된 경우에는 그룹에 추가가 완료된 것으로 확인이 가능할 것
    if (response.status){

    }
  }

  // 추가할 그룹에 대한 정보
  const groupForAdd = ref({
    "name": "",
  "lat": 0,
  "lon": 0,
  "exerciseCategoryId": 2,
  "startDate": "2024-11-21T08:00:00",
  "endDate": "2024-11-28T08:00:00",
  "maxMember": 10,
  "descript": "",
  });

  // 그룹 추가하기
  const addGroup = async function (){
    if(groupForAdd.value.lat == 0 || groupForAdd.value.lon == 0){
      alert("화면에서 그룹의 위치를 선택해주세요.");
      return;
    }
    console.log(groupForAdd);
    //const response = await apiClient.post('/groups/add', groupForAdd.value);
  }

  return { groups, getGroups, group, selectGroup, joinGroup, groupForAdd, addGroup };
});
