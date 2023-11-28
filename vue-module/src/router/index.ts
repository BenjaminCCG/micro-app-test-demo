import { createWebHashHistory, createRouter } from 'vue-router';
import Home from '@/pages/home/index.vue';
import About from '@/pages/about/index.vue';
export const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
];
const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
