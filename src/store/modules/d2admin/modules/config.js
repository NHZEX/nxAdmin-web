import { system } from '@/api/sys'
import { random_hex } from '@ozxin/js-tools/src/crypto/util'
import { Notification } from 'element-ui'

const MACHINE_CODE_LEN = 64

export default {
  namespaced: true,
  state: {
    // 登录验证码
    loginCaptcha: false,
    // 机器码
    machine: null,
  },
  mutations: {
    updateMachine (state, code) {
      state.machine = code
    }
  },
  actions: {
    async loadMachineCode ({ dispatch, commit }) {
      let machine = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'machine',
        defaultValue: null,
      }, { root: true })

      if (!machine || machine.length !== MACHINE_CODE_LEN) {
        machine = random_hex(MACHINE_CODE_LEN)

        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'machine',
          value: machine,
        }, { root: true })
      }

      commit('updateMachine', machine)
    },
    load ({ state }) {
      system.congig().then(config => {
        state.loginCaptcha = config.loginCaptcha
      }).catch(err => {
        Notification.error({
          title: '系统初始化失败',
          message: '请检测网络或服务器异常<br>' + err,
          dangerouslyUseHTMLString: true,
          duration: 8 * 1000,
        })
      })
    },
  },
}
