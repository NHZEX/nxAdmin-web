<script>
  import Page from '@ivu/page'
  import iTable from '@ivu/table'
  import { hasOwnProperty } from '@/libs/util.common'

  export default {
    name: 'i-page-table',
    components: {
      Page,
      iTable,
    },
    model: {
      prop: 'pageConfig',
      event: 'page-change',
    },
    props: {
      primaryKey: {
        type: String,
      },
      rememberChecked: {
        type: Boolean,
        default: false,
      },
      filters: {
        type: Object,
        default () {
          return {}
        },
      },
      pageConfig: {
        type: Object,
        default () {
          return {}
        },
      },
      pageTotal: {
        type: Number,
        default: 0,
      },
      pageCurrent: {
        type: Number,
        default: 1,
      },
      pageOpts: {
        type: Array,
        default () {
          return [10, 30, 50, 100]
        },
      },
      pageSize: {
        type: Number,
        default: 10,
      },
    },
    data () {
      return {
        // todo 单个属性声明为淘汰方案，时机合适需移除
        i_page: {
          total: hasOwnProperty(this.pageConfig, 'total') ? this.pageConfig.total : this.pageTotal,
          current: hasOwnProperty(this.pageConfig, 'current') ? this.pageConfig.current : this.pageCurrent,
          size: hasOwnProperty(this.pageConfig, 'size') ? this.pageConfig.size : this.pageSize,
          opts: hasOwnProperty(this.pageConfig, 'opts') ? this.pageConfig.opts : this.pageOpts,
        },
        selected: {},
      }
    },
    computed: {
      primaryKeys () {
        return this.primaryKey ? this.$attrs.data.map(d => d[this.primaryKey]) : []
      },
      dataChecked () {
        if (this.primaryKey) {
          return this.$attrs.data.map(v => {
            const key = v[this.primaryKey]
            v._checked = hasOwnProperty(this.selected, key) ? this.selected[key] : false
            return v
          })
        } else {
          return this.$attrs.data
        }
      }
    },
    methods: {
      pageChange (page) {
        this.i_page.current = page
        this.triggerLoad()
      },
      pageSizeChange (size) {
        this.i_page.size = size
        this.triggerLoad()
      },
      triggerLoad () {
        this.$emit('page-change', this.i_page)
      },
      onSelect (selection, row) {
        if (this.rememberChecked && this.primaryKey) {
          this.selected[row[this.primaryKey]] = true
        }
        this.$emit('on-select', selection, row)
        this.triggerSelected()
      },
      onSelectCancel (selection, row) {
        if (this.rememberChecked && this.primaryKey) {
          this.selected[row[this.primaryKey]] = false
        }
        this.$emit('on-select-cancel', selection, row)
        this.triggerSelected()
      },
      onSelectAll (selection) {
        if (this.rememberChecked && this.primaryKey) {
          for (const d of selection) {
            this.selected[d[this.primaryKey]] = true
          }
        }
        this.$emit('on-select-all', selection)
        this.triggerSelected()
      },
      onSelectAllCancel (selection) {
        if (this.rememberChecked && this.primaryKey) {
          for (const d of this.$attrs.data) {
            this.selected[d[this.primaryKey]] = false
          }
        }
        this.$emit('on-select-all-cancel', selection)
        this.triggerSelected()
      },
      triggerSelected () {
        const result = []
        for (const id of Object.keys(this.selected)) {
          if (this.selected[id]) {
            result.push(id)
          }
        }
        this.$emit('on-selected', result)
      },
      resetSelected () {
        this.selected = {}
      }
    },
    watch: {
      pageCurrent (val) {
        this.i_page.current = val
      },
      pageTotal (val) {
        this.i_page.total = val
      },
      'pageConfig.current' (val) {
        this.i_page.current = val
      },
      'pageConfig.total' (val, old) {
        this.i_page.total = val
      },
    },
    render (createElement) {
      return createElement('span', {}, [
        createElement('i-table', {
          attrs: {
            size: 'small',
            border: true,
            ...this.$attrs,
            data: this.rememberChecked ? this.dataChecked : this.$attrs.data,
          },
          on: {
            ...this.$listeners,
            'on-select': this.onSelect,
            'on-select-cancel': this.onSelectCancel,
            'on-select-all': this.onSelectAll,
            'on-select-all-cancel': this.onSelectAllCancel,
          },
          scopedSlots: this.$scopedSlots,
        }),
        createElement('page', {
          staticStyle: {
            'margin-top': '10px',
          },
          attrs: {
            transfer: true,
            showTotal: true,
            showSizer: true,
            total: this.i_page.total,
            current: this.i_page.current,
            pageSize: this.i_page.size,
            pageSizeOpts: this.i_page.opts,
            disabled: this.$attrs.loading,
          },
          on: {
            'on-change': this.pageChange,
            'on-page-size-change': this.pageSizeChange,
          },
        }),
      ])
    },
    created () {
      const columns = this.$attrs.columns
      const queue = []
      let promise = null

      for (let i = 0; i < columns.length; i++) {
        const column = columns[i]
        promise = null
        if (hasOwnProperty(column, 'filter') && hasOwnProperty(this.filters, column.filter)) {
          const filter = this.filters[column.filter]

          if (filter.data instanceof Promise) {
            this.$set(column, 'filters', [])
            promise = filter.data
          } else {
            this.$set(column, 'filters', filter.data)
          }
          this.$watch(`filters.${column.filter}.data`, function (newVal) {
            this.$set(column, 'filters', newVal)
          })

          this.$set(column, 'filterMultiple', filter.multiple)
          this.$set(column, 'filterRemote', filter.remote)
        } else if (hasOwnProperty(column, 'filters') && column.filters instanceof Promise) {
          promise = column.filters
          this.$set(column, 'filters', [])
        }
        // 进入队列
        if (promise) {
          queue.push({
            index: i,
            filters: promise,
          })
        }
      }

      Promise.all(queue.map(v => v.filters)).then(values => {
        for (let i = 0; i < values.length; i++) {
          columns[queue[i].index].filters = values[i]
        }
      }).catch(() => {
        this.$ivuMessage.warning('表格数据初始化失败')
      })
    },
  }
</script>

<style scoped>

</style>
