<template>
  <d2-container ref="container">
    <div style="margin-bottom: 10px">
      <el-button type="primary" :loading="loading.render" @click="load" icon="el-icon-refresh">刷新</el-button>
      <el-button v-access="'admin.permission.scan'" type="warning" :loading="loading.scan || loading.render" @click="scan()" icon="el-icon-s-opportunity">扫描权限</el-button>
      <el-button v-access="'admin.permission.edit'" type="success" :loading="loading.render" :disabled="!isChange" @click="saveChange()" icon="el-icon-upload">保存更改</el-button>
      <el-button v-access="'admin.resetCache'" type="warning" :loading="loading.reset" @click="resetCache()" icon="el-icon-refresh-right">重置缓存</el-button>
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
      :expand-config="{accordion: true, lazy: true, loadMethod: loadContentMethod}"
      @edit-closed="editClosed"
      @toggle-row-expand="toggleRowExpand"
    >
      <template v-slot:sort="{ row, column }">
          <i class="el-icon-edit"/><span style="color: #515a6e">&nbsp;{{ row[column.property] }}</span>
      </template>
      <template v-slot:desc="{ row, column }">
          <i class="el-icon-edit"/><span style="color: #515a6e">&nbsp;{{ row[column.property] ? row[column.property] : '[无注释]' }}</span>
      </template>
      <template v-slot:action="{ row }">
        <el-button type="info" size="mini" :loading="row._control.loading"
                   icon="el-icon-document"
                   @click="permissionView(row.name, row)"
        >查看节点</el-button>
      </template>
      <template v-slot:expand="{ row }">
        <vxe-grid :columns="control.columns" :data="row._control.data" max-height="350px">
        </vxe-grid>
      </template>
    </vxe-grid>
  </d2-container>
</template>

<script>
import { permission } from '@api/admin/admin'
import { system } from '@api/sys'
import ContainerResize from '@/mixin/container-resize'

const recursionTree = (d) => {
  return d.map(el => {
    el._control = {
      loading: false,
      open: false,
      data: [],
    }
    if (el.children && el.children.length) {
      el._showChildren = true
      el.children = recursionTree(el.children)
    }
    return el
  })
}

export default {
  name: 'admin-permission',
  components: {},
  mixins: [ContainerResize],
  data () {
    return {
      loading: {
        render: false,
        scan: false,
        reset: false,
      },
      columns: [
        { type: 'expand', visible: false, slots: { content: 'expand' } },
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
      control: {
        loading: false,
        columns: [
          { title: '节点', field: 'name', width: 280 },
          { title: '注释', field: 'desc' },
        ],
        data: [],
      },
    }
  },
  methods: {
    permissionView (id, row) {
      this.$refs.tree.toggleRowExpand(row)
    },
    async load () {
      this.loading.render = true
      this.isChange = false
      let data
      try {
        data = await permission.get()
      } finally {
        this.loading.render = false
      }
      this.data = recursionTree(data)
      await this.$nextTick()
      this.$refs.tree.setAllTreeExpand(true)
    },
    async loadContentMethod ({ row }) {
      row._control.loading = true
      row._control.open = true
      row._control.data = []
      try {
        const result = await permission.read(row.name)
        if (result) {
          row._control.data = result.allow
        }
      } finally {
        row._control.loading = false
      }
    },
    toggleRowExpand ({ expanded, row }) {
      row._control.open = expanded
    },
    scan () {
      this.loading.scan = true
      permission.scan().finally(() => {
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
      permission.save(null, rows, true).finally(() => {
        this.loading.render = false
        this.load()
      })
    },
    resetCache () {
      this.loading.reset = true
      system.resetCache().finally(() => {
        this.loading.reset = false
        this.$message.success('重置缓存完成')
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
