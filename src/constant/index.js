import admin from './modules/admin'

const modules = {
  admin,
}

export default modules

export const mixins = {
  data () {
    return {
      $constant: modules,
    }
  },
}

export const plugin = {
  /**
   * @param {Vue} Vue
   * @param {Object} options
   */
  install: function (Vue, options) {
    Vue.prototype.$constant = modules
    Vue.mixin({
      mixins: [mixins],
    })
  },
}
