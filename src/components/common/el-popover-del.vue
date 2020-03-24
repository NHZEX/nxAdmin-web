<template>
  <el-popover v-model="visible">
    <p><i class="i-ico el-icon-question"/>{{ this.title }}</p>
    <div style="text-align: right; margin: 0">
      <el-button type="text" size="mini" @click="clickCancel">{{ this.cancelText }}</el-button>
      <el-button type="primary" size="mini" @click="clickOk">{{ this.okText }}</el-button>
    </div>
    <span slot="reference"><slot/></span>
  </el-popover>
</template>

<script>
  export default {
    name: 'ElPopoverDel',
    props: {
      title: String,
      okText: {
        type: String,
        default: '确定',
      },
      cancelText: {
        type: String,
        default: '取消',
      },
    },
    data () {
      return {
        visible: false,
      }
    },
    methods: {
      clickOk () {
        this.visible = false
        this.$emit('on-ok')
      },
      clickCancel () {
        this.visible = false
        this.$emit('on-cancel')
      },
    },
  }
</script>

<style scoped>
  p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0;
    margin-inline-end: 0;
  }
  i.i-ico {
    font-size: 16px;
    color: #f90;
    line-height: 18px;
    padding-right: 3px;
  }
</style>
