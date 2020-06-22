// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// store
import store from '@/store/index'

// iviewui
import iviewMini from '@/plugin/iview/index'

// 菜单和路由设置
import router from './router'
import { menuAside } from '@/menu'
import { frameInRoutes } from '@/router/routes'

// auth
import auth, { isLogin } from '@/plugin/auth'

// dayjs
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

import fortawesome from '@/plugin/fortawesome/index'

// 核心插件
Vue.use(d2Admin)
// 注册 iview
Vue.use(iviewMini)
// 注册权限
Vue.use(auth)
// FortAwesome
Vue.use(fortawesome)

// fontawesome-5 (async load)
// import('@/plugin/fortawesome/async').then(module => {
//   module.default()
// })

// dayjs
dayjs.extend(relativeTime)
dayjs.locale(navigator.language.toLowerCase())

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created () {
    // 初始化机器码
    this.$store.dispatch('d2admin/config/loadMachineCode')
    // 处理路由 得到每一级的路由设置
    this.$store.commit('d2admin/page/init', frameInRoutes)
    // 设置顶栏菜单
    this.$store.commit('d2admin/menu/headerSet', [])
    // 设置侧边栏菜单
    this.$store.commit('d2admin/menu/asideSet', menuAside)
    // 初始化菜单搜索功能
    this.$store.commit('d2admin/search/init', menuAside)
  },
  async mounted () {
    // 加载系统信息
    this.$store.dispatch('d2admin/config/load')
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 判断是否已经登录 若已登录则refresh用户数据，重新加载
    if (await isLogin(true)) {
      await this.$store.dispatch('d2admin/account/load')
    }
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
  },
}).$mount('#app')
