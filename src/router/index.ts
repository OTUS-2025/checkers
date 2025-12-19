import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../pages/WelcomePage.vue'),
      name: 'home',
    },
    {
      path: '/game',
      component: () => import('../pages/GamePage.vue'),
      name: 'game',
    },
  ],
})

export default router
