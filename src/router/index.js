import Login from '@/components/user/Login.vue'
import Profile from '@/components/user/Profile.vue'
import KakaoRedirect from '@/components/user/redirect/KakaoRedirect.vue'
import ExerciseMap from '@/components/map/ExerciseMap.vue'
import HomeView from '@/views/HomeView.vue'
import VideoView from '@/views/VideoView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/video/:id',
      name: 'video-view',
      component: VideoView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
    },
    {
      path: '/kakao/redirect',
      name: 'kakaoRedirect',
      component: KakaoRedirect,
    },
    {
      path: '/map',
      name: 'map',
      component: ExerciseMap,
    },
  ],
})

export default router
