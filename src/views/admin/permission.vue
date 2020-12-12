<template>
  <d2-container ref="container">
    <div style="margin-bottom: 10px">
      <el-button type="primary" :loading="loading.render" @click="load" icon="el-icon-refresh">刷新</el-button>
      <el-button v-access="'admin.permission.scan'" type="warning" :loading="loading.scan || loading.render" @click="scan()" icon="el-icon-s-opportunity">扫描权限</el-button>
      <el-button v-access="'admin.permission.edit'" type="success" :loading="loading.render" :disabled="!isChange" @click="saveChange()" icon="el-icon-upload">保存更改</el-button>
    </div>
    <vxe-grid
      class="sortable-tree-demo"
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
        <el-button type="info" size="mini" @click="permissionView(row.name)">查看</el-button>
      </template>
    </vxe-grid>
    <admin-permission-view ref="view" ></admin-permission-view>
  </d2-container>
</template>

<script>
import adminPermissionView from './permission-view'
import { getPermissions, savePermission, scanPermission } from '@api/admin/admin'
import ContainerResize from '@/mixin/container-resize'
import Sortable from 'sortablejs'
import { findTree } from 'xe-utils'

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
        {
          width: 60,
          slots: {
            default: () => {
              return [
                <span class="drag-btn">
                  <i class="vxe-icon--menu"/>
                </span>
              ]
            },
            header: () => {
              return [
                <vxe-tooltip v-model={ this.showHelpTip2 } content="按住后可以上下拖动排序！" enterable>
                  <i class="vxe-icon--question" onClick={ () => { this.showHelpTip2 = !this.showHelpTip2 } }/>
                </vxe-tooltip>
              ]
            }
          }
        },
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
      sortable2: null,
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
    treeDrop () {
      this.$nextTick(() => {
        const xTable = this.$refs.tree
        this.sortable2 = Sortable.create(xTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
          handle: '.drag-btn',
          fallbackTolerance: 10,
          onMove: function (evt, originalEvent) {
            const draggRow = xTable.getRowNode(evt.dragged).item
            const relatRow = xTable.getRowNode(evt.related).item
            console.log(draggRow.name, relatRow.name, evt.willInsertAfter, draggRow.pid !== relatRow.pid)
            if (draggRow.pid !== relatRow.pid) {
              return false
            }
            if (evt.willInsertAfter) {
              return -1
            } else {
              return true
            }
          },
          onEnd: ({ item, oldIndex }) => {
            const options = { children: 'children' }
            const targetTrElem = item
            const wrapperElem = targetTrElem.parentNode
            const prevTrElem = targetTrElem.previousElementSibling
            const tableTreeData = this.data
            const selfRow = xTable.getRowNode(targetTrElem).item
            const selfNode = findTree(tableTreeData, row => row === selfRow, options)
            if (prevTrElem) {
              // 移动到节点
              const prevRow = xTable.getRowNode(prevTrElem).item
              const prevNode = findTree(tableTreeData, row => row === prevRow, options)
              // console.log(wrapperElem)
              // console.log(selfRow.name, prevRow.name, selfNode, prevNode)
              // console.log(selfRow.name, selfRow.pid, prevRow.name, prevRow.pid)
              if (findTree(selfRow[options.children], row => prevRow === row, options)) {
                // 错误的移动
                const oldTrElem = wrapperElem.children[oldIndex]
                wrapperElem.insertBefore(targetTrElem, oldTrElem)
                return this.$message({ message: '不允许自己给自己拖动！', status: 'error' })
              }
              if (selfRow.pid !== prevRow.pid) {
                // 错误的移动
                const oldTrElem = wrapperElem.children[oldIndex]
                wrapperElem.insertBefore(targetTrElem, oldTrElem)
                return this.$message({ message: '不允许自己给自己拖动！', status: 'error' })
              }
              if (xTable.isTreeExpandByRow(prevRow)) {
                // 移动到当前的子节点
                const currRow = selfNode.items.splice(selfNode.index, 1)[0]
                prevRow[options.children].splice(0, 0, currRow)
              } else {
                // 移动到相邻节点
                const currRow = selfNode.items.splice(selfNode.index, 1)[0]
                prevNode.items.splice(prevNode.index + (selfNode.index < prevNode.index ? 0 : 1), 0, currRow)
              }
            } else {
              // 移动到第一行
              var currRow = selfNode.items.splice(selfNode.index, 1)[0]
              tableTreeData.unshift(currRow)
            }
            // 如果变动了树层级，需要刷新数据
            xTable.syncData()
          }
        })
      })
    }
  },
  created () {
    this.treeDrop()
  },
  beforeDestroy () {
    if (this.sortable2) {
      this.sortable2.destroy()
    }
  },
  async mounted () {
    await this.$nextTick()
    await this.load()
  },
}
</script>

<style scoped>
.sortable-tree-demo .drag-btn {
  cursor: move;
  font-size: 12px;
}
.sortable-tree-demo .vxe-body--row.sortable-ghost,
.sortable-tree-demo .vxe-body--row.sortable-chosen {
  background-color: #dfecfb;
}
</style>
