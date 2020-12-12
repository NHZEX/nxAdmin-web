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
        heightOffset: -62,
        minHeight: 150,
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
        if (this.containerResizeOptions.minHeight > this.targetHeight) {
          this.targetHeight = this.containerResizeOptions.minHeight
        }
      })
    }
  },
  beforeDestroy () {
    if (this.containerResizeOptions.targetEl) {
      erd.uninstall(this.containerResizeOptions.targetEl)
    }
  }
}
