<template>
    <div class="edit-member">
        <h2>회원정보 수정</h2>

        <div class="form-group">
            <label for="nickname">닉네임</label>
            <input type="text" id="nickname" v-model="updatedMember.nickname" :placeholder="member.nickname" />
        </div>

        <div class="form-group">
            <label for="tel">전화번호</label>
            <input type="text" id="tel" v-model="updatedMember.tel" :placeholder="member.tel" />
        </div>

        <div class="form-group">
            <label for="profileImg">프로필</label>
            <input type="text" id="profileImg" v-model="updatedMember.profileImg" :placeholder="member.profileImg" />
        </div>

        <div class="form-group">
            <label for="descript">소개</label>
            <textarea id="descript" v-model="updatedMember.descript" :placeholder="member.descript"></textarea>
        </div>

        <button @click="onUpdateMember">수정하기</button>
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
    max-width: 500px;
    margin: 0 auto;
}

.form-group {
    margin-bottom: 16px;
}

label {
    display: block;
    margin-bottom: 4px;
}

input,
textarea {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
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