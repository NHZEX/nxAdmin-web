<template>
  <div
    class="app"
    :style="{ '--size': size }"
  >
    <div class="btn" @click="reduce"/>
    <div>
      <label>
        <input
          ref="input"
          class="input"
          v-model="number"
          @keyup.enter="changeValue($event)"
          @keydown.up="add"
          @keydown.down="reduce"
          @blur="handleBlur"
        />
      </label>
    </div>
    <div class="btn" @click="add"/>
  </div>
</template>

<script>
import emitter from 'element-ui/src/mixins/emitter'
export default {
  name: 'nx-input-number',
  mixins: [emitter],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    value: {
      type: [Number, String],
      required: false,
      default: 0
    },
    size: {
      type: String,
      required: false,
      default: '30px'
    }
  },
  data () {
    return {
      number: this.value
    }
  },
  methods: {
    reduce () {
      if (typeof this.number === 'string') {
        this.number = parseFloat(this.number) * 100 / 100
        this.number--
        this.number = this.number.toString()
      } else {
        this.number--
      }
      this.$emit('input', this.number)
    },
    add () {
      if (typeof this.number === 'string') {
        this.number = this.number.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
        this.number = parseFloat(this.number) * 100 / 100
        this.number++
        this.number = this.number.toString()
      } else {
        this.number++
      }
      this.$emit('input', this.number)
    },
    changeValue () {
      this.$refs.input.blur()
    },
    remainder () {
      if (this.number === '') {
        this.number = null
      }
      this.$emit('input', this.number)
    },
    handleBlur () {
      this.dispatch('ElFormItem', 'el.form.blur', [this.value])
    }
  },
  watch: {
    value () {
      this.number = this.value
      this.$emit('input', this.number)
    },
    number () {
      this.remainder()
    }
  }
}
</script>

<style scoped>
@import "./index.css";
</style>
