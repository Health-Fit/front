import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import apiClient from './apiClient';

export const useGroupStore = defineStore('group', () => {
  const router = useRouter();

  // 검색한 그룹 정보를 가지고 있음
  const groups = ref([]);

  // 그룹에 대한 정보를 검색해 옴
  const getGroups = async function (searchCondition) {
    const response = await apiClient.post(`/groups`, {
      categoryId: searchCondition.categoryId,
      time: searchCondition.time,
      left: searchCondition.left,
      right: searchCondition.right,
      bottom: searchCondition.bottom,
      top: searchCondition.top,
    });
    groups.value = response.data;
    group.value = {};
  };

  // 선택된 그룹 표시 기능
  const group = ref({});

  // 선택된 그룹의 리더 정보
  const groupLeader = ref({});

  // 선택된 그룹의 유저 정보
  const groupMembers = ref([]);

  // 지도에서 그룹 선택하기 기능 수행
  const selectGroup = async function (selected) {
    group.value = selected;

    // 그룹장 정보 가져오기
    const response = await apiClient.get(`/members/${group.value.leaderMemberId}`);
    groupLeader.value = response.data;
    // 그룹 멤버 정보 가져오기
    const memberRequests = group.value.memberIds.map((memberId) =>
        apiClient.get(`/members/${memberId}`)
    );
    // 모든 멤버 요청 병렬 처리
    const responses = await Promise.all(memberRequests);
    // 응답에서 멤버 데이터를 추출하고 groupMembers에 저장
    groupMembers.value = responses.map((res) => res.data);
  };

  
  // 그룹 참가하기 -> 선택된 그룹 기준으로 참가하기 기능 수행
  const joinGroup = async function (){
    const response = await apiClient.get(`/groups/${group.value.id}`);
    if (response.status === 200 || response.status === 201){
      console.log('그룹에 성공적으로 가입되었습니다.');
      group.value = null;
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
    }else{
      console.log(groupForAdd);
      const response = await apiClient.post('/groups/add', groupForAdd.value);
      alert('그룹이 생성되었습니다!');
      router.push('/');
    }
  }

  // 추가할 정보 초기화
  const clearGroupForAdd = function(){
    groupForAdd.value.name = "";
    groupForAdd.value.lat = 0;
    groupForAdd.value.lon = 0;
    groupForAdd.value.exerciseCategoryId = 1;
    groupForAdd.maxMember = 5;
    groupForAdd.descript = "";
  }

  return { groups, getGroups, group, groupLeader, groupMembers, selectGroup, joinGroup, groupForAdd, addGroup, clearGroupForAdd };
});
