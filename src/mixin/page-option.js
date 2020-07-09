export default {
  data: function () {
    return {
      page: {
        total: 0,
        current: 1,
        size: 10,
        opts: [10, 30, 50, 100],
      },
      tablePage: {
        total: 0,
        currentPage: 1,
        pageSize: 20,
      },
    }
  }
}
