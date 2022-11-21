import '@/assets/style/tailwindcss/tailwindcss.css'
// Vue
import Vue from 'vue'
import { install } from 'vue-demi'
import i18n from './i18n'
import App from './App'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// store
import store from '@/store/index'

// vxe-table
import '@/plugin/vxe-table'

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

// autoUpdate
import autoUpdated from '@/plugin/autoUpdated/autoUpdated.js'

install()

// 首次加载必须重置
autoUpdated.resetStorage()

// 核心插件
Vue.use(d2Admin)
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
  async created () {
    autoUpdated.registerCheck()
    // 初始化机器码
    await this.$store.dispatch('d2admin/config/loadMachineCode')
    // 处理路由 得到每一级的路由设置
    await this.$store.commit('d2admin/page/init', frameInRoutes)
    // 设置顶栏菜单
    await this.$store.commit('d2admin/menu/headerSet', [])
    // 设置侧边栏菜单
    await this.$store.commit('d2admin/menu/asideSet', menuAside)
    // 初始化菜单搜索功能
    await this.$store.commit('d2admin/search/init', menuAside)
  },
  async mounted () {
    // 加载系统信息
    await this.$store.dispatch('d2admin/config/load')
    // 展示系统信息
    await this.$store.commit('d2admin/releases/versionShow')
    // 尝试刷新用户数据
    /**
     * todo 存在重复请求问题
     * 1. mounted 请求一次
     * 2. 路由守卫 请求一次
     */
    await isLogin(true)
    // 用户登录后从数据库加载一系列的设置
    await this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    await this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    await this.$store.dispatch('d2admin/fullscreen/listen')
  },
}).$mount('#app')
