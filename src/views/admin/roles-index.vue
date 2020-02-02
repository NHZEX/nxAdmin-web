<template>
  <d2-container>
    <div style="margin-bottom: 10px">
      <el-button type="primary" size="small" icon="el-icon-refresh-right" :loading="loading" @click="loadTable" style="margin-right: 5px">刷新</el-button>
      <roles-edit @on-submit="loadTable">
        <el-button type="primary" size="small" style="margin-right: 10px;">添加</el-button>
      </roles-edit>
    </div>
    <el-table style="margin-bottom: 10px" border size="small" :data="data" v-loading="loading" row-key="id">
      <el-table-column label="ID" prop="id" width="100"/>
      <el-table-column label="类型" prop="genre_desc" :filters="rolesGenre" :filter-multiple="false"/>
      <el-table-column label="名称" prop="name"/>
      <el-table-column label="状态" prop="status_desc"/>
      <el-table-column label="创建时间" prop="create_time" width="120" :formatter="formatData"/>
      <el-table-column label="更新时间" prop="update_time" width="120" :formatter="formatData"/>
      <el-table-column label="操作">
        <template slot-scope="{ row, $index }">
          <roles-edit :id="row.id" @on-submit="loadTable">
            <el-button type="primary" size="mini" style="margin-right: 10px;">编辑</el-button>
          </roles-edit>
          <el-popover-del title="确认删除数据？" @on-ok="tableDelete($index, row.id)">
            <el-button type="danger" size="mini" :loading="row.__loadingDelete">删除</el-button>
          </el-popover-del>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :layout="page.layout" @current-change="pageChange" @size-change="pageSizeChange"
                   :total="page.total" :current-page="page.current" :page-size="page.size" :page-sizes="page.sizes"/>
  </d2-container>
</template>

<script>
import dayjs from 'dayjs'
import ElPopoverDel from '@/components/common/el-popover-del'
import RolesEdit from './roles-edit'
import tableHelper from '@/plugin/helper/table-page'
import { deleteRole, getRoles } from '@api/admin/admin'
import constant from '@/constant'

export default {
  name: 'RolesIndex',
  components: { ElPopoverDel, RolesEdit },
  mixins: [tableHelper],
  data () {
    return {
      rolesGenre: constant.admin.rolesGenre,
      loading: false,
      data: [],
    }
  },
  methods: {
    loadTable () {
      this.loading = true
      getRoles(this.page.current, this.page.size).then(({ data, count }) => {
        this.data = data.map(d => {
          d.__loadingDelete = false
          return d
        })
        this.page.total = count
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
      deleteRole(id).finally(() => {
        row.__loadingDelete = false
        this.loadTable()
      })
    },
  },
  mounted () {
    this.loadTable()
  },
}
</script>

<style scoped>

</style>
