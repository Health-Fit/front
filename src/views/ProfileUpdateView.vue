<template>
    <div class="edit-member">
        <h2>회원정보 수정</h2>

        <div class="form-card">
            <div class="form-group">
                <label for="nickname">Nickname</label>
                <input type="text" id="nickname" v-model="updatedMember.nickname" :placeholder="member.nickname" />
            </div>

            <div class="form-group">
                <label for="tel">Tel 📞</label>
                <input type="text" id="tel" v-model="updatedMember.tel" :placeholder="member.tel" />
            </div>

            <div class="form-group">
                <label for="profileImg">Profile Img</label>
                <input type="text" id="profileImg" v-model="updatedMember.profileImg" :placeholder="member.profileImg" />
            </div>

            <div class="form-group">
                <label for="descript">당신을 소개해 주세요!</label>
                <textarea id="descript" v-model="updatedMember.descript" :placeholder="member.descript"></textarea>
            </div>

            <button @click="onUpdateMember" class="update-button">수정하기</button>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const { member, updateMember } = userStore;
const router = useRouter();

const updatedMember = ref({
    nickname: member.nickname,
    tel: member.tel,
    profileImg: member.profileImg,
    descript: member.descript,
});

const onUpdateMember = async () => {
    await updateMember(updatedMember.value);
    router.replace({ name: 'home' });
    await nextTick();
    alert('회원 정보가 수정되었습니다');
};
</script>

<style scoped>
.edit-member {
    max-width: 600px;
    margin: 50px auto;
    padding: 20px;
    text-align: center;
}

h2 {
    color: #FFC300;
    font-weight: bold;
    margin-bottom: 20px;
}

.form-card {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 카드 모양과 그림자 추가하여 입체감 부여 */
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #555; /* 레이블 색상을 짙은 회색으로 변경하여 가독성 개선 */
}

input,
textarea {
    width: 100%;
    padding: 12px;
    border-radius: 8px; /* 입력 필드의 모서리를 둥글게 설정 */
    border: 1px solid #ddd;
    box-sizing: border-box;
    font-size: 1rem;
}

input:focus,
textarea:focus {
    outline: none;
    border-color: #007bff; /* 포커스 시 파란색 테두리 강조 */
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.update-button {
    padding: 15px 25px;
    background-color: #007bff;
    color: #ffffff;
    border: none;
    border-radius: 8px; /* 버튼의 모서리를 둥글게 설정 */
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s; /* 호버 및 클릭 시 효과 추가 */
}

.update-button:hover {
    background-color: #FFC300; /* 마우스를 올렸을 때 더 어두운 파란색으로 변경 */
}

.update-button:active {
    transform: scale(0.98); /* 클릭 시 약간 작아지는 효과 */
}
</style>
