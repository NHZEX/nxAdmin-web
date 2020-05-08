<template>
  <d2-container>
    <div style="margin-bottom: 10px">
      <i-button type="primary" icon="md-refresh" :loading="loading" @click="refresh">刷新</i-button>
      <role-edit @on-submit="refresh">
        <i-button type="primary" icon="md-add">添加</i-button>
      </role-edit>
    </div>
    <i-page-table :columns="columns" :data="data" :filters="filters" :loading="loading" row-key="id" border
                  v-model="page" @page-change="refresh">
      <template v-slot:formatTime="{ row, column }">
        {{ dayjs.unix(row[column.key]).format('YYYY-MM-DD HH:mm') }}
      </template>
      <template v-slot:action="{ row }">
        <role-edit :id="row.id" @on-submit="refresh">
          <i-button type="primary" size="small">编辑</i-button>
        </role-edit>
        <poptip confirm transfer placement="top-end" title="确认删除?" @on-ok="roleDelete(row.id)">
          <i-button type="error" size="small">删除</i-button>
        </poptip>
      </template>
    </i-page-table>
  </d2-container>
</template>

<script>
  import iButton from '@ivu/button'
  import Poptip from '@ivu/poptip'
  import iPageTable from '@/components/common/i-page-table'
  import dayjs from 'dayjs'
  import RoleEdit from './role-edit'
  import pageOption from '@/mixin/page-option'
  import { deleteRole, getRoles } from '@api/admin/admin'
  import { ADMIN_ROLES_GENRE, toLabelValue } from '@/store/constant'

  export default {
    name: 'admin-role-index',
    components: {
      iButton,
      Poptip,
      iPageTable,
      RoleEdit
    },
    mixins: [pageOption],
    data () {
      return {
        dayjs,
        loading: false,
        filters: {
          genre: {
            data: toLabelValue(ADMIN_ROLES_GENRE),
            multiple: false,
            remote: this.filterRemote,
          },
        },
        columns: [
          { title: 'id', key: 'id', width: 80 },
          { title: '类型', key: 'genre_desc', width: 100, filter: 'genre' },
          { title: '名称', key: 'name', width: 240 },
          { title: '状态', key: 'status_desc', width: 70 },
          { title: '创建时间', key: 'create_time', slot: 'formatTime', width: 135 },
          { title: '更新时间', key: 'update_time', slot: 'formatTime', width: 135 },
          { title: '操作', slot: 'action', minWidth: 200, fixed: 'right' },
        ],
        data: [],
        where: {
          genre: 0,
        },
      }
    },
    methods: {
      refresh () {
        this.loading = true
        getRoles(this.page.current, this.page.size, this.where).then(({ data, count }) => {
          this.data = data
          this.page.total = count
        }).finally(() => {
          this.loading = false
        })
      },
      searchSubmit () {
        this.page.current = 1
        this.refresh()
      },
      filterRemote (values, key) {
        if (key === 'genre_desc') {
          this.where.genre = values[0]
        }
        this.searchSubmit()
      },
      roleDelete (id) {
        this.loading = true
        deleteRole(id).finally(() => {
          this.refresh()
        })
      },
    },
    mounted () {
      this.refresh()
    },
  }
</script>

<style scoped>

</style>
