import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

const REST_API_URL = 'http://localhost:8080/api/categories'; // REST API URL

export const useCategoryStore = defineStore('category', () => {
  // 상태 변수
  const categories = ref([]); // 카테고리 목록
  const isLoading = ref(false); // 로딩 상태
  const error = ref(null); // 에러 상태

  // 카테고리 데이터를 가져오는 함수
  const fetchCategories = () => {
    isLoading.value = true; // 로딩 시작
    error.value = null; // 에러 초기화

    // Axios를 활용한 GET 요청
    axios
      .get(REST_API_URL)
      .then((response) => {
        categories.value = response.data; // 성공적으로 데이터를 받아오면 저장
      })
      .catch((err) => {
        error.value = '데이터를 불러오는 데 실패했습니다.'; // 에러 발생 시 메시지 설정
        console.error(err);
      })
      .finally(() => {
        isLoading.value = false; // 로딩 종료
      });
  };

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
  };
});
