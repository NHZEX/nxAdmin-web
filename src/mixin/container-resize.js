import resize from '@/plugin/resize'
import { get, isFunction } from 'lodash'

const erd = resize()

export default {
  data: function () {
    return {
      targetHeight: 500,
      containerResizeOptions: {
        target: '$refs.container.$el',
        targetEl: null,
        heightOffset: -45,
      },
    }
  },
  mounted () {
    if (!this.containerResizeOptions.initEl) {
      if (isFunction(this.containerResizeOptions.target)) {
        this.containerResizeOptions.targetEl = this.containerResizeOptions.target()
      } else {
        this.containerResizeOptions.targetEl = get(this, this.containerResizeOptions.target)
      }
    } else {
      this.containerResizeOptions.targetEl = this.containerResizeOptions.initEl
    }
    if (this.containerResizeOptions.targetEl) {
      erd.listenTo(this.containerResizeOptions.targetEl, (el) => {
        this.targetHeight = el.offsetHeight + this.containerResizeOptions.heightOffset
      })
    }
  },
  beforeDestroy () {
    if (this.containerResizeOptions.targetEl) {
      erd.uninstall(this.containerResizeOptions.targetEl)
    }
  }
}
