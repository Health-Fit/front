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
                    :class="{ selected: selectedVideos.includes(video) }"
                    @click="toggleVideoSelection(video)">
                    <img :src="getThumbnailUrl(video.url)" alt="영상 썸네일" class="video-thumbnail" />
                    <p>{{ video.title }}</p>
                </div>
            </div>
        </div>

        <button @click="onSetupMember">완료</button>
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
const { getExampleVideos, exampleVideos, getThumbnailUrl } = videoStore;

const signupInfo = ref({
    nickname: '',
    categoryIds: [],
});

const selectedVideos = ref([]);

onMounted(async () => {
    await getExampleVideos();
    console.log(selectedVideos.value)
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

    console.log("카테고리 : " ,signupInfo.value.categoryIds)

    // 회원 정보 설정 후 홈 화면으로 이동
    await setupMember(signupInfo.value);
    router.replace({ name: 'home' });
};
</script>

<style scoped>
.setup-member {
    max-width: 600px;
    margin: 0 auto;
}

.form-group {
    margin-bottom: 16px;
}

label {
    display: block;
    margin-bottom: 4px;
}

input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

.videos {
    margin-bottom: 20px;
}

.video-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.video-item {
    width: 150px;
    padding: 10px;
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 8px;
    text-align: center;
    transition: border-color 0.3s;
}

.video-item.selected {
    border-color: #007bff;
}

.video-thumbnail {
    width: 100%;
    border-radius: 8px;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>
