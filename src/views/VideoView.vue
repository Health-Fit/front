<template>
  <div>
    <!-- 유튜브 플레이어 -->
    <div>
      <iframe :src="videoStore.getPlayer(videoStore.video.url)" frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
        class="video-frame"></iframe>
    </div>

    <!-- 실시간 채팅 조회 -->
    <div>
      <div>
        <ul>
          <li v-for="chat in videoChatStore.chats" :key="chat.id">
            <strong>{{ chat.nickname }}</strong>: {{ chat.message }}
          </li>
        </ul>
      </div>
      <div>
        <input type="text" placeholder="채팅..." v-model="newChatMessage" @keyup.enter="sendChatMessage"
          :disabled="!userStore.isLoggedIn" />
        <button @click="sendChatMessage" :disabled="!userStore.isLoggedIn">전송</button>
      </div>
    </div>

    <!-- 비디오 정보 -->
    <div>
      <h2>{{ videoStore.video.title }}</h2>
      <div>
        <p>{{ videoStore.video.viewCnt }}뷰 · {{ formatDate(videoStore.video.regDate)
            }}
        </p>
        <!-- 카테고리 출력 -->
        <div>
          <p>
            <span v-for="(category, index) in videoStore.video.categories" :key="category.id">
              {{ category.name }}<span v-if="index < videoStore.video.categories.length - 1">, </span>
            </span>
          </p>
        </div>
      </div>

    </div>

    <!-- 리뷰 정보 화면 -->
    <Review :videoId="videoStore.video.id" />
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
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

onMounted(() => {
  // 비디오 정보 가져오기
  videoStore.getVideoById(parseInt(videoId));

  // 실시간 채팅 데이터 가져오기 (롱 폴링)
  const fetchChats = async () => {
    try {
      const lastTimestamp = new Date().toISOString();
      await videoChatStore.getChats(videoId, lastTimestamp);
      fetchChats(); // 응답이 오면 바로 다시 호출
    } catch (error) {
      console.error("채팅 데이터를 가져오는 중 오류 발생:", error);
      // 에러 발생 시 일정 시간 대기 후 재시도
      setTimeout(fetchChats, 3000);
    }
  };

  fetchChats();
});

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

<style scoped></style>
