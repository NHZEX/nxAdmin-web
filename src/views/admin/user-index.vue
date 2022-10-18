<template>
  <d2-container ref="container">
    <div style="margin-bottom: 10px">
      <el-button type="primary" :loading="loading" @click="refresh" icon="el-icon-refresh">刷新</el-button>
      <el-button type="primary" @click="tableEdit()" icon="el-icon-plus">添加</el-button>
      <el-divider direction="vertical"/>
      <vxe-input v-model="where.username" placeholder="查找用户名"></vxe-input>
      <el-divider direction="vertical"/>
      <vxe-input v-model="where.nickname" placeholder="查找昵称"></vxe-input>
    </div>
    <vxe-table
      ref="table"
      :height="targetHeight"
      :loading="loading"
      :data="data"
      :scroll-y="{ gt: -1 }"
      :row-config="{
        keyField: 'id',
        height: 72,
      }"
      @filter-change="handleFilterChange"
    >
      <vxe-table-column field="id" title="#" width="60" fixed="left"></vxe-table-column>
      <vxe-table-column title="账号" field="username" width="180" fixed="left">
        <template #default="{ row }">
          <ul class="table-attr-row-info">
            <li>
              <label>账号：</label>
              <span>{{ row.username }}</span>
            </li>
            <li>
              <label>昵称：</label>
              <span>{{ row.nickname }}</span>
            </li>
            <li>
              <label>用户组：</label>
              <span>{{ get(row, 'user_group.group_name', '无') }}</span>
            </li>
          </ul>
        </template>
      </vxe-table-column>
      <vxe-table-column title="状态" field="status_desc" width="70" align="center" :filters="[{ label: '正常', value: 0 }, { label: '禁用', value: 1 }]" :filter-multiple="false">
        <template #default="{ row }">
          <nx-tag
            :mapping-values="[0, 1]"
            :color="['#67C23A', '#F56C6C']"
            :value="row.status"
            :label="row.status_desc"
          >
          </nx-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column
        title="类型"
        field="genre_desc"
        width="120"
        align="center"
        :filters="ADMIN_USERS_GENRE_OPTS"
        :filter-multiple="false"
      >
        <template #default="{ row }">
          <nx-tag
            :mapping-values="[1, 2, 3]"
            :color="['#67C23A', '#409EFF', '#E6A23C']"
            :value="row.genre"
            :label="row.genre_desc"
          >
          </nx-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column title="角色" field="role_name" width="120" :filters="[]" :filter-multiple="false"></vxe-table-column>
      <vxe-table-column title="时间" width="150" formatter="unixTime">
        <template #default="{ row }">
          <ul class="table-attr-row-info">
            <li>
              <label>创建：</label>
              <span>{{ formatUnix(row.create_time) }}</span>
            </li>
            <li>
              <label>更新：</label>
              <span>{{ formatUnix(row.update_time) }}</span>
            </li>
          </ul>
        </template>
      </vxe-table-column>
      <vxe-table-column title="登录" width="150" formatter="unixTime">
        <template #default="{ row }">
          <ul class="table-attr-row-info">
            <li>
              <label>时间：</label>
              <span>{{ formatUnix(row.last_login_time) }}</span>
            </li>
            <li>
              <label>IP：</label>
              <span>{{ row.last_login_ip || '无' }}</span>
            </li>
          </ul>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="200" formatter="unixTime" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="mini" @click="tableEdit(row.id)">编辑</el-button>
          <el-popconfirm title="确认删除?" @confirm="tableDelete(row.id)" style="margin-left: 10px">
            <el-button type="danger" size="mini" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </vxe-table-column>
    </vxe-table>
    <vxe-pager
      perfect
      size="mini"
      :loading="loading"
      :current-page="page.current"
      :page-size="page.size"
      :page-sizes="page.sizes"
      :total="page.total"
      @page-change="handlePageChange">
    </vxe-pager >
    <user-edit ref="edit" @on-submit="refresh"></user-edit>
  </d2-container>
</template>

<script>
import UserEdit from './user-edit'
import pageOption from '@/mixin/page-option'
import { users, roles } from '@api/admin/admin'
import { ADMIN_USERS_GENRE, toLabelValue } from '@/store/constant'
import ContainerResize from '@/mixin/container-resize'
import { formatUnix } from '@/libs/util.common.js'
import { debounce, get } from 'lodash'

export default {
  name: 'admin-user-index',
  components: {
    UserEdit,
  },
  mixins: [pageOption, ContainerResize],
  data () {
    return {
      containerResizeOptions: {
        heightOffset: -100,
      },
      loading: false,
      ADMIN_USERS_GENRE_OPTS: toLabelValue(ADMIN_USERS_GENRE),
      columns: [
        { title: 'id', field: 'id', width: 80, fixed: 'left' },
        { title: '账号', field: 'username', width: 180, fixed: 'left' },
        { title: '昵称', field: 'nickname', width: 180 },
        { title: '类型',
          field: 'genre_desc',
          width: 120,
          align: 'center',
          slots: { default: 'genre' },
          filters: toLabelValue(ADMIN_USERS_GENRE),
          filterMultiple: false
        },
        { title: '角色', field: 'role_name', width: 120, filters: [], filterMultiple: false },
        // { title: '邮箱', field: 'email', width: 180 },
        { title: '状态', field: 'status_desc', width: 70, align: 'center' },
        { title: '创建时间', field: 'create_time', width: 135, formatter: 'unixTime' },
        { title: '更新时间', field: 'update_time', width: 135, formatter: 'unixTime' },
        { title: '登录时间', field: 'last_login_time', width: 135, formatter: 'unixTime' },
        { title: '登录IP', field: 'last_login_ip', width: 135 },
        { title: '操作', minWidth: 200, fixed: 'right', slots: { default: 'action' } },
      ],
      data: [],
      where: {
        genre: 0,
        role_id: 0,
        status: null,
        username: '',
        nickname: '',
      },
    }
  },
  watch: {
    where: {
      deep: true,
      handler () {
        this.whereEvent()
      },
    },
  },
  methods: {
    formatUnix,
    get,
    whereEvent: debounce(function () {
      this.searchSubmit()
    }, 500),
    init () {
      roles.select().then(data => {
        const table = this.$refs.table
        const column = table.getColumnByField('role_name')
        table.setFilter(column, data)
        table.updateData()
      })

      this.refresh()
    },
    refresh () {
      this.loading = true
      users
        .get(this.page.current, this.page.size, this.where)
        .then(({ data, count }) => {
          this.data = data
          this.page.total = count
        }).finally(() => {
          this.loading = false
        })
    },
    handlePageChange ({ currentPage, pageSize }) {
      this.page.current = currentPage
      this.page.size = pageSize
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
        case 'role_name':
          this.where.role_id = values[0]
          break
        case 'status_desc':
          this.where.status = values.length ? values[0] : null
          break
        default:
          break
      }
      this.searchSubmit()
    },
    tableEdit (id = 0) {
      this.$refs.edit.open(id)
    },
    tableDelete (id) {
      users.delete(id).finally(() => {
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
