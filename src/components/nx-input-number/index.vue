<template>
  <div
    class="app"
    :style="{ '--size': size }"
  >
    <div class="btn" @click="reduce"/>
    <div>
      <label>
        <input
          type="number"
          ref="input"
          class="input"
          v-model="number"
          :step="step"
          :max="max"
          :min="min"
          @keyup.enter="$refs.input.blur()"
          @blur="handleBlur"
          @input="handleInput"
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
    },
    place: {
      type: Number,
      required: false,
      default: 0
    },
    step: {
      type: Number,
      required: false,
      default: 1,
    },
    max: {
      type: Number,
      required: false,
      default: 9999
    },
    min: {
      type: Number,
      required: false,
      default: -9999
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
        this.number = parseFloat(this.number) * (10 * this.place) / (10 * this.place)
        this.number = this.number - this.step
      } else {
        this.number = this.number - this.step
      }
      this.format()
    },
    add () {
      if (typeof this.number === 'string') {
        this.number = parseFloat(this.number) * (10 * this.place) / (10 * this.place)
        this.number = this.number + this.step
      } else {
        this.number = this.number + this.step
      }
      this.format()
    },
    format () {
      if (this.place > 0) {
        this.number = parseFloat(this.number)
        if (this.number > this.max) this.number = this.max
        if (this.number < this.min) this.number = this.min
        this.number = this.number.toFixed(this.place)
      } else {
        this.number = parseInt(this.number)
        if (this.number > this.max) this.number = this.max
        if (this.number < this.min) this.number = this.min
      }
    },
    handleBlur () {
      this.format()
      this.dispatch('ElFormItem', 'el.form.blur', [this.value])
    },
    handleInput () {
      // if (typeof this.number === 'string') {
      //   this.number = this.number.replace(/[^\d.]/g, '')
      //   this.number = this.number.replace(/\.{2,}/g, '.')
      // }
    }
  },
  watch: {
    value () {
      this.number = this.value
      this.$emit('input', this.number)
    },
    number () {
      if (isNaN(this.number)) {
        this.number = 0
      }
      this.$emit('input', this.number)
    }
  }
}
</script>

<style scoped>
@import "./index.css";
</style>
