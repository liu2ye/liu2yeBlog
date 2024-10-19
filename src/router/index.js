import { createRouter, createWebHistory } from 'vue-router'
import AlgorithmRouters from './algorithmRouters'
import GameRoutes from './gameRoutes'
import ToolsRoutes from './toolsRoutes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/IndexHome.vue')
    },
    {
      path: '/md/:fileName',
      component: () => import('@/components/Markdown.vue'),
      props: true
    },
    {
      path: '/algorithm',
      name: 'algorithmHome',
      component: () => import('../views/algorithm/algorithmIndex.vue')
    },
    {
      path: '/blog',
      name: 'blogHome',
      component: () => import('../views/blog/BlogIndex.vue')
    },
    {
      path: '/blog/:blogPath',
      name: 'blogContext',
      props: true,
      component: () => import('../views/blog/Blog.vue')
    },
    {
      path: '/game',
      name: 'gameHome',
      component: () => import('@/views/game/GameIndex.vue')
    },
    {
      path: '/proj',
      name: 'projHome',
      component: () => import('../views/proj/ProjIndex.vue')
    },
    {
      path: '/tools',
      name: 'toolsHome',
      component: () => import('../views/tools/ToolsIndex.vue')
    },
    ...AlgorithmRouters,
    ...GameRoutes,
    ...ToolsRoutes,
    {
      path: '/cv',
      name: 'cv',
      component: () => import('@/views/CV.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue')
    }
  ]
})

export default router
