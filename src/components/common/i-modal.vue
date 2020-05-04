<script>
  import Modal from '@ivu/modal'
  import Spin from '@ivu/spin'
  import { hasOwnProperty } from '@/libs/util.common'

  export default {
    name: 'i-modal',
    components: {
      Modal,
      Spin,
    },
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
    },
    render (createElement) {
      // 加载默认属性
      const defaultAttrs = {}
      if (!hasOwnProperty(this.$attrs, 'footerHide') && !hasOwnProperty(this.$attrs, 'footer-hide')) {
        defaultAttrs.footerHide = true
      }
      // 载入lodaing层
      if (this.$slots.default && this.loading) {
        this.$slots.default.unshift(createElement('spin', {
          attrs: {
            size: 'large',
            fix: true,
          },
        }))
      }
      // 返回渲染函数
      return createElement('modal', {
        attrs: {
          ...this.$attrs,
          ...defaultAttrs,
        },
        on: {
          ...this.$listeners,
          'on-visible-change': this.visibleChange,
        },
        scopedSlots: this.$scopedSlots,
      })
    },
    methods: {
      visibleChange (visible) {
        visible ? this.$emit('on-open') : this.$emit('on-close')
        this.$emit('on-visible-change', visible)
      },
    },
  }
</script>

<style scoped>

</style>
