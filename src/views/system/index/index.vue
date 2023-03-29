<template>
  <d2-container>
    <div style="padding: 10px 0 10px" class="flex flex-row space-x-2">
      <el-table :data="tableData" border size="mini" v-loading="loading" style="max-width: 450px">
        <el-table-column label="系统信息">
          <el-table-column
            prop="name"
            label="名称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="value"
            label="值">
          </el-table-column>
        </el-table-column>
      </el-table>
      <div>
        <el-card v-for="item of database" :key="item.name" style="max-width: 900px" :body-style="{ padding: '6px' }">
          <template v-slot:header>
            <span class="font-bold text-xl"># {{ item.name }}</span>
          </template>
          <el-table :data="item.tables" border size="mini">
            <el-table-column prop="table_name" label="表名" fixed width="120"></el-table-column>
            <el-table-column prop="table_rows" label="行数" fixed></el-table-column>
            <el-table-column prop="human.total_size" label="表尺寸"></el-table-column>
            <el-table-column prop="human.data_size" label="数据大小"></el-table-column>
            <el-table-column prop="human.index_size" label="索引大小"></el-table-column>
            <el-table-column prop="human.data_free_size" label="碎片大小"></el-table-column>
            <el-table-column prop="human.avg_row_size" label="平均行尺寸"></el-table-column>
            <el-table-column prop="update_time" label="更新时间"></el-table-column>
            <el-table-column prop="table_comment" label="表注释"></el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
  </d2-container>
</template>

<script>

import { system } from '@api/sys'

export default {
  components: {},
  data () {
    return {
      loading: false,
      tableData: [],
      database: [],
    }
  },
  methods: {
    load () {
      this.loading = true
      system.sysinfo().then(data => {
        const result = []
        for (const key of Object.keys(data)) {
          result.push({
            name: data[key][0],
            value: data[key][1],
          })
        }
        this.tableData = result
      }).finally(() => {
        this.loading = false
      })

      system
        .database()
        .then(data => {
          this.database = data
        }).finally(() => {
        })
    },
  },
  mounted () {
    this.load()
  },
}
</script>

<style lang="scss" scoped>
</style>
