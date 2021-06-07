<script type="text/jsx">
export default {
  name: 'nx-description-col',
  functional: true,
  props: {
    label: {
      required: false,
      default: ''
    },
    color: {
      type: String,
      required: false,
      default: '#eee'
    },
    span: {
      type: [Number, String],
      required: false,
      default: 1,
    },
  },
  render (h, ctx) {
    return [
      <td class="label" colSpan={1} style={ { backgroundColor: ctx.props.color } }>
        {ctx.props.label}
      </td>,
      <td class="value" colSpan={ctx.props.span}>
        {ctx.slots().default}
      </td>
    ]
  }
}
</script>

<style scoped lang="scss">
@mixin cell {
  font-size: 0.9em;
  padding: 0.7em 0.7em 0.7em 0.4em;
  text-align: left;
  border: #dbdbdb solid 1px;
  color: #4f4f4f;
}

.label {
  @include cell;
  width: 6rem;
  user-select: none;
  font-weight: bold;
}

.value {
  @include cell;
  width: 10rem;
  font-size: 0.8em;
  background: #fff;
}
</style>
