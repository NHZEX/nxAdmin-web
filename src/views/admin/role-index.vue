<template>
  <d2-container>
    <div style="margin-bottom: 10px">
      <i-button type="primary" icon="md-refresh" :loading="loading" @click="refresh">刷新</i-button>
      <role-edit @on-submit="refresh">
        <i-button type="primary" icon="md-add">添加</i-button>
      </role-edit>
    </div>
    <i-page-table :columns="columns" :data="data" :loading="loading" row-key="id" border
                  @page-change="pageChange" :pageTotal="page.total" :page-current="page.current" :page-size="page.size">
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
  import { deleteRole, getRoles } from '@api/admin/admin'
  import { ADMIN_ROLES_GENRE, toLabelValue } from '@/store/constant'

  export default {
    name: 'RoleIndex',
    components: {
      iButton,
      Poptip,
      iPageTable,
      RoleEdit
    },
    data () {
      return {
        dayjs,
        loading: false,
        columns: [
          { title: 'id', key: 'id', width: 80 },
          { title: '类型',
            key: 'genre_desc',
            width: 100,
            filters: toLabelValue(ADMIN_ROLES_GENRE),
            filterMultiple: false,
            filterRemote: this.filterRemote,
          },
          { title: '名称', key: 'name' },
          { title: '状态', key: 'status_desc', width: 70 },
          { title: '创建时间', key: 'create_time', slot: 'formatTime', width: 135 },
          { title: '更新时间', key: 'update_time', slot: 'formatTime', width: 135 },
          { title: '操作', slot: 'action', width: 200 },
        ],
        data: [],
        page: {
          total: 0,
          current: 1,
          size: 10,
        },
        where: {
          genre: 0,
        },
      }
    },
    methods: {
      pageChange ({ current, size }) {
        this.page.current = current
        this.page.size = size
        this.refresh()
      },
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
