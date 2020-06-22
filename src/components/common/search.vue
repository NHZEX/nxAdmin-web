<template>
  <span v-bind:class="[{'float-right': float}]">
    <divider type="vertical"/>
    <span v-for="(item, index) in configOne" :key="index" :style="{'padding-right': '4px'}">
      <span class="ivu-input-wrapper" :style="{'width': (item.width ? item.width : 150) + 'px'}">
        <search-item :item="item" :search_params="search_params"
                     :change="(key, val) => {return change(key, val)}"
        />
      </span>
    </span>
    <poptip v-if="configMoreCount > 0" transfer placement="bottom-end" title="更多筛选">
      <i-button :type="configMoreValueCount > 0 ? 'primary' : 'default'" icon="md-more"/>
      <div slot="content">
        <div v-for="(item, index) in configMore" :key="index" :style="{'margin-bottom': '5px'}">
          <div :style="{'width': '100%'}">
            <search-item :item="item" :search_params="search_params"
                         :change="(key, val) => {return change(key, val)}"
            />
          </div>
        </div>
      </div>
    </poptip>
    <i-button :type="needSubmit ? 'success' : 'default'" @click="submit()" icon="md-search">搜索</i-button>
  </span>
</template>

<script>
  /* eslint-disable vue/no-unused-components */

  import { isEqual, cloneDeep, isArray, trim } from 'lodash'
  import { hasOwnProperty } from '@/libs/util.common'
  import Divider from '@ivu/divider'
  import iInput from '@ivu/input'
  import iButton from '@ivu/button'
  import iSelect from '@ivu/select'
  import iOption from '@ivu/option'
  import DatePicker from '@ivu/date-picker'
  import Poptip from '@ivu/poptip'
  import SearchItem from './search-item'

  export default {
    name: 'Search',
    components: {
      // 函数式组件需要依赖组件引入
      Divider,
      iInput,
      iButton,
      iSelect,
      iOption,
      DatePicker,
      Poptip,
      SearchItem
    },
    data () {
      return {
        trim,
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
          return [] // {tag: 'input|date-picker|select', label: '标签名称', key: '返回数据命名', type: '输入框类型', list: [], width: 200, more: true, multiple: true},
        },
      },
    },
    computed: {
      configOne () {
        const one = []
        for (const item of this.config) {
          if (!hasOwnProperty(item, 'more')) {
            one.push(item)
          }
        }
        return one
      },
      configMore () {
        const more = []
        for (const item of this.config) {
          if (hasOwnProperty(item, 'more') && item.more) {
            more.push(item)
          }
        }
        return more
      },
      configMoreCount () {
        return this.configMore.length
      },
      configMoreValueCount () {
        let value_count = 0
        for (const item of this.configMore) {
          const tmp = this.search_params[item.key]
          let flag = true
          if (isArray(tmp)) {
            if (tmp.length > 0) {
              for (const val of tmp) {
                if (!val) {
                  flag = false
                  break
                }
              }
              if (flag) {
                value_count++
              }
            }
          } else if (tmp) {
            value_count++
          }
        }
        return value_count
      },
      needSubmit () {
        return !isEqual(this.search_params, this.origin_search_params) // 搜索条件是否改变
      }
    },
    watch: {
      config: {
        handler (data) {
          const tmp = {}
          for (const item of data) {
            if (item.tag === 'select') {
              if (hasOwnProperty(item, 'multiple')) {
                // 多选
                tmp[item.key] = []
              } else {
                tmp[item.key] = undefined
              }
            } else if (item.tag === 'date-picker' && (item.type === 'datetimerange' || item.type === 'daterange')) {
              // 时间范围
              tmp[item.key] = ['', '']
            } else {
              tmp[item.key] = ''
            }
          }
          this.search_params = tmp
          this.origin_search_params = cloneDeep(this.search_params)
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      // 输入值，返回对应的key, val，并去空处理
      change (key, val) {
        if (!Array.isArray(val)) {
          if (typeof (val) === 'string') {
            this.search_params[key] = trim(val)
          } else {
            this.search_params[key] = val
          }
        } else {
          this.search_params[key] = val
        }
      },
      // 提交搜索
      submit () {
        this.origin_search_params = cloneDeep(this.search_params)
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
  }
</script>

<style scoped>
  .float-right {
    float: right;
  }
</style>
