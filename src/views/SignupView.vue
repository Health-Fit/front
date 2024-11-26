<template>
    <div class="setup-member">
        <h2>만나서 반가워요!</h2>

        <div class="form-group">
            <label for="nickname">닉네임을 정해주세요</label>
            <input type="text" id="nickname" v-model="signupInfo.nickname" placeholder="닉네임을 입력하세요" />
        </div>

        <div class="videos">
            <h3>관심 있는 영상을 3개 선택해주세요</h3>
            <div class="video-list">
                <div v-for="video in exampleVideos" :key="video.id" class="video-item"
                    :class="{ selected: selectedVideos.includes(video) }" @click="toggleVideoSelection(video)">
                    <img :src="getThumbnailUrl(video.url)" alt="영상 썸네일" class="video-thumbnail" />
                    <p>{{ video.title }}</p>
                </div>
            </div>
        </div>

        <button @click="onSetupMember" class="complete-button">완료</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useVideoStore } from '@/stores/video';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const videoStore = useVideoStore();
const router = useRouter();

const { setupMember } = userStore;
const { getExampleVideos, getThumbnailUrl } = videoStore;

const signupInfo = ref({
    nickname: '',
    categoryIds: [],
});

const exampleVideos = ref([]);
const selectedVideos = ref([]);

onMounted(async () => {
    await getExampleVideos();
    exampleVideos.value = videoStore.exampleVideos;
});

const toggleVideoSelection = (video) => {
    const index = selectedVideos.value.indexOf(video);
    if (index > -1) {
        // 이미 선택된 영상이면 선택 해제
        selectedVideos.value.splice(index, 1);
    } else {
        // 최대 3개까지만 선택 가능
        if (selectedVideos.value.length < 3) {
            selectedVideos.value.push(video);
        } else {
            alert('최대 3개의 영상만 선택할 수 있습니다.');
        }
    }
};

const onSetupMember = async () => {
    if (selectedVideos.value.length < 3) {
        alert('관심 있는 영상을 최소 3개 선택해 주세요.');
        return;
    }

    // 선택된 영상들의 카테고리 중 중복 제거 후 설정
    signupInfo.value.categoryIds = [
        ...new Set(selectedVideos.value.flatMap((video) => video.categoryIds)),
    ];

    console.log("카테고리 : ", signupInfo.value.categoryIds)

    // 회원 정보 설정 후 홈 화면으로 이동
    await setupMember(signupInfo.value);
    router.replace({ name: 'home' });
};
</script>

<style scoped>
body {
    background-color: #f0f4f8;
    /* 페이지 전체 배경색을 밝게 설정 */
    font-family: Arial, sans-serif;
}

.setup-member {
    max-width: 700px;
    margin: 50px auto;
    padding: 30px;
    background-color: #e1e3e5;
    /* 배경을 밝은 회색으로 변경 */
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    text-align: center;
}

h2 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 24px;
}

label {
    display: block;
    margin-bottom: 8px;
    font-size: 1.1rem;
    color: #555;
}

input {
    width: 100%;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    box-sizing: border-box;
    transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus {
    border-color: #007bff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
    outline: none;
}

.videos {
    margin-bottom: 30px;
}

h3 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 20px;
}

.video-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

.video-item {
    width: 150px;
    padding: 15px;
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 12px;
    text-align: center;
    transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
    background-color: #fafafa;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.video-item.selected {
    border-color: #007bff;
    background-color: #e7f3ff;
    /* 선택된 비디오의 배경색을 변경하여 강조 */
    box-shadow: 0 8px 16px rgba(0, 123, 255, 0.1);
    /* 선택 시 그림자 강조 */
    transform: scale(1.05);
}

.video-thumbnail {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.video-item p {
    margin-top: 10px;
    font-size: 0.9rem;
    color: #333;
}

.complete-button {
    padding: 12px 30px;
    background-color: #007bff;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
}

.complete-button:hover {
    background-color: #0056b3;
    transform: translateY(-3px);
}

.complete-button:active {
    transform: translateY(0);
}

button:disabled {
    background-color: #bbb;
    cursor: not-allowed;
}
</style>
