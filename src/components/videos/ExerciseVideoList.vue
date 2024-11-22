<template>
    <div>
        <h2>관련 추천 영상</h2>
        <ul>
            <li v-for="video in videoStore.videos" :key="video.id" class="video-container">
                <a @click.prevent="goToVideo(video.id)" href="#">
                    <iframe :src="videoStore.getThumbnailUrl(video.url)" frameborder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
                        class="video-frame"></iframe>
                    <div class="click-overlay"></div>
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useVideoStore } from '@/stores/video';
import { useRouter } from 'vue-router';

const videoStore = useVideoStore();
const router = useRouter();

onMounted(() => {
    videoStore.getVideos(null, null);
})

const goToVideo = async (id) => {
    console.log('Navigating to video ID:', id); // 디버깅용 로그
    router.push({ name: 'video-view', params: { id } });
};

</script>

<style scoped>
.video-container {
    position: relative;
}

.video-frame {
    width: 100%;
    height: auto;
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