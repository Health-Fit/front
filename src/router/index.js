import Login from '@/components/user/Login.vue'
import SignUp from '@/components/user/SignUp.vue'
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
      path:'/login',
      name:'login',
      component:Login,
    },
    {
      path:'/video/:id',
      name:'video-view',
      component:VideoView,
    },
    {
      path:'/signup',
      name:'signup',
      component:SignUp,
    },
  ],
})

export default router
