<template>
  <div class="video-chat-container">
    <!-- 유튜브 플레이어 -->
    <div class="video-player">
      <iframe :src="videoStore.getPlayer(videoStore.video.url)" frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
        class="video-frame"></iframe>
    </div>

    <!-- 실시간 채팅 조회 -->
    <div class="chat-container">
      <h3>실시간 채팅</h3>
      <div ref="chatMessages" class="chat-messages fixed-height">
        <ul>
          <li v-for="chat in videoChatStore.chats" :key="chat.id" :class="{'highlight': chat.isNew}" class="chat-message">
            <strong>{{ chat.nickname }}</strong>: {{ chat.message }}
          </li>
        </ul>
      </div>
      <div class="chat-input-container">
        <input type="text" placeholder="채팅..." v-model="newChatMessage" @keyup.enter="sendChatMessage"
          :disabled="!userStore.isLoggedIn" class="chat-input" />
        <button @click="sendChatMessage" :disabled="!userStore.isLoggedIn" class="chat-send-button">전송</button>
      </div>
    </div>
  </div>

  <!-- 비디오 정보 -->
  <div class="video-info">
    <h2 class="video-title">{{ videoStore.video.title }}</h2>
    <div class="video-details">
      <p class="video-views">{{ videoStore.video.viewCnt }}뷰 · {{ formatDate(videoStore.video.regDate) }}</p>
      <!-- 카테고리 출력 -->
      <div class="video-categories">
        <p>
          <span v-for="(category, index) in videoStore.video.categories" :key="category.id" class="video-category">
            {{ category.name }}<span v-if="index < videoStore.video.categories.length - 1">, </span>
          </span>
        </p>
      </div>
    </div>
  </div>

  <!-- 리뷰 정보 화면 -->
  <Review :videoId="videoStore.video.id" />
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useVideoStore } from '@/stores/video';
import { useVideoChatStore } from '@/stores/videoChat';
import Review from '@/components/videos/Review.vue';

const userStore = useUserStore();
const videoStore = useVideoStore();
const videoChatStore = useVideoChatStore();

const route = useRoute();
const videoId = route.params.id;

const chatMessages = ref(null);

onMounted(() => {
  // 비디오 정보 가져오기
  videoStore.getVideoById(parseInt(videoId));

  // 실시간 채팅 데이터 가져오기 (롱 폴링)
  const fetchChats = async () => {
    try {
      const lastTimestamp = new Date().toISOString();
      await videoChatStore.getChats(videoId, lastTimestamp);

      // 새로운 채팅이 올라오면 highlight 클래스 추가
      videoChatStore.chats.forEach((chat) => {
        chat.isNew = true; // 새로운 채팅 메시지에 표시
        setTimeout(() => {
          chat.isNew = false; // 일정 시간이 지나면 highlight 제거
        }, 1000); // 1초 후 원래 상태로
      });

      fetchChats(); // 응답이 오면 바로 다시 호출
    } catch (error) {
      console.error("채팅 데이터를 가져오는 중 오류 발생:", error);
      // 에러 발생 시 일정 시간 대기 후 재시도
      setTimeout(fetchChats, 3000);
    }
  };

  fetchChats();
});

// 채팅 목록 변경 시 자동으로 스크롤을 가장 아래로 이동
watch(
  () => videoChatStore.chats,
  () => {
    nextTick(() => {
      if (chatMessages.value) {
        chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
      }
    });
  },
  { deep: true }
);

const newChatMessage = ref("");

const sendChatMessage = async () => {
  if (!newChatMessage.value.trim()) {
    console.error("빈 메시지는 전송할 수 없습니다.");
    return;
  }

  try {
    const chatData = {
      exerciseVideoId: parseInt(videoId),
      memberId: userStore.member.id,
      nickname: userStore.member.nickname,
      message: newChatMessage.value.trim(),
      sentAt: new Date().toISOString().slice(0, 19),
    };

    await videoChatStore.sendChat(chatData);
    newChatMessage.value = ""; // 메시지 입력 필드 초기화
  } catch (error) {
    console.error("채팅 전송 실패:", error);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // 포맷을 'YYYY년 MM월 DD일 HH:mm' 형식으로 변환
  return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes < 10 ? '0' + minutes : minutes}분 업로드`;
};
</script>

<style scoped>
.video-chat-container {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.video-player {
  flex: 2;
}

.video-frame {
  width: 100%;
  height: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.chat-messages.fixed-height {
  flex: none;
  height: 300px;
  overflow-y: scroll;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.chat-message {
  margin-bottom: 10px;
  line-height: 1.5;
  transition: background-color 0.5s ease;
}

.chat-message strong {
  color: #007bff;
}

.chat-message.highlight {
  background-color: #fffae6;
}

.chat-input-container {
  display: flex;
  gap: 10px;
}

.chat-input {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
}

.chat-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.chat-send-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.chat-send-button:hover {
  background-color: #0056b3;
}

.chat-send-button:active {
  transform: scale(0.98);
}

.video-info {
  max-width: 1200px;
  margin: 20px auto;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: #333;
}

.video-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.video-details {
  font-size: 1rem;
  color: #555;
}

.video-views {
  margin-bottom: 10px;
}

.video-categories {
  font-size: 0.9rem;
  color: #777;
}

.video-category {
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 5px;
}
</style>
