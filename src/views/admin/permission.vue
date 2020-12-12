<template>
  <d2-container ref="container">
    <div style="margin-bottom: 5px">
      <el-button type="primary" :loading="loading.render" @click="load" icon="el-icon-refresh">刷新</el-button>
      <el-button v-access="'admin.permission.scan'" type="warning" :loading="loading.scan || loading.render" @click="scan()" icon="el-icon-s-opportunity">扫描权限</el-button>
      <el-button v-access="'admin.permission.edit'" type="success" :loading="loading.render" :disabled="!isChange" @click="saveChange()" icon="el-icon-upload">保存更改</el-button>
    </div>
    <vxe-grid
      ref="tree"
      show-overflow
      row-key
      row-id="name"
      :keep-source="true"
      :height="targetHeight"
      :loading="loading.render"
      :columns="columns"
      :data="data"
      :tree-config="{children: 'children'}"
      :edit-config="{trigger: 'dblclick', mode: 'row', autoClear: true, showStatus: true }"
      @edit-closed="editClosed"
    >
      <template v-slot:sort="{ row, column }">
          <i class="el-icon-edit"/><span style="color: #515a6e">&nbsp;{{ row[column.property] }}</span>
      </template>
      <template v-slot:desc="{ row, column }">
          <i class="el-icon-edit"/><span style="color: #515a6e">&nbsp;{{ row[column.property] ? row[column.property] : '[无注释]' }}</span>
      </template>
      <template v-slot:action="{ row }">
        <el-button type="primary" size="mini" @click="permissionView(row.name)">查看</el-button>
      </template>
    </vxe-grid>
    <admin-permission-view ref="view" ></admin-permission-view>
  </d2-container>
</template>

<script>
import adminPermissionView from './permission-view'
import { getPermissions, savePermission, scanPermission } from '@api/admin/admin'
import ContainerResize from '@/mixin/container-resize'

const recursionTree = (d) => {
  return d.map(el => {
    if (el.children && el.children.length) {
      el._showChildren = true
      el.children = recursionTree(el.children)
    }
    return el
  })
}

export default {
  name: 'admin-permission',
  components: {
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
        {
          title: '排序',
          field: 'sort',
          width: 130,
          slots: { default: 'sort' },
          editRender: {
            name: 'input',
            attrs: { type: 'text' }
          }
        },
        {
          title: '注释',
          field: 'desc',
          minWidth: 150,
          slots: { default: 'desc' },
          editRender: {
            name: 'input',
            attrs: { type: 'text' }
          }
        },
        { title: '查看', minWidth: 80, slots: { default: 'action' } },
      ],
      data: [],
      isChange: false,
    }
  },
  methods: {
    permissionView (id) {
      this.$refs.view.open(id)
    },
    async load () {
      this.loading.render = true
      this.isChange = false
      let data
      try {
        data = await getPermissions()
      } finally {
        this.loading.render = false
      }
      this.data = recursionTree(data)
      await this.$nextTick()
      this.$refs.tree.setAllTreeExpand(true)
    },
    scan () {
      this.loading.scan = true
      scanPermission().finally(() => {
        this.loading.scan = false
        this.load()
      })
    },
    editClosed () {
      const rows = this.$refs.tree.getUpdateRecords()
      this.isChange = rows.length > 0
    },
    saveChange () {
      this.loading.render = true
      const rows = {}
      for (const row of this.$refs.tree.getUpdateRecords()) {
        rows[row.name] = {
          sort: row.sort,
          desc: row.desc,
        }
      }
      savePermission(null, rows, true).finally(() => {
        this.loading.render = false
        this.load()
      })
    },
  },
  async mounted () {
    await this.$nextTick()
    await this.load()
  },
  beforeDestroy () {
  }
}
</script>

<style scoped>

</style>
