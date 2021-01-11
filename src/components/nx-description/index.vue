<script type="text/jsx">
export default {
  functional: true,
  props: {
    col: {
      type: Number,
      required: false,
      default: 2,
    },
  },
  render: (h, ctx) => {
    const col = ctx.props.col
    let VNodes = []
    const resultVNodes = []
    let count = 0
    ctx.children.forEach(vnode => {
      count += vnode.data.attrs.colSpan
      VNodes.push(vnode)
      if (count >= col * 2) {
        count = 0
        const tr = h('tr')
        tr.children = VNodes
        resultVNodes.push(tr)
        VNodes = []
      }
    })
    const tr = h('tr')
    tr.children = VNodes
    resultVNodes.push(tr)
    return (
      <table
        border="1"
        class="main is-border"
        style={ ctx.data.staticStyle }
      >
        <tbody>
        { resultVNodes }
        </tbody>
      </table>
    )
  }
}
</script>

<style scoped lang="scss">
.main {
  width: 100%;
  font-size: 16px;
  padding: 0;

}
.is-border {
  border: #dbdbdb solid 1px;
  border-collapse: collapse
}
</style>
