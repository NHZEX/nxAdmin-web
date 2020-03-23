<template>
  <span>
    <span @click="visible = true">
      <slot/>
    </span>
    <modal v-model="visible" @on-visible-change="onVisible" title="角色编辑" :loading="loading" width="450px" footer-hide :styles="{top: '20px'}">
      <i-form ref="form" :model="formData" :rules="rules" :label-width="80">
        <form-item label="类型" prop="genre" v-show="!id">
          <i-select v-model="formDataGenre" placeholder="请选择角色类型">
            <i-option v-for="(value, key) in rolesGenre" :key="key" :value="parseInt(key)">{{ value }}</i-option>
          </i-select>
        </form-item>
        <form-item label="名称" prop="name">
          <i-input type="text" v-model="formData.name"></i-input>
        </form-item>
        <form-item label="状态" prop="status">
          <checkbox v-model="formDataStatus"><span style="padding-left: 4px">启用</span></checkbox>
        </form-item>
        <form-item label="权限">
          <div class="radius">
            <tree :data="treeData" :render="treeRender" @on-check-change="onTreeCheck" show-checkbox multiple></tree>
          </div>
        </form-item>
        <form-item>
          <i-button type="primary" @click="submit">提交</i-button>
        </form-item>
      </i-form>
    </modal>
  </span>
</template>

<script>
  import Tree from '@ivu/tree'
  import Modal from '@ivu/modal'
  import iInput from '@ivu/input'
  import iForm from '@ivu/form'
  import FormItem from '@ivu/form-item'
  import iSelect from '@ivu/select'
  import iOption from '@ivu/option'
  import Checkbox from '@ivu/checkbox'
  import iButton from '@ivu/button'
  import { saveRole, getRole, getPermissions } from '@api/admin/admin'
  import { ADMIN_ROLES_GENRE } from '@/store/constant'

  export default {
    name: 'RoleEdit',
    components: {
      Tree,
      Modal,
      iInput,
      iForm,
      FormItem,
      iSelect,
      iOption,
      Checkbox,
      iButton,
    },
    props: {
      id: {
        type: Number,
        default: null,
      },
    },
    data () {
      return {
        rolesGenre: ADMIN_ROLES_GENRE,
        visible: false,
        loading: false,
        formData: {
          genre: 0,
          name: '',
          status: 0,
          ext: {
            permission: [],
          },
        },
        rules: {
          genre: [
            { type: 'number', min: 1, message: '请选择一个项目', required: true },
          ],
          name: [
            { type: 'string', min: 2, message: '请填写角色名称（最少两个字符）', required: true },
          ],
        },
        treeData: [],
        treeCheckedKeys: [],
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
      onVisible (visible) {
        if (visible) {
          this.render()
        } else {
          this.$refs['form'].resetFields()
        }
      },
      treeRender (h, { data }) { // root, node
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%',
          },
        }, `${data.name} (${data.desc ? data.desc : 'null'})`)
      },
      onTreeCheck (checkeds) {
        this.treeCheckedKeys = checkeds.map(v => v.name)
      },
      render () {
        this.loading = true
        Promise.all([getRole(this.id), getPermissions()]).then(values => {
          let role = values[0]
          if (role) {
            if (Array.isArray(role.ext)) {
              role.ext = {}
            }
            this.formData = role
            if (Array.isArray(role.ext.permission)) {
              this.treeCheckedKeys = role.ext.permission
            }
          }
          this.treeData = this.checkTreeData(values[1], this.treeCheckedKeys)
        }).finally(() => {
          this.loading = false
        })
      },
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.formData.ext.permission = this.treeCheckedKeys
            saveRole(this.id, this.formData)
              .then(() => {
                this.visible = false
              }).finally(() => {
                this.loading = false
                this.$emit('on-submit')
              })
          } else {
            return false
          }
        })
      },
      checkTreeData (treeData, checked) {
        let cfun = (tree) => {
          for (let i in tree) {
            if (!tree.hasOwnProperty(i)) {
              continue
            }
            let node = tree[i]

            node.checked = checked.includes(node.name)

            if (node.children && node.children.length > 0) {
              node.children = cfun(node.children)
            }
          }
          return tree
        }
        if (Array.isArray(checked)) {
          return cfun(treeData)
        } else {
          return treeData
        }
      }
    },
  }
</script>

<style scoped>
  .radius {
    border: 1px solid #d7dae2;
    border-radius: 4px;
    line-height: 1.5;
  }
</style>
