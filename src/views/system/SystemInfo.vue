<template>
  <d2-container>
    <div style="padding: 10px 0 10px" class="flex flex-row space-x-2">
      <el-table :data="tableData" border size="mini" v-loading="loading.system" style="max-width: 450px">
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
      <div v-loading="loading.database">
        <el-card v-for="item of database" :key="item.name" style="max-width: 1100px" :body-style="{ padding: '6px' }">
          <template v-slot:header>
            <span class="font-bold text-xl"># {{ item.name }} ({{ item.version }})</span>
          </template>
          <div style="width: 100%">
            <vxe-table
              :data="item.tables"
              border
              size="small"
              max-height="900"
              :empty-text="item.message || '暂无数据'"
              :sort-config="{
                remote: false,
                sortMethod: databaseSortMethod,
              }"
            >
              <vxe-table-column type="seq" title="#" fixed="left" width="50"></vxe-table-column>
              <vxe-table-column field="table_name" title="表名" fixed="left" width="180" sortable></vxe-table-column>
              <vxe-table-column field="table_rows" title="行数" fixed="left" width="90" sortable></vxe-table-column>
              <vxe-table-column field="human.total_size" title="表尺寸" width="100" sortable></vxe-table-column>
              <vxe-table-column field="human.data_size" title="数据大小" width="100" sortable></vxe-table-column>
              <vxe-table-column field="human.index_size" title="索引大小" width="100" sortable></vxe-table-column>
              <vxe-table-column field="human.data_free_size" title="碎片大小" width="100" sortable></vxe-table-column>
              <vxe-table-column field="human.avg_row_size" title="平均行尺寸" width="110" sortable></vxe-table-column>
              <vxe-table-column field="update_time" title="更新时间" width="140" sortable></vxe-table-column>
              <vxe-table-column field="table_comment" title="表注释" width="140"></vxe-table-column>
            </vxe-table>
          </div>
        </el-card>
      </div>
    </div>
  </d2-container>
</template>

<script>

import { system } from '@api/sys'

export default {
  name: 'SystemInfo',
  components: {},
  data () {
    return {
      loading: {
        system: false,
        database: false,
      },
      tableData: [],
      database: [],
    }
  },
  methods: {
    load () {
      this.loading.system = true
      system.sysinfo()
        .then(data => {
          const result = []
          for (const key of Object.keys(data)) {
            result.push({
              name: data[key][0],
              value: data[key][1],
            })
          }
          this.tableData = result
        }).finally(() => {
          this.loading.system = false
        })

      this.loading.database = true
      system.database()
        .then(data => {
          this.database = data
        })
        .finally(() => {
          this.loading.database = false
        })
    },
    databaseSortMethod ({ data, column, property, order }) {
      const humanMap = {
        avg_row_size: 'avg_row_length',
        data_size: 'data_length',
        index_size: 'index_length',
        data_free_size: 'data_free',
        total_size: (item) => item.data_length + item.index_length
      }

      let sortProperty = property

      if (property.startsWith('human.') && Object.prototype.hasOwnProperty.call(humanMap, property.split('.')[1])) {
        sortProperty = humanMap[property.split('.')[1]]
      }

      data.sort((a, b) => {
        let aVal
        let bVal

        if (typeof sortProperty === 'function') {
          aVal = sortProperty(a)
          bVal = sortProperty(b)
        } else {
          aVal = a[sortProperty]
          bVal = b[sortProperty]
        }

        if (order === 'desc') {
          return aVal < bVal ? 1 : -1
        } else {
          return aVal > bVal ? 1 : -1
        }
      })

      return data
    },
  },
  mounted () {
    this.load()
  },
}
</script>

<style lang="scss" scoped>
</style>
