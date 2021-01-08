<script type="text/jsx">
import { cloneDeep } from 'lodash'

export default {
  name: 'nx-tag',
  props: {
    value: {
      type: [String, Boolean, Number],
      required: false,
      default: () => {
        return true
      }
    },
    mappingValues: {
      type: Array,
      required: false,
      default () {
        return []
      }
    },
    // 主颜色
    color: {
      type: [Array, String],
      required: false,
      default: () => {
        return ['#409EFF']
      }
    },
    // 主题
    effect: {
      type: String,
      required: false,
      default: 'light'
    },
    // 字体大小
    fontSize: {
      type: String,
      required: false,
      default: '13px'
    },
    // 背景色减少的亮度
    lighten: {
      type: Number,
      required: false,
      default: -100
    },
    // 标签文字
    label: {
      type: [String, Number],
      required: false,
      default: 'null'
    },
    // 容器内部大小
    padding: {
      type: String,
      required: false,
      default: '2px'
    },
  },
  computed: {
    resultColor () {
      const flag = (typeof this.color === 'string') && this.color.constructor === String
      return flag ? [this.color] : this.color
    },
    styleColor () {
      const index = this.mappingValues.findIndex(e => e === this.value)
      const color = cloneDeep(index > -1 ? this.resultColor[index] : this.resultColor[0])
      switch (this.effect) {
        case 'light':
          return {
            fontColor: color,
            backgroundColor: this.darken(color, this.lighten)
          }
        case 'dark':
          return {
            fontColor: 'white',
            backgroundColor: color
          }
        default:
          return {
            fontColor: color,
            backgroundColor: this.darken(color, this.lighten)
          }
      }
    }
  },
  methods: {
    darken (col) {
      if (col[0] === '#') {
        col = col.slice(1)
      }
      const num = parseInt(col, 16)
      const r = (num >> 16) - (this.lighten * 0.9)
      const g = ((num >> 8) & 0x00FF) - this.lighten
      const b = (num & 0x0000FF) - this.lighten
      return `rgba(${r}, ${g}, ${b}, 0.3)`
    }
  },
  render () {
    const style = {
      '--size': this.fontSize,
      '--padding': this.padding,
      '--color': this.styleColor.fontColor,
      color: this.styleColor.fontColor,
      backgroundColor: this.styleColor.backgroundColor
    }
    return (
      <span ref='tag' class='tag' style={style}>
        {this.label}
      </span>
    )
  }
}
</script>

<style scoped lang="scss">
.tag {
  font-size: var(--size);
  padding: var(--padding);
  border-radius: 0.3em;
  border: var(--color) solid 1px;
  filter: saturate(1.2);
}
</style>
