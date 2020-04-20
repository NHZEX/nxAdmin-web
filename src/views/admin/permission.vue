<template>
  <d2-container>
    <div style="margin-bottom: 5px">
      <i-button type="primary" icon="md-refresh" :loading="loading.render" @click="load">刷新</i-button>
      <i-button v-access="'permission.scan'" type="warning" icon="md-refresh" :loading="loading.scan" @click="scan()">扫描权限</i-button>
    </div>
    <i-table border :loading="loading.render" :columns="columns" :data="data" row-key="name">
      <template v-slot:title="{ row, column }">
        <span>{{ row[column.key] }}</span>
      </template>
      <template v-slot:sort="{ row, column }">
        <i-input size="small" v-model.number="row[column.key]" type="number" :readonly="true" placeholder="0" @on-enter="submitChange(row.name, row[column.key])"></i-input>
      </template>
      <template v-slot:desc="{ row, column }">
        <i-input size="small" v-model="row[column.key]" :readonly="true" placeholder="输入注释" @on-enter="submitChange(row.name, row[column.key])"></i-input>
      </template>
      <template v-slot:action="{ row }">
        <admin-permission-view :id="row.name">
          <i-button type="primary" size="small">查看</i-button>
        </admin-permission-view>
      </template>
    </i-table>
  </d2-container>
</template>

<script>
  import iButton from '@ivu/button'
  import iTable from '@ivu/table'
  import iInput from '@ivu/input'
  import adminPermissionView from './permission-view'
  import { getPermissions, scanPermission } from '@api/admin/admin'

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
      iInput,
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
      del (id) {
      },
      scan () {
        this.loading.scan = true
        scanPermission().finally(() => {
          this.loading.scan = false
          this.load()
        })
      },
      submitChange (name, value) {
        console.log(name, value)
      // todo 在线编辑考虑是否加入
      // this.loading.render = true
      },
    },
    mounted () {
      this.load()
    },
  }
</script>

<style scoped>

</style>
