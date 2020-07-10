<template>
  <d2-container ref="container">
    <div style="margin-bottom: 5px">
      <i-button type="primary" icon="md-refresh" :loading="loading.render" @click="load">刷新</i-button>
      <i-button v-access="'admin.permission.scan'" type="warning" icon="md-refresh" :loading="loading.scan" @click="scan()">扫描权限</i-button>
    </div>
    <vxe-virtual-tree
      ref="tree"
      show-overflow
      row-key
      row-id="name"
      :height="targetHeight"
      :loading="loading.render"
      :columns="columns"
      :data="data"
      :tree-config="{children: 'children'}"
    >
      <template v-slot:sort="{ row, column }">
        <a @click="quickEdit(row.name, column.property, row[column.property])">
          <icon type="md-create" :size="15"/><span style="color: #515a6e">&nbsp;{{ row[column.property] }}</span>
        </a>
      </template>
      <template v-slot:desc="{ row, column }">
        <a @click="quickEdit(row.name, column.property, row[column.property])">
          <icon type="md-create" :size="15"/><span style="color: #515a6e">&nbsp;{{ row[column.property] ? row[column.property] : '[无注释]' }}</span>
        </a>
      </template>
      <template v-slot:action="{ row }">
        <admin-permission-view :id="row.name">
          <i-button type="primary" size="small">查看</i-button>
        </admin-permission-view>
      </template>
    </vxe-virtual-tree>
    <i-qucik-edit ref="quick" @submit="quickSubmit"/>
  </d2-container>
</template>

<script>
  import IQucikEdit from '@/components/common/i-quick-edit'
  import iButton from '@ivu/button'
  import Icon from '@ivu/icon'
  import adminPermissionView from './permission-view'
  import { getPermissions, savePermission, scanPermission } from '@api/admin/admin'
  import ContainerResize from '@/mixin/container-resize'

  export default {
    name: 'admin-permission',
    components: {
      iButton,
      Icon,
      IQucikEdit,
      adminPermissionView,
    },
    mixins: [ContainerResize],
    data () {
      return {
        loading: {
          render: false,
          scan: false,
        },
        columns: [
          { title: '权限', field: 'title', treeNode: true, width: 350 },
          { title: '排序', field: 'sort', width: 130, slots: { default: 'sort' } },
          { title: '注释', field: 'desc', minWidth: 150, slots: { default: 'desc' } },
          { title: '查看', minWidth: 80, slots: { default: 'action' } },
        ],
        data: [
        ],
      }
    },
    methods: {
      load () {
        this.loading.render = true
        getPermissions().then(data => {
          const recursion = (d) => {
            return d.map(el => {
              if (el.children && el.children.length) {
                el._showChildren = true
                el.children = recursion(el.children)
              }
              return el
            })
          }
          this.data = recursion(data)
          this.$nextTick(() => {
            this.$refs.tree.setAllTreeExpand(true)
          })
        }).finally(() => {
          this.loading.render = false
        })
      },
      scan () {
        this.loading.scan = true
        scanPermission().finally(() => {
          this.loading.scan = false
          this.load()
        })
      },
      quickEdit (name, field, value) {
        this.$refs.quick.openEx(name, field, value, {
          title: field === 'sort' ? '更改排序' : '更改注释'
        })
      },
      quickSubmit ({ id, field, value }) {
        console.log(id, field, value)
        this.loading.render = true
        savePermission(id, {
          [field]: value,
        }).finally(() => {
          this.loading.render = false
          this.load()
        })
      }
    },
    mounted () {
      this.load()
    },
    beforeDestroy () {
    }
  }
</script>

<style scoped>

</style>
