<script type="text/jsx">
export default {
  name: 'nx-description-row',
  functional: true,
  render (h, ctx) {
    return (
      <tr>
        {ctx.slots().default}
      </tr>
    )
  }
}
</script>

<style scoped lang="scss">
</style>
