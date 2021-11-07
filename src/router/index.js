import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../views/Layout.vue'
import { getSession, setSession } from '@/utils/storage'
import Message from '../utils/resetMessage'

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'newTask',
        meta: {
          title: 'one'
        },
        component: () => import('../views/NewTask.vue')
      },
      {
        path: '/personnel-approval',
        name: 'personnelApproval',
        meta: {
          title: 'two'
        },
        component: () => import('../views/PersonnelApproval.vue')
      },
      {
        path: '/my-task',
        name: 'myTask',
        meta: {
          title: 'three'
        },
        component: () => import('../views/MyTask.vue')
      },
      {
        path: '/history-record',
        name: 'historyRecord',
        meta: {
          title: 'fourth'
        },
        component: () => import('../views/HistoryRecord.vue')
      },
      {
        path: '/task-detail',
        name: 'taskDetail',
        meta: {
          title: 'detail'
        },
        component: () => import('../views/TaskDetail.vue')
      }
    ]
  },
  { path: '/403', name: '403', component: () => import('@/views/403.vue') },
  { path: '/404', name: '404', component: () => import('@/views/404.vue') },
  { path: '/:pathMatch(.*)', redirect: '/404' }
]

const router = createRouter({ history: createWebHashHistory(), routes })

router.beforeEach((to, from, next) => {
  next()
})
export default router
