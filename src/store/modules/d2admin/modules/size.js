import Vue from 'vue'
import router from '@/router'
import setting from '@/setting.js'

const mapping = {
  default: {
    el: 'default',
    iv: 'default',
  },
  large: {
    el: 'default',
    iv: 'large',
  },
  medium: {
    el: 'medium',
    iv: 'default',
  },
  small: {
    el: 'small',
    iv: 'small',
  },
  mini: {
    el: 'mini',
    iv: 'small',
  },
}

export default {
  namespaced: true,
  state: {
    // 尺寸
    value: 'small' // medium small mini
  },
  actions: {
    /**
     * @description 将当前的设置应用到 element
     * @param {Object} context
     * @param {Boolean} refresh 是否在设置之后刷新页面
     */
    apply ({ state, commit }, refresh) {
      Vue.prototype.$ELEMENT.size = mapping[state.value].el
      Vue.prototype.$IVIEW.size = mapping[state.value].iv
      if (refresh) {
        commit('d2admin/page/keepAliveClean', null, { root: true })
        router.replace('/refresh')
      }
    },
    /**
     * @description 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
     * @param {Object} context
     */
    isLoaded ({ state }) {
      if (state.value) return Promise.resolve()
      return new Promise(resolve => {
        const timer = setInterval(() => {
          if (state.value) resolve(clearInterval(timer))
        }, 10)
      })
    },
    /**
     * @description 设置尺寸
     * @param {Object} context
     * @param {String} size 尺寸
     */
    async set ({ state, dispatch }, size) {
      // store 赋值
      state.value = size
      // 应用
      dispatch('apply', true)
      // 持久化
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'size.value',
        value: state.value,
        user: true
      }, { root: true })
    },
    /**
     * @description 从持久化数据读取尺寸设置
     * @param {Object} context
     */
    async load ({ state, dispatch }) {
      if (!setting.features.headers.size) {
        // 应用
        dispatch('apply')
        return
      }
      // store 赋值
      state.value = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'size.value',
        defaultValue: 'small',
        user: true
      }, { root: true })
      // 应用
      dispatch('apply')
    }
  }
}
