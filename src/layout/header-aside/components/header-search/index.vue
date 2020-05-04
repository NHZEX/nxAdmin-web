<template>
  <el-button class="d2-mr btn-text can-hover" type="text" @click="handleClick">
    <fa-icon iconx="search" size="lg"/>
  </el-button>
</template>

<script>
  export default {
    methods: {
      handleClick () {
        this.$emit('click')
      }
    }
  }
</script>
