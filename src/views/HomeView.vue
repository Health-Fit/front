<template>
    <div class="home-container">
      <h2>추천 영상</h2>

      <ExerciseMap>맵</ExerciseMap>

      <div class="filter-options">
        <div class="filter-group">
          <label for="sort">정렬:</label>
          <select id="sort" v-model="selectedSort" @change="applyFilters">
            <option value="all">전체</option>
            <option value="mostViews">조회수 높은 순</option>
            <option value="leastViews">조회수 낮은 순</option>
          </select>
        </div>
  
        <div class="filter-group">
          <label for="category">카테고리:</label>
          <select id="category" v-model="selectedCategory" @change="applyFilters">
            <option value="all">모든 카테고리</option>
            <option value="whole">전신운동</option>
            <option value="low">하체</option>
            <option value="up">상체</option>
          </select>
        </div>
      </div>
  
      <div class="video-grid">
        <div v-for="video in filteredVideos" :key="video.id" class="video-card">
          <RouterLink :to="{ name: 'video-view', params: { id: video.id } }">
            <div class="card-wrapper">
              <img :src="video.thumbnail" :alt="video.title" class="video-thumbnail" />
              <div class="video-info">
                <img :src="video.channelThumbnail" alt="Channel" class="channel-thumbnail" />
                <div class="video-details">
                  <p class="video-title">{{ video.title }}</p>
                  <p class="video-channel">{{ video.channel }}</p>
                  <p class="video-stats">{{ video.views }} views · {{ video.uploaded }}</p>
                </div>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  import { useVideoStore } from '@/stores/video'; 
  import ExerciseMap from '@/components/map/ExerciseMap.vue';
  
  const videoStore = useVideoStore();
  
  
  const selectedSort = ref('all');
  const selectedCategory = ref('all');
  
  
  const filteredVideos = computed(() => {
    let sortedVideos = [...videoStore.videos];
  
    
    if (selectedCategory.value !== 'all') {
      sortedVideos = sortedVideos.filter(video => video.category === selectedCategory.value);
    }
  
    
    if (selectedSort.value === 'mostViews') {
      sortedVideos.sort((a, b) => b.views - a.views);
    } else if (selectedSort.value === 'leastViews') {
      sortedVideos.sort((a, b) => a.views - b.views);
    }
  
    return sortedVideos;
  });
  
  
  const applyFilters = () => {
    
  };
  </script>
  
  <style scoped>
  .home-container {
    padding: 20px;
  }
  
  h2 {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
  }
  
  .filter-options {
    display: flex;
    gap: 30px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .filter-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .filter-options label {
    font-size: 16px;
    color: #444;
  }
  
  .filter-options select {
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #ddd;
    background-color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .filter-options select:hover {
    background-color: #f1f1f1;
  }
  
  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .video-card {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: transform 0.3s ease;
    height: 380px; 
  }
  
  .video-card:hover {
    transform: scale(1.05);
  }
  
  .card-wrapper {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .card-wrapper:hover {
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
  }
  
  .video-thumbnail {
    width: 100%;
    height: auto;
    border-bottom: 1px solid #ddd;
  }
  
  .video-info {
    display: flex;
    padding: 10px 15px;
    flex: 1;
    justify-content: space-between; 
  }
  
  .channel-thumbnail {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .video-details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
  }
  
  .video-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
    line-height: 1.3;
    overflow: hidden; 
    white-space: nowrap; 
    text-overflow: ellipsis; 
  }
  
  .video-channel {
    font-size: 14px;
    color: #555;
  }
  
  .video-stats {
    font-size: 13px;
    color: #888;
  }
  </style>
  