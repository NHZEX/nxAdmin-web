<template>
  <span>
    <span @click="visible = true">
      <slot></slot>
    </span>
    <modal v-model="visible" :footer-hide="true" :title="'查看权限'" width="600"
           @on-visible-change="onDisplay" :styles="{top: '20px'}"
    >
      <i-form v-if="visible" ref="form" :model="formData" :rules="formRule" v-loading="loading" :label-width="90">
        <form-item prop="name" label="权限名称">
          <i-input v-model="formData.name" :readonly="true" placeholder="Enter something..."/>
        </form-item>
        <form-item prop="sort" label="显示排序">
          <i-input v-model="formData.sort" type="number" :readonly="true" placeholder="Enter something..."/>
        </form-item>
        <form-item prop="control" label="授权分配">
          <div >
            <i-table border size="small"
                     :loading="controlLoading" :columns="controlColumns" :data="controlData"
                     max-height="350" :show-header="false"
            >
            </i-table>
          </div>
        </form-item>
        <form-item prop="desc" label="描述">
          <i-input v-model="formData.desc" :maxlength="256" :readonly="true" show-word-limit type="textarea" placeholder="Enter something..."/>
        </form-item>
      </i-form>
    </modal>
  </span>
</template>

<script>
import iTable from '@ivu/table'
import iInput from '@ivu/input'
import iForm from '@ivu/form'
import formItem from '@ivu/form-item'
import modal from '@ivu/modal'
import { getPermission } from '@api/admin/admin'

export default {
  name: 'admin-permission-view',
  components: {
    iTable,
    iInput,
    iForm,
    formItem,
    modal,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
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
        { title: '节点', key: 'name', width: 280 },
        { title: '注解', key: 'desc' },
      ],
      controlData: [],
    }
  },
  computed: {
  },
  methods: {
    onDisplay (visible) {
      if (visible) {
        this.render()
      }
    },
    render () {
      if (this.id === 0) {
        return
      }
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
