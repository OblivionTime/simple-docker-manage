/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-05-17 12:45:40
 * @LastEditors: solid
 * @LastEditTime: 2022-10-28 20:56:38
 */
import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'


/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    hidden: true,
    redirect: '/index',
    meta: { title: '首页', },
  },
  {
    path: '/index',
    component: () => import('@/views/List/index'),
    hidden: true,
    meta: { title: '首页', },
  },


  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
    meta: { title: '404' },
  },

  {
    path: '/home',
    component: Layout,
    redirect: '/home/index',
    meta: { title: '首页' },
    children: [
      {
        path: '/home/index',
        name: 'Index',
        component: () => import('@/views/Index/index'),
        meta: { title: '首页', icon: 'Docker' },

      },
    ]
  },

  {
    path: '/mirror',
    component: Layout,
    meta: { title: '镜像', icon: 'mirror' },
    children: [
      {
        path: '/mirror/index',
        name: 'mirror',
        component: () => import('@/views/Mirror/index'),
        meta: { title: '镜像', icon: 'mirror' },
        query: { hostname: store.getters.hostname }
      }

    ]
  },
  {
    path: '/container',
    component: Layout,
    meta: { title: '容器', icon: 'container' },
    children: [
      {
        path: '/container/index',
        name: 'container',
        component: () => import('@/views/Container/index'),
        meta: { title: '容器', icon: 'container' }
      }

    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true, meta: { title: '404' }, }
]

const createRouter = () => new Router({
  mode: 'hash', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
