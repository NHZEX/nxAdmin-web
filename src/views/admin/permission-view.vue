<template>
  <span>
    <modal v-model="visible" :footer-hide="true" :title="'查看权限'" width="600"
           :styles="{top: '20px'}"
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
            <vxe-grid :loading="controlLoading" :columns="controlColumns" :data="controlData"
                     max-height="350px" :show-header="false">
            </vxe-grid>
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
  import iInput from '@ivu/input'
  import iForm from '@ivu/form'
  import formItem from '@ivu/form-item'
  import modal from '@ivu/modal'
  import { getPermission } from '@api/admin/admin'

  export default {
    name: 'admin-permission-view',
    components: {
      iInput,
      iForm,
      formItem,
      modal,
    },
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
