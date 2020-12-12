<template>
  <el-dialog :visible.sync="visible" @close="onClose" title="用户编辑" width="450px" footer-hide :styles="{top: '20px'}">
    <el-form ref="form" :model="formData" :rules="rules" label-width="80px" v-loading="loading">
      <el-form-item label="账户类型" prop="genre" v-show="!id">
        <el-select v-model="formData.genre" placeholder="请选择角色类型">
          <el-option v-for="item in usersGenre" :key="item.value" :value="item.value" :label="item.label"/>
        </el-select>
      </el-form-item>
      <el-form-item label="账户角色" prop="role_id">
        <el-select v-model="formDataRoleId" placeholder="请选择用户角色">
          <el-option v-for="item in roleList" :key="item.value" :value="item.value" :label="item.label"/>
        </el-select>
      </el-form-item>
      <el-form-item label="账号" prop="username">
        <el-input name="username"  v-model.trim="formData.username" :readonly="!!id"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input name="nickname" v-model.trim="formData.nickname"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model.trim="formData.password" placeholder="为空则不更改用户密码" password></el-input>
      </el-form-item>
      <el-form-item label="二次确认" prop="repeatPassword" v-show="!!formData.password">
        <el-input type="password" v-model.trim="formData.repeatPassword" placeholder="为空则不更改用户密码" password></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-checkbox v-model="formDataStatus"><span style="padding-left: 4px">启用</span></el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import store from '@/store/index'
import { getUser, getRolesSelect, saveUser } from '@api/admin/admin'
import { ADMIN_USER_ROLE_MAPPING, ADMIN_USERS_GENRE, toLabelValue } from '@/store/constant'
import { cloneDeep } from 'lodash'
import { hash } from '@/libs/util.crypto'

export default {
  name: 'UserEdit',
  data () {
    return {
      id: 0,
      usersGenre: toLabelValue(ADMIN_USERS_GENRE).filter(d => {
        const genre = store.state.d2admin.user.info.user.genre
        return d.value >= genre
      }),
      visible: false,
      loading: false,
      roleList: [],
      formData: {
        genre: store.state.d2admin.user.info.user.genre,
        username: '',
        nickname: '',
        password: '',
        role_id: 0,
        status: 0,
        repeatPassword: '',
      },
      rules: {
        genre: [
          { required: true },
        ],
        username: [
          { required: true, min: 2, max: 64 },
        ],
        nickname: [
          { required: true, min: 2, max: 64 },
        ],
        password: [
          // { required: !this.id }, iview表单动态规则响应不完善
          { min: 6, max: 64 },
        ],
        repeatPassword: [
          {
            validator: (rule, value, callback) => {
              if (value === undefined) {
                return true
              }
              return value === this.formData.password
            },
            message: '两次输入的密码要一致',
          }
        ]
      },
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
  watch: {
    'formData.genre' (v) {
      this.loading = true
      getRolesSelect(ADMIN_USER_ROLE_MAPPING[v]).then(d => {
        this.roleList = d
      }).finally(() => {
        this.loading = false
      })
    }
  },
  methods: {
    open (id = 0) {
      this.id = id
      this.visible = true
      this.$nextTick(() => {
        this.loadData()
      })
    },
    onClose () {
      this.$refs.form.resetFields()
    },
    loadData () {
      this.loading = true
      Promise.all([
        getRolesSelect(ADMIN_USER_ROLE_MAPPING[this.formData.genre]),
        getUser(this.id),
      ]).then(values => {
        this.$refs.form.resetFields()
        this.roleList = values[0]
        if (values[1]) {
          values[1].password = ''
          this.formData = values[1]
        }
      }).finally(() => {
        this.loading = false
      })
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const data = cloneDeep(this.formData)
          if (data.password) {
            data.password = hash('sha256', data.password)
          }
          delete data.repeatPassword
          saveUser(this.id, data).then(() => {
            this.visible = false
          }).finally(() => {
            this.loading = false
            this.$emit('on-submit')
          })
        } else {
          this.$message.error('请输入正确的表单')
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
