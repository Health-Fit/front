<template>
  <div class="container">
    <!-- 상단 영역: 달력과 그룹 정보 및 채팅 -->
    <div class="top-section">
      <!-- 달력 섹션 -->
      <div class="calendar-section">
        <div class="calendar">
          <div class="calendar-header">
            <button @click="changeMonth(-1)" class="calendar-nav-button">◀</button>
            <h2>{{ monthName }} {{ year }}</h2>
            <button @click="changeMonth(1)" class="calendar-nav-button">▶</button>
          </div>

          <!-- 요일 헤더 -->
          <div class="weekday-header">
            <div v-for="(weekday, index) in weekdays" :key="index" class="weekday"
              :class="{ sunday: index === 0, saturday: index === 6 }">
              {{ weekday }}
            </div>
          </div>

          <!-- 날짜 그리드 -->
          <div class="calendar-grid">
            <!-- 빈 칸 -->
            <div v-for="n in firstDayOfMonth" :key="'empty-' + n" class="empty-day"></div>

            <!-- 실제 날짜 -->
            <div v-for="day in daysInMonth" :key="day.date" class="calendar-day" :class="{
              today: isToday(day),
              'has-events': hasEvents(day),
              sunday: isSunday(day),
              saturday: isSaturday(day),
            }">
              <span class="day-number">{{ day.date }}</span>
              <div class="events">
                <div class="event-buttons">
                  <button v-for="(event, index) in getEventsForDay(day)" :key="index" class="event-button"
                    @click.stop="showEventDetails(event)">
                    {{ event.title }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 그룹 정보와 채팅 섹션 -->
      <div class="group-chat-section">
        <div v-if="groupStore.selectedMyGroup" class="group-details">
          <div class="group-info">
            <img :src="categoryImgUrl" class="category-thumbnail" />
            <div class="group-info-text">
              <p><strong>그룹 명 :</strong> {{ groupStore.selectedMyGroup.name }}</p>
              <p><strong>그룹 설명 :</strong> {{ groupStore.selectedMyGroup.descript }}</p>
              <div class="group-leader">
                <p><strong>그룹장 :</strong></p>
                <img :src="groupStore.selectedMyGroupLeader.profileImg ? groupStore.selectedMyGroupLeader.profileImg : '/src/assets/default-profile.png'" class="user-thumbnail" />
              </div>
              <div class="group-members">
                <p><strong>멤버 :</strong></p>
                <template v-if="groupStore.selectedMyGroupMembers.length > 0">
                  <img v-for="member in groupStore.selectedMyGroupMembers" :src="member.profileImg ? member.profileImg : '/src/assets/default-profile.png'" :key="member.id"
                    class="user-thumbnail" />
                </template>
                <template v-else>
                  <p>멤버 없음</p>
                </template>
              </div>
            </div>
          </div>

          <!-- 채팅 섹션 -->
          <div class="chat-section">
            <h3>실시간 채팅</h3>
            <div ref="chatMessages" class="chat-messages">
              <div v-for="chat in groupChatStore.chats" :key="chat.id" :class="{ 'highlight': chat.isNew }"
                class="chat-message">
                <img :src="chat.profileImg" alt="profile" class="chat-profile-img" />
                <strong>{{ chat.nickname }}</strong>: {{ chat.message }}
              </div>
            </div>
            <div class="chat-input-container">
              <input type="text" placeholder="채팅..." v-model="newChatMessage" @keyup.enter="sendChatMessage"
                class="chat-input" />
              <button @click="sendChatMessage" class="chat-send-button">전송</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 찜 영상 목록 -->
    <div class="exercise-video-list">
      <p class="intro-text">찜한 영상</p>
      <ul class="video-list">
        <li v-for="video in videoStore.likedVideos" :key="video.id" class="video-container">
          <a @click.prevent="goToVideo(video.id)" href="#" class="video-link">
            <img :src="`https://img.youtube.com/vi/${video.url}/maxresdefault.jpg`" alt="Video Thumbnail" class="video-frame" />
            <div class="click-overlay"></div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useGroupStore } from '@/stores/group';
import { useVideoStore } from '@/stores/video';
import { useCategoryStore } from '@/stores/category';
import { useGroupChatStore } from '@/stores/groupChat';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';

const groupStore = useGroupStore();
const videoStore = useVideoStore();
const categoryStore = useCategoryStore();
const groupChatStore = useGroupChatStore();
const router = useRouter();

onMounted(async () => {
  groupStore.selectedMyGroup = null;

  // 그룹, 카테고리, 찜 영상 데이터를 모두 가져오기
  await groupStore.getMyGroups();
  await categoryStore.getCategories();
  await videoStore.getLikedVideos();

  // 그룹 데이터를 이벤트로 변환
  const myGroups = groupStore.myGroups;
  events.value = {};

  myGroups.forEach((group) => {
    const key = dayjs(group.startDate).format('YYYY-M-D');
    if (!events.value[key]) {
      events.value[key] = [];
    }
    events.value[key].push({
      groupId: group.id,
      title: group.name,
      description: group.descript,
      time: dayjs(group.startDate).format('HH:mm'),
    });
  });
  // setTimeout(scrollToBottom, 500)
});

// 그룹 채팅
const newChatMessage = ref("");
const chatMessages = ref(null);
const polling = ref(false); // 폴링 상태 변수 추가

// 그룹 채팅 조회 함수 (롱폴링 구현)
const pollChats = async (groupId) => {
  if (polling.value) return; // 이미 폴링 중이면 중단
  polling.value = true;

  const poll = async () => {
    if (!polling.value) return; // 폴링이 중단되었으면 종료

    const lastChatId = groupChatStore.chats.length > 0 ? groupChatStore.chats[groupChatStore.chats.length - 1].id : 0;
    try {
      // 채팅 조회
      await groupChatStore.getChats(groupId, lastChatId);
      // 조회 후 일정 시간 대기 없이 바로 재요청
      poll();
    } catch (error) {
      console.error('채팅 조회 오류:', error);
      // 오류 발생 시 일정 시간 대기 후 재시도
      setTimeout(poll, 1000);
    }
  };

  poll();
};

// 그룹 변경 시 폴링 관리
watch(
  () => groupStore.selectedMyGroup,
  (newGroup, oldGroup) => {
    if (polling.value) {
      polling.value = false; // 기존 폴링 중단
    }
    groupChatStore.chats = []; // 이전 채팅 데이터 초기화
    if (newGroup) {
      pollChats(newGroup.id); // 새로운 그룹의 채팅 폴링 시작
    }
  }
);

// 채팅 메시지 전송 함수
const sendChatMessage = async () => {
  if (newChatMessage.value.trim() !== "") {
    const data = {
      message: newChatMessage.value,
    };
    await groupChatStore.sendChat(data, groupStore.selectedMyGroup.id);
    newChatMessage.value = "";

    // 새로운 채팅이 추가된 후 일정 시간 대기 후 채팅 목록 전체에 하이라이트 적용
    setTimeout(() => {
      groupChatStore.chats = groupChatStore.chats.map(chat => ({ ...chat, isNew: true }));
      scrollToBottom(); // 최신 메시지로 스크롤 이동
      setTimeout(() => {
        groupChatStore.chats = groupChatStore.chats.map(chat => ({ ...chat, isNew: false }));
      }, 500); // 1초 후 하이라이트 제거
    }, 100); // 새로운 채팅이 추가된 후 500ms 후에 하이라이트 적용
  }
};


// 최신 메시지로 스크롤 이동하는 함수
const scrollToBottom = () => {
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
};

// 카테고리 아이콘
const categoryImgUrl = ref('');

// 현재 월과 연도
const currentDate = ref(new Date());
const selectedEvent = ref(null);

// 요일 목록
const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

// 월 변경 함수
const changeMonth = (delta) => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + delta);
  currentDate.value = newDate;
};

// 오늘인지 확인
const isToday = (day) => {
  const today = dayjs();
  const date = dayjs(`${day.year}-${day.month + 1}-${day.date}`);
  return today.isSame(date, 'day');
};

// 토요일인지 확인
const isSaturday = (day) => {
  const date = new Date(day.year, day.month, day.date);
  return date.getDay() === 6;
};

// 일요일인지 확인
const isSunday = (day) => {
  const date = new Date(day.year, day.month, day.date);
  return date.getDay() === 0;
};

// 해당 월의 첫 번째 날의 요일 (0: 일요일 ~ 6: 토요일)
const firstDayOfMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  return new Date(year, month, 1).getDay();
});

// 해당 월의 날짜 생성
const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const days = [];
  const daysInCurrentMonth = dayjs(`${year}-${month + 1}-01`).daysInMonth();

  for (let i = 1; i <= daysInCurrentMonth; i++) {
    days.push({
      date: i,
      month: month,
      year: year,
    });
  }
  return days;
});

// 날짜별 이벤트 저장
const events = ref({});

// 날짜에 이벤트가 있는지 확인
const hasEvents = (day) => {
  const key = dayjs(`${day.year}-${day.month + 1}-${day.date}`).format(
    'YYYY-M-D'
  );
  return events.value[key] && events.value[key].length > 0;
};

// 특정 날짜의 이벤트 가져오기
const getEventsForDay = (day) => {
  const key = dayjs(`${day.year}-${day.month + 1}-${day.date}`).format(
    'YYYY-M-D'
  );
  return events.value[key] || [];
};

// 이벤트 세부 정보 표시
const showEventDetails = async (event) => {
  await groupStore.selectMyGroup(event.groupId);
  categoryImgUrl.value =
    '/src/assets/' +
    categoryStore.getCategoryString(
      groupStore.selectedMyGroup.exerciseCategoryId
    ) +
    '.png';
  groupChatStore.chats = []; // 기존 채팅 초기화
  await groupChatStore.getChats(groupStore.selectedMyGroup.id);
};

// 달 이름 계산
const monthName = computed(() => {
  const months = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];
  return months[currentDate.value.getMonth()];
});

// 연도 계산
const year = computed(() => currentDate.value.getFullYear());
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
  padding: 20px;
  height: 100%;
}

.top-section {
  display: flex;
  width: 100%;
  gap: 30px; /* 기존 20px에서 30px로 증가하여 달력과 그룹 채팅 간 간격을 더 벌림 */
}

.calendar-section {
  flex: 1 1 45%; /* 달력 섹션이 더 넓게 보이도록 flex-grow 설정 */
}

.group-chat-section {
  flex: 2;
  height: 100%; /* 부모의 높이를 따라가도록 설정 */
}

.group-details {
  max-width: 400px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px; /* 살짝 더 아래로 이동 */
  align-self: flex-start; /* 상단 기준으로 정렬 */
}

.group-info {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  background-color: #f7f7f7;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.chat-section {
  margin-top: 20px;
  margin-left: 10px;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  background-color: #1e1e1e;
  color: #f1f1f1;
}

.chat-messages {
  height: 300px;
  overflow-y: auto;
  padding: 10px;
  background-color: #2b2b2b;
  border-bottom: 1px solid #444;
  scroll-behavior: smooth;
}

.chat-message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  background-color: #3e3e3e;
  transition: background-color 0.3s;
}

.chat-message.highlight {
  background-color: #847d44; /* 연한 노란색 하이라이트 효과 */
  transition: background-color 1s ease;
}

.chat-profile-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.chat-input-container {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #1e1e1e;
}

.chat-input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #2b2b2b;
  color: #f1f1f1;
}

.chat-send-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  margin-left: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chat-send-button:hover {
  background-color: #0056b3;
}

.user-thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #FFC300; /* 노란색 테두리 추가 */
}

.calendar {
  margin: 20px;
  max-width: 1000px; /* 기존 1200px에서 1000px로 감소 */
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
}

.calendar-nav-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.calendar-nav-button:hover {
  background-color: #0056b3;
}

.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 1.2rem;
  color: #555;
}

.weekday.sunday {
  color: red;
}

.weekday.saturday {
  color: blue;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.empty-day {
  visibility: hidden;
}

.calendar-day {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  border: 1px solid #ddd;
  position: relative;
  height: 100px;
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.calendar-day.today {
  background-color: #f5a623;
  color: white;
}

.day-number {
  font-size: 14px;
  margin-bottom: 5px;
}

.events {
  flex-grow: 1;
  overflow-y: auto;
}

.event-buttons {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.event-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.event-button:hover {
  background-color: #388e3c;
}

.exercise-video-list {
  text-align: center;
  margin: 30px 0;
}

.intro-text {
  font-size: 1.5rem;
  color: #FFFF;
  margin-bottom: 20px;
  font-weight: bold;
}

.video-list {
  display: flex;
  flex-wrap: wrap; /* 줄이 넘치면 다음 줄로 배치 */
  gap: 20px; /* 비디오 카드 사이 간격 설정 */
  justify-content: center; /* 비디오들을 중앙에 정렬 */
  padding: 0;
  list-style-type: none; /* 목록 스타일 제거 */
}

.video-container {
  position: relative;
  width: calc(33.333% - 20px); /* 각 비디오의 너비를 3등분 */
  max-width: 350px; /* 비디오 카드의 최대 너비 설정 */
  border-radius: 10px; /* 카드 모서리를 둥글게 설정 */
  overflow: hidden; /* 카드 경계 밖의 요소 숨기기 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* 그림자 추가하여 입체감 부여 */
  transition: transform 0.3s, box-shadow 0.3s; /* 호버 시 효과 추가 */
}

.video-container:hover {
  transform: translateY(-10px); /* 마우스를 올렸을 때 살짝 올라가는 효과 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4); /* 마우스를 올렸을 때 그림자 강조 */
}

.video-link {
  text-decoration: none;
}

.video-frame {
  width: 100%;
  height: auto; /* 이미지 비율 유지하여 전체가 보이도록 설정 */
  border: none;
  border-radius: 10px 10px 0 0; /* 상단 모서리를 둥글게 설정 */
  display: block;
}

.click-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent; /* 투명 레이어 */
  cursor: pointer; /* 클릭 가능한 느낌 제공 */
}

.category-thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #FFC300; /* 노란색 테두리 추가 */
}
</style>
