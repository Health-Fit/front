import { ref } from 'vue';
import { defineStore } from 'pinia';
import apiClient from './apiClient';

export const useVideoChatStore = defineStore('videoChat', () => {

    const chats = ref([]);

    const getChats = async (videoId, time) => {
        const response = await apiClient.get(`/chats/${videoId}`, {
            params: { time }, // requestParam으로 time 전달
        });
        if (response.data.length > 0) {
            chats.value.push(...response.data); // 기존 채팅에 새 채팅 추가
        }
    };

    const sendChat = async function (data) {
        console.log(`/chats/${data.exerciseVideoId}`)
        await apiClient.post(`/chats/${data.exerciseVideoId}`, data);
      };

    return { chats, getChats, sendChat };
});
