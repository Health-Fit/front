<template>
    <div class="video-view-container">
      <!-- 유튜브 플레이어 -->
      <div class="video-player">
        <iframe
          :src="video.url"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="video-frame"
        ></iframe>
      </div>
  
      <!-- 비디오 정보 -->
      <div class="video-info">
        <h2 class="video-title">{{ video.title }}</h2>
        <div class="video-details">
          <p>채널 명: <strong>{{ video.channel }}</strong></p>
          <p>조회수: <strong>{{ video.views }}</strong> · 업로드된날짜: <strong>{{ video.uploaded }}</strong></p>
        </div>
  
        <!-- 비디오 설명 -->
        <div class="description">
          <h3>설명</h3>
          <p>{{ video.description }}</p>
        </div>
      </div>
    </div>
  
    <!-- 리뷰 정보 화면 -->
    <Review :videoId="video.id" />
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useVideoStore } from '@/stores/video'; 
  import Review from '@/components/videos/Review.vue';
  
  const videoStore = useVideoStore();
  
  const route = useRoute();
  const videoId = route.params.id;
  
  const video = ref({});
  
  onMounted(() => {
    video.value = videoStore.getVideoById(parseInt(videoId));
  });
  </script>
  
  <style scoped>
  .video-view-container {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: center;
    padding: 30px;
  }
  
  .video-player {
    flex: 2;
    max-width: 800px;
    background-color: #000;
    border-radius: 8px;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  .video-frame {
    width: 100%;
    height: 450px;
    border-radius: 8px;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
  }
  
  .video-info {
    flex: 1;
    max-width: 350px;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
  }
  
  .video-info:hover {
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
  }
  
  .video-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }
  
  .video-details {
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
  }
  
  .description {
    font-size: 16px;
    color: #333;
  }
  
  .description h3 {
    font-size: 18px;
    color: #333;
    margin-bottom: 10px;
  }
  
  .description p {
    line-height: 1.6;
    color: #555;
  }
  
  @media (max-width: 768px) {
    .video-view-container {
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
  
    .video-player {
      max-width: 100%;
    }
  
    .video-info {
      max-width: 100%;
      padding: 15px;
    }
  }
  </style>
  