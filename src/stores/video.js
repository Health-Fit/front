import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useVideoStore = defineStore('video', () => {
  
  const videos = ref([
    {
      id: 1,
      title: '전신 다이어트 최고의 운동[칼소폭 마라맛🔥]',
      thumbnail: 'https://img.youtube.com/vi/F-Jd4kI6rdM/maxresdefault.jpg',
      url: 'https://www.youtube.com/embed/F-Jd4kI6rdM',
      channel: 'Thankyou BUBU',
      channelThumbnail: 'https://yt3.ggpht.com/P394VYIT9aVNpkVsJYRUfLHrnDRdCUDwMh1U1oBgPUAA7_h1eQq7oUDQ6azBV2oJj2dCtlohaQ=s48-c-k-c0x00ffffff-no-rj',
      views: 1200000,
      uploaded: '3 days ago',
      category: 'whole',
    },
    {
      id: 2,
      title: '하체 지방 완전히 태우는 10분 스쿼트 운동 - 영상 하나로 운동 끝! 힙업, 하체 군살 제거, 전신순환 (Squat workout 10min)',
      thumbnail: 'https://img.youtube.com/vi/8a9M0lNY37s/maxresdefault.jpg',
      url: 'https://www.youtube.com/embed/8a9M0lNY37s',
      channel: '빵느',
      channelThumbnail: 'https://yt3.ggpht.com/896puFgD8ylez1LkVtwRVCHS05g5Heg-BGn23kHFnJMUAXQXTKXSzNdzuvxYj_BmmxD64QolaSs=s48-c-k-c0x00ffffff-no-rj',
      views: 500000,
      uploaded: '1 week ago',
      category: 'low',
    },
    {
      id: 3,
      title: '하루 한 번! 꼭 해야하는 15분 기본 덤벨운동 홈트(상체편)',
      thumbnail: 'https://img.youtube.com/vi/9zLD6cSgHdY/maxresdefault.jpg',
      url: 'https://www.youtube.com/embed/9zLD6cSgHdY',
      channel: '빵느',
      channelThumbnail: 'https://yt3.ggpht.com/896puFgD8ylez1LkVtwRVCHS05g5Heg-BGn23kHFnJMUAXQXTKXSzNdzuvxYj_BmmxD64QolaSs=s48-c-k-c0x00ffffff-no-rj',
      views: 300000,
      uploaded: '2 weeks ago',
      category: 'up',
    },
  ]);

  const getVideoById = (videoId) => {
    return videos.value.find(video => video.id === videoId);
  };

  return { videos, getVideoById };
});
