import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'
import util from '@/libs/util.js'

// 路由数据
import routes from './routes'

// 鉴权
import { needAuthorize, isLogin, canAccessRoute } from '@/plugin/auth/index'
import { Message } from 'element-ui'
import { hasOwnProperty } from '@/libs/util.common'

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes,
})

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
  await store.dispatch('d2admin/page/isLoaded')
  // 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
  await store.dispatch('d2admin/size/isLoaded')
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  // 认证缓存
  let isLoginCache = false
  // 验证当前路由所有的匹配模式
  if (to.name === 'login' && (isLoginCache = await isLogin(true))) {
    // 会话有效，回到上次页面
    await store.dispatch('d2admin/account/load')
    next(from.fullPath)
  } else if (!needAuthorize(to)) {
    // 该路由不需要任何验证
    next()
  } else if ((isLoginCache || await isLogin(true)) === false) {
    // 没有登录的时候跳转到登录界面
    // 携带上登陆成功之后需要跳转的页面完整路径
    next({
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    })
  } else if (canAccessRoute(to)) {
    // 该路由验证通过
    next()
  } else {
    // 该路由验证未通过，取消导航
    Message({
      message: '你没有获得此页面授权',
      type: 'warning',
      duration: 5 * 1000,
    })
    // 如果从登录页面进入且目标页面没有授权，则跳到主页
    if (await isLogin() && from.name === 'login') {
      next('/index')
      return
    } else {
      next(false)
    }
  }
  // https://github.com/d2-projects/d2-admin/issues/138
  NProgress.done()
})

router.afterEach(to => {
  // 进度条
  NProgress.done()

  // 是否使用D2导航管理
  if (!hasOwnProperty(to.meta, 'rawPage') || !to.meta.rawPage) {
    // 多页控制 打开新的页面
    store.dispatch('d2admin/page/open', to)
  }

  // 更改标题
  util.title(to.meta.title)
})

export default router
