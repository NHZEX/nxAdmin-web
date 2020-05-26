<template>
  <span>
    <span @click="visible = true">
      <slot/>
    </span>
    <modal v-model="visible" @on-visible-change="onVisible" title="用户编辑" width="450px" footer-hide :styles="{top: '20px'}">
      <spin fix v-if="loading"/>
      <i-form ref="form" :model="formData" :rules="rules" :label-width="80">
        <form-item label="账户类型" prop="genre" v-show="!id">
          <i-select v-model="formData.genre" placeholder="请选择角色类型">
            <i-option v-for="(value, key) in usersGenre" :key="key" :value="parseInt(key)">{{ value }}</i-option>
          </i-select>
        </form-item>
        <form-item label="账户角色" prop="role_id">
          <i-select v-model="formDataRoleId" placeholder="请选择用户角色">
            <i-option v-for="item in roleList" :key="item.value" :value="item.value">{{ item.label }}</i-option>
          </i-select>
        </form-item>
        <form-item label="账号" prop="username">
          <i-input v-model.trim="formData.username" :readonly="!!id"></i-input>
        </form-item>
        <form-item label="昵称" prop="nickname">
          <i-input v-model.trim="formData.nickname"></i-input>
        </form-item>
        <form-item label="密码" prop="password">
          <i-input v-model.trim="formData.password" placeholder="为空则不更改用户密码"></i-input>
        </form-item>
        <form-item label="状态" prop="status">
          <checkbox v-model="formDataStatus"><span style="padding-left: 4px">启用</span></checkbox>
        </form-item>
        <form-item>
          <i-button type="primary" @click="submit">提交</i-button>
        </form-item>
      </i-form>
    </modal>
  </span>
</template>

<script>
  import Modal from '@ivu/modal'
  import iInput from '@ivu/input'
  import iForm from '@ivu/form'
  import FormItem from '@ivu/form-item'
  import iSelect from '@ivu/select'
  import iOption from '@ivu/option'
  import Checkbox from '@ivu/checkbox'
  import iButton from '@ivu/button'
  import Spin from '@ivu/spin'
  import { getUser, getRolesSelect, saveUser } from '@api/admin/admin'
  import { ADMIN_USERS_GENRE } from '@/store/constant'
  import { cloneDeep } from 'lodash'
  import { hash } from '@/libs/util.crypto'

  export default {
    name: 'UserEdit',
    components: {
      Modal,
      iInput,
      iForm,
      FormItem,
      iSelect,
      iOption,
      Checkbox,
      iButton,
      Spin,
    },
    props: {
      id: {
        type: Number,
        default: 0,
      },
    },
    data () {
      return {
        usersGenre: ADMIN_USERS_GENRE,
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
      onVisible (visible) {
        if (visible) {
          this.loadData()
        } else {
          this.$refs.form.resetFields()
        }
      },
      loadData () {
        this.loading = true
        Promise.all([
          getRolesSelect(),
          getUser(this.id),
        ]).then(values => {
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
          this.loading = true
          if (valid) {
            const data = cloneDeep(this.formData)
            if (data.password) {
              data.password = hash('sha256', data.password)
            }
            saveUser(this.id, data).then(() => {
              this.visible = false
            }).finally(() => {
              this.loading = false
              this.$emit('on-submit')
            })
          }
        })
      },
    },
    watch: {
    },
  }
</script>

<style scoped>

</style>
