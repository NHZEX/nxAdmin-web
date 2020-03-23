import admin from './modules/admin'

// 菜单 侧边栏
export const menuAside = [
  { path: '/index', title: '首页', icon: 'home' },
  ...admin,
]

// 菜单 顶栏
export const menuHeader = [
  {
    path: '/index',
    title: '首页',
    icon: 'home',
  },
]
