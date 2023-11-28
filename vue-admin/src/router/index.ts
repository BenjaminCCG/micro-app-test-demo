import { createWebHistory, createRouter } from 'vue-router';
import Home from '@/pages/home/index.vue';
const router = createRouter({
  history: createWebHistory('/main-vite/'),
  routes: [
    {
      path: '/',
      redirect: '/app-vite'
    },
    {
      path: '/app-vite:page*',
      name: 'Home',
      component: Home
    }
  ]
});

export default router;
