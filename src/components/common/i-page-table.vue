<script>
import Page from '@ivu/page'
import iTable from '@ivu/table'

export default {
  name: 'i-page-table',
  components: {
    Page,
    iTable,
  },
  props: {
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
      page: {
        total: this.pageTotal,
        current: this.pageCurrent,
        size: this.pageSize,
        opts: this.pageOpts,
      },
    }
  },
  methods: {
    pageChange (page) {
      this.page.current = page
      this.triggerLoad()
    },
    pageSizeChange (size) {
      this.page.size = size
      this.triggerLoad()
    },
    triggerLoad () {
      this.$emit('page-change', {
        current: this.page.current,
        size: this.page.size,
      })
    },
  },
  watch: {
    pageCurrent (val) {
      this.page.current = val
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
        listeners: this.$listeners,
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
          total: this.pageTotal,
          current: this.page.current,
          pageSize: this.page.size,
          pageSizeOpts: this.page.opts,
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
