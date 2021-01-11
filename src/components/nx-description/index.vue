<template>
  <div
    :class="[
      'main',
      { 'is-border' : border },
      { 'is-flex' : flex },
      { 'is-resize': resize },
    ]"
    :style="{
      columnCount: columns
    }"
  >
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'nx-description',
  props: {
    border: Boolean,
    flex: Boolean,
    resize: Boolean,
    columns: Number,
  },
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
}
.is-flex {
  display: flex;
}
.is-resize {
  resize: both;
  overflow: auto;
}
</style>
