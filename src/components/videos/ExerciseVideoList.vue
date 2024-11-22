<template>
    <div>
        <h2>추천 영상</h2>
        <div v-if="isLoading">Loading videos...</div>
        <ul v-else>
            <li v-for="video in videos" :key="video.id">
                <iframe :src="video.url" frameborder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
                    class="video-frame"></iframe>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useVideoStore } from '@/stores/video';

const store = useVideoStore();

const thumnail = ref("https://img.youtube.com/vi/")
const extension = ref('/maxresdefault.jpg')

// 상태 관리
const videos = ref([]); // 비디오 리스트를 저장할 상태
const isLoading = ref(true); // 로딩 상태

// 컴포넌트가 마운트될 때 데이터 가져오기
const fetchVideos = async () => {
    try {
        const result = await store.getVideos(null, null); // 예시로 categoryId = 1, searchValue = '운동'
        videos.value = result; // 받아온 데이터를 상태에 저장
        console.log(videos);

    } catch (error) {
        console.error('Failed to fetch videos:', error);
    } finally {
        isLoading.value = false; // 로딩 상태 종료
    }
};

// 컴포넌트 마운트 시 호출
onMounted(fetchVideos);
</script>

<style scoped>
h2 {
    font-size: 24px;
    margin-bottom: 16px;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    border: 1px solid #ddd;
    padding: 8px;
    margin-bottom: 8px;
}

h3 {
    font-size: 18px;
    margin: 0;
}

p {
    color: #666;
}
</style>