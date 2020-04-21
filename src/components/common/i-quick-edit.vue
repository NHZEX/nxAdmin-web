<template>
  <span>
    <span @click="open()">
      <slot/>
    </span>
    <modal :title="title" v-model="visible" @on-visible-change="onVisible" @on-ok="quickSubmit()">
      <i-form>
        <form-item>
          <i-input ref="input" v-if="i_type === 'text' || i_type === 'number'" :type="i_type" v-model="quick.value" @on-enter="quickSubmit()"/>
          <i-select v-if="i_type === 'select'" v-model="quick.value">
            <i-option v-for="item in i_data" :key="item.value" :value="item.value"
                      :disabled="item.hasOwnProperty('disabled') ? item.disabled : false"
            >
              {{ item.label }}
            </i-option>
          </i-select>
        </form-item>
      </i-form>
    </modal>
  </span>
</template>

<script>
  import Modal from '@ivu/modal'
  import iInput from '@ivu/input'
  import iForm from '@ivu/form'
  import iSelect from '@ivu/select'
  import iOption from '@ivu/option'
  import FormItem from '@ivu/form-item'

  export default {
    name: 'i-quick-edit',
    components: {
      Modal,
      iInput,
      iForm,
      FormItem,
      iSelect,
      iOption,
    },
    props: {
      title: {
        default: '快速编辑'
      },
      id: {
        default: 0,
      },
      type: {
        default: 'text', // text number select
      },
      field: {
        default: '',
      },
      value: {
        default: '',
      },
      data: {
        default: null,
      }
    },
    data: function () {
      return {
        visible: false,
        i_data: [],
        i_type: null,
        quick: {
          id: 0,
          field: '',
          value: '',
        },
      }
    },
    methods: {
      onVisible (v) {
        if (v) {
          this.i_data = this.data
        }
      },
      // 打开快速编辑
      open (id = this.id, field = this.field, value = this.value, type = this.type) {
        this.i_type = type
        this.quick.id = id
        this.quick.field = field
        this.quick.value = value
        this.visible = true
        if (type === 'text' || type === 'number') {
          this.$nextTick(() => {
            const el = this.$refs.input.$el
            el.getElementsByTagName('input')[0].focus()
          })
        }
      },
      quickSubmit () {
        this.visible = false
        this.$emit('submit', {
          ...this.quick
        })
      }
    }
  }
</script>

<style scoped>

</style>
