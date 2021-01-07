<template>
  <d2-container ref="container">
    <div style="margin-bottom: 10px">
      <el-button type="primary" :loading="loading" @click="refresh" icon="el-icon-refresh">刷新</el-button>
      <el-button type="primary" @click="roleEdit()" icon="el-icon-plus">添加</el-button>
    </div>
    <vxe-grid
      ref="table"
      row-id="id"
      :height="targetHeight"
      :loading="loading"
      :columns="columns"
      :data="data"
      :pager-config="tablePage"
      @page-change="handlePageChange"
      @filter-change="handleFilterChange"
    >
      <template v-slot:action="{ row }">
        <el-button type="primary" size="mini" @click="roleEdit(row.id)">编辑</el-button>
        <el-popconfirm title="确认删除?" @confirm="roleDelete(row.id)" style="margin-left: 10px">
          <el-button type="danger" size="mini" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
    </vxe-grid>
    <role-edit ref="edit" @on-submit="refresh"></role-edit>
  </d2-container>
</template>

<script>
import RoleEdit from './role-edit'
import pageOption from '@/mixin/page-option'
import { roles } from '@api/admin/admin'
import { ADMIN_ROLES_GENRE, toLabelValue } from '@/store/constant'
import ContainerResize from '@/mixin/container-resize'

export default {
  name: 'admin-role-index',
  components: {
    RoleEdit
  },
  mixins: [pageOption, ContainerResize],
  data () {
    return {
      loading: false,
      columns: [
        { title: 'id', field: 'id', width: 80, fixed: 'left' },
        { title: '名称', field: 'name', width: 240, fixed: 'left' },
        { title: '类型', field: 'genre_desc', width: 100, filters: toLabelValue(ADMIN_ROLES_GENRE), filterMultiple: false },
        { title: '状态', field: 'status_desc', width: 70 },
        { title: '创建时间', field: 'create_time', width: 135, formatter: 'unixTime' },
        { title: '更新时间', field: 'update_time', width: 135, formatter: 'unixTime' },
        { title: '操作', minWidth: 200, fixed: 'right', slots: { default: 'action' } },
      ],
      data: [],
      where: {
        genre: 0,
      },
    }
  },
  methods: {
    init () {
      this.refresh()
    },
    refresh () {
      this.loading = true
      roles.get(this.tablePage.currentPage, this.tablePage.pageSize, this.where).then(({ data, count }) => {
        this.data = data
        this.page.total = count
      }).finally(() => {
        this.loading = false
      })
    },
    handlePageChange ({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      this.refresh()
    },
    searchSubmit () {
      this.page.current = 1
      this.refresh()
    },
    handleFilterChange ({ property, values }) {
      switch (property) {
        case 'genre_desc':
          this.where.genre = values[0]
          break
        default:
          break
      }
      this.searchSubmit()
    },
    roleEdit (id = 0) {
      this.$refs.edit.open(id)
    },
    roleDelete (id) {
      this.loading = true
      roles.delete(id).finally(() => {
        this.refresh()
      })
    },
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
  }
}
</script>

<style scoped>

</style>
