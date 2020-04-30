import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
// import store from '@/store'
import NProgress from 'nprogress' // 进度条
// import 'nprogress/nprogress.css' // 进度条样式
// import { Message } from 'element-ui'

Vue.use(Router)

const WHILE_LIST = ['/login', '/', '/about', '/home'] // 不重定向白名单
const ROUTER = [
  // 处理404
  // {
  //   path: '/404',
  //   component: () => import('@/views/404')
  // },
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  // {
  //   path: '*',
  //   redirect: '/404'
  // }
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/home/index.vue')
  }
]

const GET_TOKEN = false

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: ROUTER
})

router.beforeEach((to, from, next) => {
  console.log(to)
  NProgress.start()
  if (GET_TOKEN) {
    if (to.path === '/login') {
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      // 获取用户信息
      // store.dispatch('GetUserInfo').then(res => {
      //   next()
      // }).catch(err => {
      //   store.dispatch('FedLogOut').then(() => {
      //     Message.error('拉取用户信息失败，请重新登录！' + err)
      //     next({
      //       path: '/'
      //     })
      //   })
      // })
      next({
        path: '/'
      })
    }
  } else {
    // 白名单
    if (WHILE_LIST.includes(to.path)) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 结束Progress
  NProgress.done()
})

export default router
