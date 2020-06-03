import { generateRouteMapping } from '@/plugin/auth'

export default {
  namespaced: true,
  state: {
    // 用户信息
    info: {
      name: '',
      permission: {},
      recallerSign: '',
      user: {
        id: 0,
        genre: 0,
        role_id: 0,
      }
    },
    routeMapping: {},
  },
  actions: {
    /**
     * @description 设置用户数据
     * @param {Object} context
     * @param {*} info info
     */
    async set ({ state, dispatch }, info) {
      // store 赋值
      state.info = info
      // 持久化
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'user.info',
        value: info,
        user: true,
      }, { root: true })
    },
    /**
     * todo 刷新用户远程状态
     * @description 从数据库取用户数据
     * @param {Object} context
     */
    async load ({ state, dispatch }) {
      // store 赋值
      state.info = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'user.info',
        defaultValue: {},
        user: true,
      }, { root: true })

      await dispatch('updatePermission')
    },
    /**
     * 响应权限更改
     * @param state
     * @param dispatch
     */
    async updatePermission ({ state, dispatch }) {
      generateRouteMapping()
      await dispatch('d2admin/menu/filterMenu', null, { root: true })
    },
  },
}
