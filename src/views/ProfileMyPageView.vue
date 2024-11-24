<template>
    <div>
      <h1>마이 페이지</h1>
  
      <!-- 달력 생성 -->
      <div class="calendar">
        <div class="calendar-header">
          <button @click="changeMonth(-1)">◀</button>
          <h2>{{ monthName }} {{ year }}</h2>
          <button @click="changeMonth(1)">▶</button>
        </div>
  
        <div class="calendar-grid">
          <!-- 각 날짜 생성 -->
          <div
            v-for="day in daysInMonth"
            :key="day.date"
            class="calendar-day"
            :class="{ 'today': isToday(day), 'has-events': hasEvents(day) }"
          >
            <!-- 날짜 숫자 -->
            <span class="day-number">{{ day.date }}</span>
            <br>
            <!-- 일정을 나타내는 버튼들 -->
            <div class="events">
              <div class="event-buttons">
                <button
                  v-for="(event, index) in getEventsForDay(day)"
                  :key="index"
                  class="event-button"
                  @click.stop="showEventDetails(event)"
                >
                  {{ event.title }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 선택한 일정 세부 사항 -->
      <div v-if="selectedEvent" class="event-details">
        <h3>{{ selectedEvent.title }} 일정 세부 사항</h3>
        <p><strong>내용:</strong> {{ selectedEvent.description }}</p>
        <p><strong>시간:</strong> {{ selectedEvent.time }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  // 현재 월과 연도
  const currentDate = ref(new Date());
  const selectedDay = ref(null);
  const selectedEvent = ref(null);
  
  // 월 변경 함수
  const changeMonth = (delta) => {
    const newDate = new Date(currentDate.value);
    newDate.setMonth(newDate.getMonth() + delta);
    currentDate.value = newDate;
  };
  
  // 날짜가 오늘인지 확인하는 함수
  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day.date && today.getMonth() === day.month && today.getFullYear() === day.year;
  };
  
  // 달력의 날짜를 생성하는 함수
  const daysInMonth = computed(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
  
    const days = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: i,
        month: month,
        year: year,
        dayOfWeek: new Date(year, month, i).getDay(),
      });
    }
    return days;
  });
  
  // 날짜별 이벤트 저장
  const events = ref({
    // 예시로 일정 추가 (여기서는 하드코딩된 일정입니다)
    '2024-11-23': [
      { title: '운동', description: '헬스장 가기', time: '10:00' },
      { title: '회의', description: '팀 미팅', time: '14:00' },
      { title: '점심', description: '식사 시간', time: '12:00' },
      { title: '커피타임', description: '친구와 커피', time: '16:00' },
    ],
    '2024-11-24': [
      { title: '데이트', description: '영화 보기', time: '18:00' },
    ],
  });
  
  // 선택된 날짜를 설정하는 함수
  const selectDay = (day) => {
    selectedDay.value = day;
    selectedEvent.value = null;  // 새 날짜를 선택하면 이전에 선택된 이벤트 초기화
  };
  
  // 해당 날짜에 일정을 표시할지 여부
  const hasEvents = (day) => {
    const key = `${day.year}-${day.month + 1}-${day.date}`;
    return events.value[key] && events.value[key].length > 0;
  };
  
  // 선택된 날짜의 일정을 가져오는 함수
  const getEventsForDay = (day) => {
    const key = `${day.year}-${day.month + 1}-${day.date}`;
    return events.value[key] || [];
  };
  
  // 클릭한 일정의 세부 사항을 보여주는 함수
  const showEventDetails = (event) => {
    selectedEvent.value = event;
  };
  
  // 달의 이름을 계산하는 computed 속성
  const monthName = computed(() => {
    const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    return months[currentDate.value.getMonth()];
  });
  
  // 연도 계산
  const year = computed(() => currentDate.value.getFullYear());
  </script>
  
  <style scoped>
  /* 기본 스타일 설정 */
  .calendar {
    margin: 20px;
  }
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
  }
  
  .calendar-day {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* 변경: 내용 왼쪽 정렬 */
    padding: 8px;
    border: 1px solid #ddd;
    cursor: pointer;
    position: relative;
    height: 120px; /* 날짜 영역의 고정 크기 */
    overflow: hidden;
    user-select: none; /* 날짜 클릭 시 텍스트 선택 방지 */
  }
  
  .calendar-day.today {
    background-color: #f5a623;
    color: white;
  }
  
  .day-number {
    font-size: 14px;
    color: #888;
    margin-bottom: 5px;
    position: absolute; /* 날짜 숫자 위치 변경 */
    top: 5px;
    left: 5px;
  }
  
  .events {
    flex-grow: 1;
    overflow-y: auto; /* 스크롤 가능하도록 설정 */
    max-height: 70px; /* 버튼 영역 고정 높이 설정 */
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
    cursor: pointer;
    font-size: 14px;
  }
  
  .event-button:hover {
    background-color: #45a049;
  }
  
  .event-details {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  /* 마우스 커서 변경 */
  .calendar-day:hover {
    cursor: default;
  }
  
  </style>
  