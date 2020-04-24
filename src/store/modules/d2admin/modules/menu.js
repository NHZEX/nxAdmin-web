// 设置文件
import setting from '@/setting.js'

import { filterMenu } from '@/plugin/auth'

export default {
  namespaced: true,
  state: {
    // 顶栏菜单
    header: [],
    // 侧栏菜单
    aside: [],
    // 侧边栏收缩
    asideCollapse: setting.menu.asideCollapse
  },
  actions: {
    /**
     * 设置侧边栏展开或者收缩
     * @param {Object} context
     * @param {Boolean} collapse is collapse
     */
    async asideCollapseSet ({ state, dispatch }, collapse) {
      // store 赋值
      state.asideCollapse = collapse
      // 持久化
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'menu.asideCollapse',
        value: state.asideCollapse,
        user: true
      }, { root: true })
    },
    /**
     * 切换侧边栏展开和收缩
     * @param {Object} context
     */
    async asideCollapseToggle ({ state, dispatch }) {
      // store 赋值
      state.asideCollapse = !state.asideCollapse
      // 持久化
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'menu.asideCollapse',
        value: state.asideCollapse,
        user: true
      }, { root: true })
    },
    /**
     * 从持久化数据读取侧边栏展开或者收缩
     * @param {Object} context
     */
    async asideCollapseLoad ({ state, dispatch }) {
      // store 赋值
      state.asideCollapse = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'menu.asideCollapse',
        defaultValue: setting.menu.asideCollapse,
        user: true
      }, { root: true })
    },
    /**
     * 从持久化数据读取侧边栏展开或者收缩
     * @param {Object} context
     */
    async filterMenu ({ state }) {
      state.aside = filterMenu(state.aside)
      state.header = filterMenu(state.header)
    }
  },
  mutations: {
    /**
     * @description 设置顶栏菜单
     * @param {Object} state state
     * @param {Array} menu menu setting
     */
    headerSet (state, menu) {
      // store 赋值
      state.header = filterMenu(menu)
    },
    /**
     * @description 设置侧边栏菜单
     * @param {Object} state state
     * @param {Array} menu menu setting
     */
    asideSet (state, menu) {
      // store 赋值
      state.aside = filterMenu(menu)
    }
  }
}
