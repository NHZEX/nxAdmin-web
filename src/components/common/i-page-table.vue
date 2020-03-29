<script>
  import Page from '@ivu/page'
  import iTable from '@ivu/table'

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
          total: this.pageConfig.hasOwnProperty('total') ? this.pageConfig.total : this.pageTotal,
          current: this.pageConfig.hasOwnProperty('current') ? this.pageConfig.current : this.pageCurrent,
          size: this.pageConfig.hasOwnProperty('size') ? this.pageConfig.size : this.pageSize,
          opts: this.pageConfig.hasOwnProperty('opts') ? this.pageConfig.opts : this.pageOpts,
        },
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
        console.log(val, old)
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
          },
          on: this.$listeners,
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
      let columns = this.$attrs.columns
      let queue = []

      for (let i = 0; i < columns.length; i++) {
        let column = columns[i]
        if (column.hasOwnProperty('filters') && column.filters instanceof Promise) {
          queue.push({
            index: i,
            filters: column.filters,
          })
        // columns[i].filters = []
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
