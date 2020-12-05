import { generateRouteMapping } from '@/plugin/auth'
import { ADMIN_USER_GENRE_DICT } from '@/store/constant'
import { cloneDeep, isEmpty } from 'lodash'

const DEFAULT_STATE_INFO = {
  name: '',
  permission: {},
  user: {
    id: 0,
    genre: 0,
    role_id: 0,
    username: '',
    nickname: '',
  }
}

export default {
  namespaced: true,
  state: {
    // 用户信息
    info: cloneDeep(DEFAULT_STATE_INFO),
    routeMapping: {},
  },
  getters: {
    isActivity: state => {
      return !isEmpty(state.info.user) && state.info.user.id > 0
    },
    isSuper: (state, getters) => {
      if (!getters.isActivity) {
        return null
      }
      return state.info.user.genre === ADMIN_USER_GENRE_DICT.SUPER_ADMIN
    },
    isAgent: (state, getters) => {
      if (!getters.isActivity) {
        return null
      }
      const genre = state.info.user.genre
      return genre === ADMIN_USER_GENRE_DICT.AGENT || genre === ADMIN_USER_GENRE_DICT.AGENT_SUB
    },
    isAgentRoot: (state, getters) => {
      if (!getters.isActivity) {
        return null
      }
      return state.info.user.genre === ADMIN_USER_GENRE_DICT.AGENT
    },
    accessAdmin: (state, getters) => {
      if (!getters.isActivity) {
        return null
      }
      return state.info.user.genre <= ADMIN_USER_GENRE_DICT.ADMIN
    },
  },
  actions: {
    async clean ({ dispatch }) {
      await dispatch('set', cloneDeep(DEFAULT_STATE_INFO))
    },
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
