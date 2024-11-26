import { ref } from 'vue';
import { defineStore } from 'pinia';
import apiClient from './apiClient';

export const useVideoChatStore = defineStore('videoChat', () => {
  const chats = ref({}); // 비디오 ID별로 채팅을 관리하기 위해 객체 형태로 변경

  const getChats = async (videoId, time) => {
    if (!chats.value[videoId]) {
      chats.value[videoId] = []; // 처음 가져오는 비디오 ID일 경우 빈 배열로 초기화
    }
    const response = await apiClient.get(`/chats/${videoId}`, {
      params: { time }, // requestParam으로 time 전달
    });
    if (response.data.length > 0) {
      chats.value[videoId].push(...response.data); // 해당 비디오 ID에 대한 채팅 추가
    }
  };

  const sendChat = async function (data) {
    await apiClient.post(`/chats/${data.exerciseVideoId}`, data);
  };

  // 특정 비디오의 채팅을 초기화하는 함수
  const clearChats = (videoId) => {
    chats.value[videoId] = []; // 해당 비디오 ID에 대한 채팅 내역 초기화
  };

  return { chats, getChats, sendChat, clearChats };
});
