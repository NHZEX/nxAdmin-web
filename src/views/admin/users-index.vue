<template>
  <d2-container>
    <div style="margin-bottom: 10px">
      <el-button type="primary" size="small" icon="el-icon-refresh-right" :loading="loading" @click="loadTable" style="margin-right: 5px">刷新</el-button>
      <users-edit @data-change="loadTable">
        <el-button type="primary" size="small" style="margin-right: 10px;">添加</el-button>
      </users-edit>
    </div>
    <el-table style="margin-bottom: 10px" border size="small" :data="data" v-loading="loading" row-key="id" @filter-change="filterChange">
      <el-table-column label="ID" prop="id" width="100"/>
      <el-table-column label="类型" prop="genre_desc" column-key="genre" :filters="usersGenre" :filter-multiple="false"/>
      <el-table-column label="角色" prop="role_name" column-key="role_id" :filters="userRoles" :filter-multiple="false"/>
      <el-table-column label="账号" prop="username"/>
      <el-table-column label="昵称" prop="nickname"/>
      <el-table-column label="邮箱" prop="email"/>
      <el-table-column label="状态" prop="status_desc"/>
      <el-table-column label="创建时间" prop="create_time" width="120" :formatter="formatData"/>
      <el-table-column label="更新时间" prop="update_time" width="120" :formatter="formatData"/>
      <el-table-column label="操作">
        <template slot-scope="{ row, $index }">
          <users-edit :id="row.id" @data-change="loadTable">
            <el-button type="primary" size="mini" style="margin-right: 10px;" :loading="row.__loadingDelete">编辑</el-button>
          </users-edit>
          <el-popover-del title="确认删除数据？" @on-ok="tableDelete($index, row.id)">
            <el-button type="danger" size="mini">删除</el-button>
          </el-popover-del>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :layout="page.layout" @current-change="pageChange" @size-change="pageSizeChange"
                   :total="page.total" :current-page="page.current" :page-size="page.size" :page-sizes="page.sizes"/>
  </d2-container>
</template>

<script>
import ElPopoverDel from '@/components/common/el-popover-del'
import UsersEdit from './users-edit'
import constant from '@/constant'
import { deleteUser, getRolesSelect, getUsers } from '@api/admin/admin'
import tableHelper from '@/plugin/helper/table-page'
import dayjs from 'dayjs'

export default {
  name: 'UsersIndex',
  components: { ElPopoverDel, UsersEdit },
  mixins: [tableHelper],
  data () {
    return {
      usersGenre: constant.admin.usersGenre,
      userRoles: [],
      loading: false,
      data: [],
      where: {
        genre: 0,
        role_id: 0,
      },
    }
  },
  methods: {
    loadTable () {
      this.loading = true
      Promise.all([getRolesSelect(), getUsers(this.page.current, this.page.size)]).then(values => {
        this.userRoles = values[0]
        this.data = values[1].data.map(d => {
          d.__loadingDelete = false
          return d
        })
        this.page.total = values[1].count
      }).finally(() => {
        this.loading = false
      })
    },
    formatData (row, column, cellValue) {
      return dayjs(cellValue * 1000).format('YYYY-M-D HH:mm')
    },
    tableDelete (index, id) {
      let row = this.data[index]
      row.__loadingDelete = true
      deleteUser(id).finally(() => {
        row.__loadingDelete = false
        this.loadTable()
      })
    },
    filterChange (filters) {
      for (let key in filters) {
        if (!filters.hasOwnProperty(key)) {
          continue
        }
        this.where[key] = filters[key].length ? filters[key][0] : 0
      }
    },
  },
  mounted () {
    this.loadTable()
  },
  comments: {
  },
  watch: {
    'page.current' () {
      this.loadTable()
    },
    'page.size' () {
      this.loadTable()
    },
  },
}
</script>

<style scoped>

</style>
