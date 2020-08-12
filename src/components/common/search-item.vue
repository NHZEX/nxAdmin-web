<template functional>
  <div>
    <!--    输入框    -->
    <i-input v-if="props.item.tag === 'input'" :type="(props.item.type || 'text')"
             :value="props.search_params[props.item.key]" :placeholder="props.item.placeholder || '请输入'" clearable
             @on-change="v => props.change(props.item.key, v.target.value)">
      <span slot="prepend">{{ props.item.label }}</span>
    </i-input>
    <!--    日期选择    -->
    <date-picker v-else-if="props.item.tag === 'date-picker'" :type="props.item.type || 'datetimerange'"
                 format="yyyy-MM-dd HH:mm" :placeholder="props.item.label"
                 :value="$options.methods.timestampToDate(props.search_params[props.item.key])"
                 placement="bottom" clearable :editable="false" :style="{'width': (props.item.width || 150) + 'px'}"
                 @on-change="v => {
                   const timestamp = $options.methods.dateToTimestamp(v)
                   props.change(props.item.key, timestamp)
               }"
    />
    <!--    下拉框    -->
    <i-select v-else-if="props.item.tag === 'select'" :value="props.search_params[props.item.key]"
              :placeholder="'请选择' + props.item.label" :style="{'width': (props.item.width || 150) + 'px'}"
              clearable transfer :max-tag-count="1" :multiple="props.item.hasOwnProperty('multiple')"
              @on-change="v => props.change(props.item.key, v)">
      <i-option v-for="(list_item) in props.item.list" :key="list_item.value" :value="list_item.value">
        {{ list_item.label }}
      </i-option>
    </i-select>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import iInput from '@ivu/input'
import iSelect from '@ivu/select'
import iOption from '@ivu/option'
import DatePicker from '@ivu/date-picker'

export default {
  name: 'search-item',
  components: {
    iInput,
    iSelect,
    iOption,
    DatePicker,
  },
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    },
    search_params: {
      type: Object,
      default () {
        return {}
      }
    },
    change: {
      type: Function,
      required: true,
    },
  },
  dayjs,
  methods: {
    // 时间戳转时间字符串
    timestampToDate (timestamp) {
      if (timestamp && Array.isArray(timestamp) && timestamp.length === 2) {
        return timestamp.map((item) => {
          if (item) {
            return dayjs.unix(item).format('YYYY-MM-DD HH:mm:ss')
          }
          return item
        })
      }
      return ['', '']
    },
    // 时间字符串转时间戳
    dateToTimestamp (date) {
      if (date && Array.isArray(date) && date.length === 2) {
        return date.map((item) => {
          if (item) {
            return dayjs(item).unix()
          }
          return item
        })
      }
      return date
    }
  }
}
</script>
