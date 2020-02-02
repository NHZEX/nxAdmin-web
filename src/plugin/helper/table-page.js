export default {
  data () {
    return {
      page: {
        layout: 'total, prev, pager, next, sizes',
        total: 0,
        current: 1,
        size: 16,
        sizes: [16, 30, 50, 100],
      },
    }
  },
  methods: {
    pageChange (current) {
      this.page.current = current
    },
    pageSizeChange (size) {
      this.page.size = size
    },
  },
}
