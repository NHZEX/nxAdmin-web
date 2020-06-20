import { sysCongig } from '@/api/sys'
import { randomHex } from '@/libs/util.crypto'

const MACHINE_CODE_LEN = 64

export default {
  namespaced: true,
  state: {
    // 登录验证码
    loginCaptcha: false,
    // 机器码
    machine: null,
  },
  actions: {
    async loadMachineCode ({ state, dispatch }) {
      let machine = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'machine',
        defaultValue: null,
      }, { root: true })

      if (!machine || machine.length !== MACHINE_CODE_LEN) {
        machine = randomHex(MACHINE_CODE_LEN)

        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'machine',
          value: machine,
        }, { root: true })
      }

      state.machine = machine
    },
    load ({ state }) {
      sysCongig().then(config => {
        state.loginCaptcha = config.loginCaptcha
      })
    },
  },
}
