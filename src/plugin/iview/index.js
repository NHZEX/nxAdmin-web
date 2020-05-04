import Message from 'view-design/src/components/message'
import Modal from 'view-design/src/components/modal'
import Notice from 'view-design/src/components/notice'
import Spin from 'view-design/src/components/spin'
import locale from 'view-design/src/locale'

import('./style').then((module) => {
  module.default()
})

/**
 * @param {Vue} Vue
 * @param {Object} opts
 */
const install = (Vue, opts = {}) => {
  if (install.installed) {
    return
  }
  locale.use(opts.locale)
  locale.i18n(opts.i18n)

  Vue.prototype.$IVIEW = {
    size: opts.size || '',
    transfer: 'transfer' in opts ? opts.transfer : '',
    capture: 'capture' in opts ? opts.capture : true,
    select: {
      arrow: opts.select ? opts.select.arrow ? opts.select.arrow : '' : '',
      customArrow: opts.select ? opts.select.customArrow ? opts.select.customArrow : '' : '',
      arrowSize: opts.select ? opts.select.arrowSize ? opts.select.arrowSize : '' : ''
    },
    cell: {
      arrow: opts.cell ? opts.cell.arrow ? opts.cell.arrow : '' : '',
      customArrow: opts.cell ? opts.cell.customArrow ? opts.cell.customArrow : '' : '',
      arrowSize: opts.cell ? opts.cell.arrowSize ? opts.cell.arrowSize : '' : ''
    },
    menu: {
      arrow: opts.menu ? opts.menu.arrow ? opts.menu.arrow : '' : '',
      customArrow: opts.menu ? opts.menu.customArrow ? opts.menu.customArrow : '' : '',
      arrowSize: opts.menu ? opts.menu.arrowSize ? opts.menu.arrowSize : '' : ''
    },
    tree: {
      arrow: opts.tree ? opts.tree.arrow ? opts.tree.arrow : '' : '',
      customArrow: opts.tree ? opts.tree.customArrow ? opts.tree.customArrow : '' : '',
      arrowSize: opts.tree ? opts.tree.arrowSize ? opts.tree.arrowSize : '' : ''
    },
    cascader: {
      arrow: opts.cascader ? opts.cascader.arrow ? opts.cascader.arrow : '' : '',
      customArrow: opts.cascader ? opts.cascader.customArrow ? opts.cascader.customArrow : '' : '',
      arrowSize: opts.cascader ? opts.cascader.arrowSize ? opts.cascader.arrowSize : '' : '',
      itemArrow: opts.cascader ? opts.cascader.itemArrow ? opts.cascader.itemArrow : '' : '',
      customItemArrow: opts.cascader ? opts.cascader.customItemArrow ? opts.cascader.customItemArrow : '' : '',
      itemArrowSize: opts.cascader ? opts.cascader.itemArrowSize ? opts.cascader.itemArrowSize : '' : ''
    },
    colorPicker: {
      arrow: opts.colorPicker ? opts.colorPicker.arrow ? opts.colorPicker.arrow : '' : '',
      customArrow: opts.colorPicker ? opts.colorPicker.customArrow ? opts.colorPicker.customArrow : '' : '',
      arrowSize: opts.colorPicker ? opts.colorPicker.arrowSize ? opts.colorPicker.arrowSize : '' : ''
    },
    datePicker: {
      icon: opts.datePicker ? opts.datePicker.icon ? opts.datePicker.icon : '' : '',
      customIcon: opts.datePicker ? opts.datePicker.customIcon ? opts.datePicker.customIcon : '' : '',
      iconSize: opts.datePicker ? opts.datePicker.iconSize ? opts.datePicker.iconSize : '' : ''
    },
    timePicker: {
      icon: opts.timePicker ? opts.timePicker.icon ? opts.timePicker.icon : '' : '',
      customIcon: opts.timePicker ? opts.timePicker.customIcon ? opts.timePicker.customIcon : '' : '',
      iconSize: opts.timePicker ? opts.timePicker.iconSize ? opts.timePicker.iconSize : '' : ''
    },
    tabs: {
      closeIcon: opts.tabs ? opts.tabs.closeIcon ? opts.tabs.closeIcon : '' : '',
      customCloseIcon: opts.tabs ? opts.tabs.customCloseIcon ? opts.tabs.customCloseIcon : '' : '',
      closeIconSize: opts.tabs ? opts.tabs.closeIconSize ? opts.tabs.closeIconSize : '' : ''
    },
    modal: {
      maskClosable: opts.modal ? 'maskClosable' in opts.modal ? opts.modal.maskClosable : '' : ''
    }
  }

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

  install.installed = true
}

export default {
  install,
}
