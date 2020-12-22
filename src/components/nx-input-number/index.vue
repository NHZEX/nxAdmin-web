<template>
  <div class="app">
    <div class="btn" @click="reduce"/>
    <div>
      <label>
        <input class="input" v-model="number" @keyup.enter="changeValue($event)" ref="input"/>
      </label>
    </div>
    <div class="btn" @click="add"/>
  </div>
</template>

<script>
export default {
  name: 'nx-input-number',
  props: {
    value: {
      type: [Number, String],
      required: false,
      default: 0
    }
  },
  data () {
    return {
      number: this.value
    }
  },
  methods: {
    reduce () {
      this.number--
      this.$emit('input', this.number)
    },
    add () {
      this.number++
      this.$emit('input', this.number)
    },
    changeValue () {
      this.$refs.input.blur()
    },
    remainder () {
      this.number = this.number.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
      this.$emit('input', this.number)
    }
  },
  watch: {
    value () {
      this.number = this.value
      this.$emit('input', this.number)
    },
    number () {
      this.remainder(this.number)
    }
  }
}
</script>

<style scoped>
@import "./index.css";
</style>
