<template>
  <span>
    <tag :color="currentColor">
      <template v-if="currentDesc">
        {{ currentDesc }}
      </template>
      <template v-else>
        <slot/>
      </template>
    </tag>
  </span>
</template>
<script>
  import Tag from '@ivu/tag'
  export default {
    name: 'TagColor',
    components: {
      Tag,
    },
    props: {
      colors: {
        type: Array,
        default () {
          return ['default', 'blue', 'green', 'red', 'orange', 'primary', 'success', 'error', 'warning'] // 默认颜色集合
        },
      },
      values: {
        type: Array,
        default () {
          return [] // 实际值的集合
        },
      },
      current: {
        type: Object,
        default () {
          return { val: null, desc: '' } // {val: '实际值', desc: '显示描述'}
        },
      },
      val: {
        type: [Number, String],
        default () {
          return null
        }
      },
      desc: {
        type: String,
        default () {
          return ''
        }
      }
    },
    computed: {
      currentColor () {
        let val = this.val
        if (this.current.val != null) {
          val = this.current.val
        }
        if (this.val != null) {
          val = this.val
        }
        let index = this.values.indexOf(val)
        if (index < 0 || index > this.colors.length) {
          index = 0
        }
        return this.colors[index]
      },
      currentDesc () {
        let desc = this.desc
        if (this.current.desc !== '') {
          desc = this.current.desc
        }
        if (this.desc !== '') {
          desc = this.desc
        }
        return desc
      },
    },
  }
</script>
