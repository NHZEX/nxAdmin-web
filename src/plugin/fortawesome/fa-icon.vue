
<script>
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { isString } from 'lodash'

  export default {
    name: 'fa-icon',
    functional: true,
    props: {
      border: {
        type: Boolean,
        default: false
      },
      fixedWidth: {
        type: Boolean,
        default: false
      },
      flip: {
        type: String,
        default: null,
      },
      iconx: {
        type: [Object, Array, String],
        required: true
      },
      mask: {
        type: [Object, Array, String],
        default: null
      },
      listItem: {
        type: Boolean,
        default: false
      },
      pull: {
        type: String,
        default: null,
      },
      pulse: {
        type: Boolean,
        default: false
      },
      rotation: {
        type: [String, Number],
        default: null,
      },
      swapOpacity: {
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        default: null,
      },
      spin: {
        type: Boolean,
        default: false
      },
      transform: {
        type: [String, Object],
        default: null
      },
      symbol: {
        type: [Boolean, String],
        default: false
      },
      title: {
        type: String,
        default: null
      },
      inverse: {
        type: Boolean,
        default: false
      }
    },
    render (createElement, context) {
      const props = context.props
      let tmp

      props.icon = (isString(props.iconx) && (tmp = props.iconx.split(' ')).length === 2) ? {
        prefix: tmp[0],
        iconName: tmp[1],
      } : props.iconx

      delete props.iconx

      return createElement(FontAwesomeIcon, {
        attrs: props
      })
    }
  }
</script>

<style scoped>

</style>
