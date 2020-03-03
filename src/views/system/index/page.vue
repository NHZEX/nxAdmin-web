<template>
  <d2-container class="page">
    <el-table :data="tableData" border size="mini" style="width: 450px">
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
  </d2-container>
</template>

<script>

import { sysinfo } from '@api/sys'

export default {
  components: {},
  data () {
    return {
      tableData: [],
    }
  },
  methods: {
    load () {
      sysinfo().then(data => {
        let result = []
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            result.push({
              'name': data[key][0],
              'value': data[key][1],
            })
          }
        }
        this.tableData = result
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
