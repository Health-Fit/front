<template>
  <div>
    <h1 class="main-header">마이 페이지</h1>

    <!-- 달력 생성 -->
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
          <!-- 날짜 숫자 -->
          <span class="day-number">{{ day.date }}</span>
          <!-- 일정 버튼 -->
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

    <!-- 선택한 일정 세부 사항 -->
    <div v-if="groupStore.selectedMyGroup" class="event-details">
      <h1 class="main-header">그룹 정보</h1>
      <div class="group-info">
        <img :src="categoryImgUrl" class="category-thumbnail" />
        <div class="group-info-text">
          <p><strong>그룹 명 :</strong> {{ groupStore.selectedMyGroup.name }}</p>
          <p><strong>그룹 설명 :</strong> {{ groupStore.selectedMyGroup.descript }}</p>
          <div class="group-leader">
            <p><strong>그룹장 :</strong></p>
            <img :src="groupStore.selectedMyGroupLeader.profileImg" class="user-thumbnail" />
          </div>
          <div class="group-members">
            <p><strong>멤버 :</strong></p>
            <template v-if="groupStore.selectedMyGroupMembers.length > 0">
              <img v-for="member in groupStore.selectedMyGroupMembers" :src="member.profileImg" :key="member.id"
                class="user-thumbnail" />
            </template>
            <template v-else>
              <p>멤버 없음</p>
            </template>
          </div>
        </div>
      </div>
      <h3>채팅</h3>
      <div class="chat-section">
        <!-- 여기에 채팅 창이 들어갈 것임 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useGroupStore } from '@/stores/group';
import { useCategoryStore } from '@/stores/category';
import dayjs from 'dayjs';

const groupStore = useGroupStore();
const categoryStore = useCategoryStore();

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
  // 그룹 store에서 내 그룹에 관련된 정보를 선택함
  await groupStore.selectMyGroup(event.groupId);
  categoryImgUrl.value =
    '@/src/assets/' +
    categoryStore.getCategoryString(
      groupStore.selectedMyGroup.exerciseCategoryId
    ) +
    '.png';
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

// 그룹 데이터를 이벤트로 변환
onMounted(async () => {
  groupStore.selectedMyGroup = null;
  await groupStore.getMyGroups();
  await categoryStore.getCategories();

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
});
</script>

<style scoped>
.user-thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.calendar {
  margin: 20px;
  max-width: 800px;
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

.weekday {
  padding: 10px;
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

.calendar-day.sunday .day-number {
  color: red;
}

.calendar-day.saturday .day-number {
  color: blue;
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

.event-details {
  margin-top: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.group-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.group-info-text {
  color: #333;
}

.category-thumbnail {
  width: 50px;
  height: 50px;
}

.main-header {
  font-size: 2rem;
  color: #007bff;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}
</style>
