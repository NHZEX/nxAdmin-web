import { uniqueId } from 'lodash'

import admin from './modules/admin'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children
      ? { children: supplementPath(e.children) }
      : {}
  }))
}

// 菜单 侧边栏
export const menuAside = supplementPath([
  { path: '/index', title: '首页', icon: 'home' },
  ...admin,
])

// 菜单 顶栏
export const menuHeader = supplementPath([
  {
    path: '/index',
    title: '首页',
    icon: 'home',
  },
])
