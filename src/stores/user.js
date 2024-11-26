import { ref, onMounted } from 'vue';
import { defineStore } from 'pinia';
import apiClient from './apiClient';
import router from '@/router';

export const useUserStore = defineStore('user', () => {

  const isLoggedIn = ref(false);

  const member = ref({
    id: '',
    name: '',
    nickname: '',
    gender: '',
    profileImg: '',
    birth: '',
    tel: '',
    descript: ''
  });

  // 페이지 새로고침 시 로그인 상태 복원
  onMounted(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');
    if (refreshToken && accessToken) {
      isLoggedIn.value = true;

      const memberData = JSON.parse(localStorage.getItem('member'));
      if (memberData) {
        member.value = memberData;

        // 프로필 이미지가 없거나 잘못된 경우 기본 이미지 설정
        if (!member.value.profileImg) {
          member.value.profileImg = '/path/to/default/profile/image.png'; // 기본 이미지 경로 설정
        }
      }
    }
  });

  // 카카오 로그인 요청 (리다이렉트)
  const loginWithKakao = function () {
    const clientId = '170528f8e158c67508de4f554e7c16b3';
    const redirectUri = 'http://localhost:5173/kakao/redirect';
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

    window.location.href = kakaoAuthUrl;
  };

  const getKakaoToken = async function (code) {
    try {
      // 백엔드로 code를 GET 요청 (쿼리 파라미터로 전달)
      const response = await apiClient.get(`/auth/login/kakao?code=${code}`);

      // 응답에서 JWT 및 사용자 정보 추출
      const { jwt, member: memberData } = response.data;
      const { refreshToken, accessToken } = jwt;

      // 로컬스토리지에 토큰 저장
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('member', JSON.stringify(memberData));

      // 상태 갱신
      isLoggedIn.value = true;

      member.value = {
        id: memberData.id,
        name: memberData.name,
        nickname: memberData.nickname,
        descript: memberData.descript,
        gender: memberData.gender,
        profileImg: memberData.profileImg,
        birth: memberData.birth,
        tel: memberData.tel,
      };

      if (response.status === 200) {
        // 로그인이면 -> 홈 화면으로 이동
        router.replace({ name: 'home' });
      } else if (response.status === 201) {
        // 회원가입이면 -> 정보 입력창으로 이동
        router.replace({ name: 'signup' });
      }

    } catch (error) {
      console.error('카카오 토큰 처리 실패: ', error);
      // 에러 발생 시 로그인 페이지로 리다이렉트
      router.replace({ name: 'login' });
    }
  };

  const loginWithNaver = function () { };

  const loginWithGoogle = function () { };

  const logout = function () {
    apiClient.post('/auth/logout')
      .then(() => {
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('member');

        isLoggedIn.value = false;

        router.replace({ name: 'home' });
      })
      .catch((error) => {
        console.error('로그아웃 실패: ', error);
      });
  };

  const updateMember = async function (updatedMember) {
    try {
      const response = await apiClient.put('/members', updatedMember);

      if (response.status === 200) {
        member.value.nickname = updatedMember.nickname;
        member.value.tel = updatedMember.tel;
        member.value.profileImg = updatedMember.profileImg;
        member.value.descript = updatedMember.descript;
      }
    } catch (error) {
      console.error('사용자 정보 업데이트 실패 : ', error);
    }
  };

  const setupMember = async function (signupInfo) {
    await apiClient.post('/members', signupInfo);
    member.value.nickname = signupInfo.nickname;
  };

  return { isLoggedIn, member, loginWithKakao, getKakaoToken, loginWithNaver, loginWithGoogle, logout, updateMember, setupMember };
});
