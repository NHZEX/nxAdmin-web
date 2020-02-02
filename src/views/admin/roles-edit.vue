<template>
  <span>
    <span @click="visible = true">
      <slot/>
    </span>
    <el-dialog title="角色" :visible.sync="visible" width="450px" @open="onOpen" @close="onClose">
      <el-form ref="form" :model="formData" :rules="rules" label-width="70px" v-loading="loading">
        <el-form-item label="类型" prop="genre" v-show="!id">
          <el-select v-model="formDataGenre" placeholder="请选择角色类型" style="width: 100%">
            <el-option v-for="item in rolesGenre" :key="item.value" :label="item.text" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name"/>
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
import { saveRole, getRole } from '@api/admin/admin'

export default {
  name: 'RolesEdit',
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  data () {
    return {
      rolesGenre: constant.admin.rolesGenre,
      visible: false,
      loading: false,
      formData: {
        genre: 0,
        name: '',
        status: 0,
      },
      rules: {
        genre: [
          { type: 'number', min: 1, message: '请选择一个项目', required: true },
        ],
        name: [
          { type: 'string', min: 2, message: '请填写角色名称（最少两个字符）', required: true },
        ],
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
    formDataGenre: {
      get: function () {
        return this.formData.genre === 0 ? null : this.formData.genre
      },
      set: function (newValue) {
        this.formData.genre = newValue || 0
      },
    },
  },
  methods: {
    onOpen () {
      this.loading = true
      getRole(this.id).then(data => {
        if (data) {
          this.formData = data
        }
      }).finally(() => {
        this.loading = false
      })
    },
    onClose () {
      if (!this.id) {
        this.$refs['form'].resetFields()
      }
    },
    submit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          saveRole(this.id, this.formData).finally(() => {
            this.loading = false
            this.$emit('on-submit')
          })
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
