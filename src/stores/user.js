import { ref } from 'vue';
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
  
      // 상태 갱신
      isLoggedIn.value = true;
      member.value = {
        id: memberData.id,
        name: memberData.name,
        nickname: memberData.nickname,
        gender: memberData.gender,
        profileImg: memberData.profileImg,
        birth: memberData.birth,
        tel: memberData.tel,
      };
  
      // 홈 화면으로 이동
      router.replace({ name: 'home' });
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

        isLoggedIn.value = false;

        router.replace({ name: 'home' });
      })
      .catch((error) => {
        console.error('로그아웃 실패: ', error);
      });
  };

  return { isLoggedIn, member, loginWithKakao, getKakaoToken, loginWithNaver, loginWithGoogle, logout };
});
