import { createRouter, createWebHistory } from 'vue-router'
import GameRoutes from './gameRoutes'
console.log(GameRoutes)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/IndexHome.vue')
    },
    {
      path: '/algorithm',
      name: 'algorithm',
      component: () => import('../views/algorithm/algorithmIndex.vue')
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/blog/BlogIndex.vue')
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/views/game/GameIndex.vue')
    },
    {
      path: '/proj',
      name: 'proj',
      component: () => import('../views/proj/ProjIndex.vue')
    },
    {
      path: '/tools',
      name: 'tools',
      component: () => import('../views/tools/ToolsIndex.vue')
    },
    ...GameRoutes
  ]
})

export default router
