<template>
  <span>
    <span @click="visible = true">
      <slot/>
    </span>
    <el-dialog title="用户" :visible.sync="visible" width="450px" @open="onOpen">
      <el-form :model="formData" :rules="rules" ref="form" label-width="70px" v-loading="loading">
        <el-form-item label="账户类型" prop="genre" v-show="!id">
          <el-select v-model="formData.genre" placeholder="请选择用户类型" style="width: 100%">
            <el-option v-for="item in usersGenre" :key="item.value" :label="item.text" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="formData.username"/>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password"/>
        </el-form-item>
        <el-form-item label="账户角色" prop="role_id">
          <el-select v-model="formDataRoleId" placeholder="请选择用户角色" style="width: 100%">
            <el-option v-for="item in roleList" :key="item.value" :value="item.value" :label="item.text"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-checkbox v-model="formDataStatus">启用</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </span>
</template>

<script>
import constant from '@/constant'
import { getUser, getRolesSelect, saveUser } from '@api/admin/admin'

export default {
  name: 'UsersEdit',
  props: {
    id: {
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
      usersGenre: constant.admin.usersGenre,
      visible: false,
      loading: false,
      roleList: [],
      formData: {
        genre: null,
        username: '',
        nickname: '',
        password: '',
        role_id: 0,
        status: 0,
      },
      rules: {},
    }
  },
  computed: {
    formDataStatus: {
      get: function () {
        return this.formData.status === 0
      },
      set: function (newValue) {
        this.formData.status = newValue ? 0 : 1
      },
    },
    formDataRoleId: {
      get: function () {
        return this.formData.role_id === 0 ? null : this.formData.role_id
      },
      set: function (newValue) {
        this.formData.role_id = newValue || 0
      },
    },
  },
  methods: {
    onOpen () {
      this.loadData()
    },
    loadData () {
      this.loading = true
      Promise.all([
        getRolesSelect(),
        getUser(this.id),
      ]).then(values => {
        this.roleList = values[0]
        if (values[1]) {
          this.formData = values[1]
        }
      }).finally(() => {
        this.loading = false
      })
    },
    submit () {
      this.$refs.form.validate(valid => {
        this.loading = true
        if (valid) {
          saveUser(this.id, this.formData).then(() => {
            this.visible = false
            this.$emit('submit-success')
          }).finally(() => {
            this.loading = false
            this.$emit('data-change')
          })
        }
      })
    },
  },
  watch: {
    // 'formData.genre' (val) {
    //   if (val) {
    //     this.loadingRoleList = true
    //     roleList(this.formData.genre).then((data) => {
    //       this.roleList = data
    //     }).finally(() => {
    //       this.loadingRoleList = false
    //     })
    //   } else {
    //     this.roleList = []
    //   }
    // },
  },
}
</script>

<style scoped>

</style>
