<template>
  <div style="width: 100%;display: flex;flex-grow: 1">
    <div class="label">{{ label }}</div>
    <div class="value">{{ value }}</div>
  </div>
</template>

<script>
export default {
  name: 'nx-description-item',
  props: {
    label: {
      required: false,
      default: ''
    },
    value: {
      required: false,
      default: ''
    },
  }
}
</script>

<style scoped lang="scss">
@mixin cell {
  display: flex;
  font-size: 1em;
  padding: 0.3em;
  flex-grow: 1;
  align-items: center;
  flex-direction: column;
  width: 100%;
  justify-content: center;
}

.label {
  @include cell;
  width: 70%;
  background: #eee;
  user-select: none;
}

.value {
  @include cell;
  background: #fff;
}
</style>
