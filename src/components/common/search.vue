<template>
  <span v-bind:class="[{'float-right': float}]">
    <divider type="vertical"/>
    <span v-for="(item, index) in config" :key="index" class="ivu-input-wrapper"
         :style="{'padding-right': '4px', 'width': (item.width ? item.width : 150) + 'px'}">
      <!--    输入框    -->
      <i-input v-if="item.tag === 'input'" :type="(item.type ? item.type : 'text')"
               v-model.trim="search_params[item.key]"
               :placeholder="item.placeholder ? item.placeholder : '请输入'" clearable>
        <span slot="prepend">{{item.label}}</span>
      </i-input>
      <!--    日期选择    -->
      <date-picker v-else-if="item.tag === 'date-picker'" type="datetimerange" format="yyyy-MM-dd HH:mm"
                   v-model="search_params[item.key]" :placeholder="item.label" clearable
                   :style="{'padding-right': '4px', 'width': (item.width ? item.width : 150) + 'px'}"/>
      <!--    下拉框    -->
      <i-select v-else-if="item.tag === 'select'" v-model.trim="search_params[item.key]"
                :placeholder="'请选择' + item.label" clearable transfer>
        <i-option v-for="(list_item) in item.list" :key="list_item.value" :value="list_item.value">
              {{ list_item.label }}
        </i-option>
      </i-select>
    </span>
    <i-button :type="need_submit ? 'success' : 'default'" @click="submit()" icon="md-search">搜索</i-button>
  </span>
</template>

<script>
  import { isEqual, cloneDeep } from 'lodash'
  import Divider from '@ivu/divider'
  import iInput from '@ivu/input'
  import iButton from '@ivu/button'
  import iSelect from '@ivu/select'
  import iOption from '@ivu/option'
  import DatePicker from '@ivu/date-picker'

  export default {
    name: 'Search',
    components: {
      Divider,
      iInput,
      iButton,
      iSelect,
      iOption,
      DatePicker,
    },
    data () {
      return {
        need_submit: false,
        search_params: {}, // 搜索条件
        origin_search_params: {},
      }
    },
    props: {
      float: {
        type: Boolean,
        default: false,
      },
      config: {
        type: Array,
        require: true,
        default () {
          return [] // {tag: 'input|date-picker|select', label: '标签名称', key: '返回数据命名', type: '输入框类型', list: [], width: 200},
        },
      },
    },
    watch: {
      // 监听搜索条件
      search_params: {
        handler: function (val, oldVal) {
          this.need_submit = !isEqual(val, this.origin_search_params)
        },
        deep: true,
      },
    },
    methods: {
      // 初始搜索条件
      initParams () {
        const tmp = {}
        this.config.forEach((item) => {
          if (item.tag === 'select') {
            tmp[item.key] = undefined
          } else {
            tmp[item.key] = ''
          }
        })
        this.search_params = tmp
        this.origin_search_params = cloneDeep(this.search_params)
      },
      // 提交搜索
      submit () {
        this.origin_search_params = cloneDeep(this.search_params)
        this.need_submit = false
        const tmp = {}
        for (const i in this.search_params) {
          if (this.search_params[i] === undefined) {
            tmp[i] = null
          } else {
            tmp[i] = this.search_params[i]
          }
        }
        this.$emit('on-search', tmp)
      },
    },
    mounted () {
      this.initParams()
    },
  }
</script>

<style scoped>
  .float-right {
    float: right;
  }
</style>
