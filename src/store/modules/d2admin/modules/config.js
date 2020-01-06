import { sysCongig } from '@/api/sys'

export default {
  namespaced: true,
  state: {
    // 登录验证码
    loginCaptcha: false,
  },
  actions: {
    load ({ state }) {
      sysCongig().then(config => {
        state.loginCaptcha = config.loginCaptcha
      })
    },
  },
}
