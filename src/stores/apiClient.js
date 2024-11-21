import axios from 'axios';

// Axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// 요청 인터셉터: accessToken을 Authorization 헤더에 추가
apiClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken'); // 저장된 accessToken 가져오기
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: accessToken 만료 시 refreshToken으로 새 토큰 요청
apiClient.interceptors.response.use(
    (response) => {
        return response; // 성공 응답은 그대로 반환
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            // accessToken 만료 시 처리
            const originalRequest = error.config;
            try {
                const refreshToken = localStorage.getItem('refreshToken'); // 저장된 refreshToken 가져오기
                const { data } = await axios.post('/auth/access-token', { refreshToken });

                // 새로운 accessToken을 저장 및 헤더에 추가
                localStorage.setItem('accessToken', data.accessToken);
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

                // 실패했던 요청 재시도
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error('토큰 갱신 실패:', refreshError);
                // refreshToken도 만료된 경우 로그아웃 처리
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient; // apiClient를 내보내기
