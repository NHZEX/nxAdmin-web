import { sysCongig } from '@/api/sys'

export default {
  namespaced: true,
  state: {
    // 登录验证码
    loginCaptcha: false
  },
  actions: {
    async load ({ state }) {
      let config = await sysCongig()
      state.loginCaptcha = config.loginCaptcha
    }
  }
}
