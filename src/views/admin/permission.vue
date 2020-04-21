<template>
  <d2-container>
    <div style="margin-bottom: 5px">
      <i-button type="primary" icon="md-refresh" :loading="loading.render" @click="load">刷新</i-button>
      <i-button v-access="'admin.permission.scan'" type="warning" icon="md-refresh" :loading="loading.scan" @click="scan()">扫描权限</i-button>
    </div>
    <i-table border :loading="loading.render" :columns="columns" :data="data" row-key="name">
      <template v-slot:title="{ row, column }">
        <span>{{ row[column.key] }}</span>
      </template>
      <template v-slot:sort="{ row, column }">
        <a @click="quickEdit(row.name, column.key, row[column.key])">
          <icon type="md-create" :size="15"/><span style="color: #515a6e">&nbsp;{{ row[column.key] }}</span>
        </a>
      </template>
      <template v-slot:desc="{ row, column }">
        <a @click="quickEdit(row.name, column.key, row[column.key])">
          <icon type="md-create" :size="15"/><span style="color: #515a6e">&nbsp;{{ row[column.key] ? row[column.key] : '[无注释]' }}</span>
        </a>
      </template>
      <template v-slot:action="{ row }">
        <admin-permission-view :id="row.name">
          <i-button type="primary" size="small">查看</i-button>
        </admin-permission-view>
      </template>
    </i-table>
    <i-qucik-edit ref="quick" :title="quickTitle" @submit="quickSubmit"/>
  </d2-container>
</template>

<script>
  import IQucikEdit from '@/components/common/i-quick-edit'
  import iButton from '@ivu/button'
  import iTable from '@ivu/table'
  import Icon from '@ivu/icon'
  import adminPermissionView from './permission-view'
  import { getPermissions, savePermission, scanPermission } from '@api/admin/admin'

  /**
   * @param h {CreateElement}
   * @param p {Object}
   * @returns {*}
   */
  function renderTpl (h, p) {
    const text = p.row[p.column.key]
    return h('span', {
      domProps: { innerHTML: p.row.children && p.row.children.length > 0 ? `&nbsp;&nbsp;${text}` : text },
    })
  }

  export default {
    name: 'admin-permission',
    components: {
      iButton,
      iTable,
      Icon,
      IQucikEdit,
      adminPermissionView,
    },
    data () {
      return {
        loading: {
          render: false,
          scan: false,
        },
        columns: [
          { title: '权限', key: 'title', tree: true, width: 350, render: renderTpl },
          { title: '排序', slot: 'sort', key: 'sort', width: 100 },
          { title: '注释', slot: 'desc', key: 'desc' },
          { title: '查看', slot: 'action', width: 80 },
        ],
        data: [
        ],
        quickTitle: '',
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
        this.quickTitle = (field === 'sort' ? '更改排序' : '更改注释')
        this.$refs.quick.open(name, field, value)
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
  }
</script>

<style scoped>

</style>
