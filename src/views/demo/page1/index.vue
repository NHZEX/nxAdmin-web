<template>
  <d2-container>
    <template slot="header">Page 1 header</template>
    <span v-access="'login'">Hello World</span>
  </d2-container>
</template>

<script>
export default {
  name: 'page1'
}
</script>
