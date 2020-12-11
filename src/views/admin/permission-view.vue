<template>
    <el-dialog :visible.sync="visible" title="查看权限" width="700px">
      <el-form v-if="visible" ref="form" :model="formData" :rules="formRule" v-loading="loading" label-width="80px">
        <el-form-item prop="name" label="权限名称">
          <el-input v-model="formData.name" :readonly="true" placeholder="Enter something..."/>
        </el-form-item>
        <el-form-item prop="sort" label="显示排序">
          <el-input v-model="formData.sort" type="number" :readonly="true" placeholder="Enter something..."/>
        </el-form-item>
        <el-form-item prop="control" label="授权分配">
          <div >
            <vxe-grid :loading="controlLoading" :columns="controlColumns" :data="controlData"
                     max-height="350px" :show-header="false">
            </vxe-grid>
          </div>
        </el-form-item>
        <el-form-item prop="desc" label="描述">
          <el-input v-model="formData.desc" :readonly="true" show-word-limit type="textarea" placeholder="Enter something..."/>
        </el-form-item>
      </el-form>
    </el-dialog>
</template>

<script>
import { getPermission } from '@api/admin/admin'

export default {
  name: 'admin-permission-view',
  data: function () {
    return {
      id: '',
      loading: false,
      visible: false,
      formData: {
        pid: '',
        name: '',
        sort: 0,
        control: {},
      },
      formRule: {
      },
      controlLoading: false,
      controlColumns: [
        { title: '节点', field: 'name', width: 280 },
        { title: '注解', field: 'desc' },
      ],
      controlData: [],
    }
  },
  methods: {
    open (id) {
      this.id = id
      this.visible = true
      this.render()
    },
    render () {
      this.loading = true
      getPermission(this.id).then(data => {
        this.formData = data
        this.controlData = data.allow
      }).finally(() => {
        this.loading = false
      })
    },
  },
}
</script>

<style scoped>

</style>
