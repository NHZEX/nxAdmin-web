import { Message, MessageBox } from 'element-ui'
import util from '@/libs/util.js'
import router from '@/router'
import { accountLogin, accountLogout, userInfo } from '@/api/sys.login'
import { hasOwnProperty } from '@/libs/util.common'

export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} context
     * @param {Object} payload token {String} Token
     * @param {Object} payload username {String} 用户账号
     * @param {Object} payload password {String} 密码
     * @param {Object} payload code {String} 验证码
     * @param {Object} payload lasting {Boolean} 记住我
     * @param {Object} payload route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    async login ({ dispatch }, {
      token,
      username = '',
      password = '',
      code = '',
      lasting = false,
    } = {}) {
      const res = await accountLogin(username, password, code, lasting, token)
      // 设置 cookie 一定要存 uuid 和 token 两个 cookie
      // 整个系统依赖这两个数据进行校验和存储
      // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
      // token 代表用户当前登录状态 建议在网络请求中携带 token
      // 如有必要 token 需要定时更新，默认保存一天
      util.cookies.set('uuid', res.uuid)
      util.cookies.set('token', res.token)
      // 刷新用户信息
      await dispatch('refresh', {
        recallerSign: res.recallerSign,
      })
      // 用户登录后从持久化数据加载一系列的设置
      await dispatch('load')
    },
    /**
     * @description 刷新用户信息
     * @param dispatch
     * @param rootState
     * @param payload
     * @return {Promise<unknown>}
     */
    async refresh ({ dispatch, rootState }, payload = {}) {
      const data = await userInfo()
      const user = rootState.d2admin.user
      // 查询用户数据
      if (!hasOwnProperty(payload, 'recallerSign') && user.info && user.info.recallerSign) {
        payload.recallerSign = user.info.recallerSign
      }
      // 设置 vuex 用户信息
      await dispatch('d2admin/user/set', {
        name: data.user.nickname,
        permission: data.permission,
        ...payload,
      }, { root: true })
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} context
     * @param {Object} payload confirm {Boolean} 是否需要确认
     */
    async logout ({ commit, dispatch }, { confirm = false } = {}) {
      /**
       * @description 注销
       */
      const logout = async function () {
        // 注销会话
        await accountLogout()
        // 删除cookie
        util.cookies.remove('token')
        util.cookies.remove('uuid')
        // 清空 vuex 用户信息
        await dispatch('d2admin/user/set', {}, { root: true })
        // 跳转路由
        await router.push({ name: 'login' })
      }
      // 判断是否需要确认
      if (confirm) {
        commit('d2admin/gray/set', true, { root: true })
        MessageBox.confirm('确定要注销当前用户吗', '注销用户', { type: 'warning', })
          .then(async () => {
            commit('d2admin/gray/set', false, { root: true })
            await logout()
          })
          .catch(() => {
            commit('d2admin/gray/set', false, { root: true })
            Message({ message: '取消注销操作' })
          })
      } else {
        await logout()
      }
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} context
     */
    async load ({ dispatch }) {
      // 加载用户
      await dispatch('d2admin/user/load', null, { root: true })
      // 加载主题
      await dispatch('d2admin/theme/load', null, { root: true })
      // 加载页面过渡效果设置
      await dispatch('d2admin/transition/load', null, { root: true })
      // 持久化数据加载上次退出时的多页列表
      await dispatch('d2admin/page/openedLoad', null, { root: true })
      // 持久化数据加载侧边栏配置
      await dispatch('d2admin/menu/asideLoad', null, { root: true })
      // 持久化数据加载全局尺寸
      await dispatch('d2admin/size/load', null, { root: true })
      // 持久化数据加载颜色设置
      await dispatch('d2admin/color/load', null, { root: true })
    },
  },
}
