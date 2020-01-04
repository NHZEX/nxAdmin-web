import Message from 'view-design/src/components/message'
import Modal from 'view-design/src/components/modal'
import Notice from 'view-design/src/components/notice'
import Spin from 'view-design/src/components/spin'

/**
 * @param {Vue} Vue
 * @param {Object} options
 */
let install = function (Vue, options) {
  /**
   * @type {Message}
   */
  Vue.prototype.$ivuMessage = Message
  /**
   * @type {Modal}
   */
  Vue.prototype.$ivuModal = Modal
  /**
   * @type {Notice}
   */
  Vue.prototype.$ivuNotice = Notice
  /**
   * @type {Spin}
   */
  Vue.prototype.$ivuSpin = Spin
}

export default {
  install,
}
