import { ref } from 'vue';
import { defineStore } from 'pinia';
import apiClient from './apiClient';

export const useGroupChatStore = defineStore('groupChat', () => {

    const chats = ref([]);

    const getChats = async (groupId, idx) => {
        const response = await apiClient.get(`/groups/chats/${groupId}`, {
            params: { idx },
        });
        if (response.data.length > 0) {
            chats.value.push(...response.data);
        }
    };

    const sendChat = async function (data, groupId) {
        await apiClient.post(`/groups/chats/${groupId}`, data);
      };

    return { chats, getChats, sendChat };
});
