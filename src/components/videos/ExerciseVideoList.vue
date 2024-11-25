<template>
    <div class="exercise-video-list">
        <p class="intro-text">친구들과 만나기 전 준비 운동 먼저 해봐요!</p>
        <ul class="video-list">
            <li v-for="video in videoStore.videos" :key="video.id" class="video-container">
                <a @click.prevent="goToVideo(video.id)" href="#" class="video-link">
                    <img :src="`https://img.youtube.com/vi/${video.url}/maxresdefault.jpg`" alt="Video Thumbnail" class="video-frame" />
                    <div class="click-overlay"></div>
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useVideoStore } from '@/stores/video';
import { useCategoryStore } from '@/stores/category';
import { useRouter } from 'vue-router';

const videoStore = useVideoStore();
const categoryStore = useCategoryStore();
const router = useRouter();

onMounted(() => {
    videoStore.getVideos(categoryStore.selectedCategoryId.value);
})

const goToVideo = async (id) => {
    router.push({ name: 'video-view', params: { id } });
};
</script>

<style scoped>
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
</style>
