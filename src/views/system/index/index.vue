<template>
  <d2-container type="ghost">
    <div style="padding: 10px 0 10px">
      <el-table :data="tableData" border size="mini" v-loading="loading" style="width: 450px">
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
    </div>
  </d2-container>
</template>

<script>

import { sysinfo } from '@api/sys'

export default {
  components: {},
  data () {
    return {
      loading: false,
      tableData: [],
    }
  },
  methods: {
    load () {
      this.loading = true
      sysinfo().then(data => {
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
    },
  },
  mounted () {
    this.load()
  },
}
</script>

<style lang="scss" scoped>
</style>
