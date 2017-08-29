import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)

const router = new Router({
  hashbang: false, // 关闭hash模式
  history: true, // 开启html5 history模式
  linkActiveClass: 'active', // v-link激活时添加的class，默认是`v-link-active`
  routes
})

// router.map(routes)

router.beforeEach((to, from, next) => {
  console.log('---------> ' + to.path) // 每次调整路由时打印，便于调试
  next()
})

export default router
