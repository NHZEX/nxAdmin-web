<template>
  <d2-container>
    <div style="margin-bottom: 10px">
      <i-button type="primary" icon="md-refresh" :loading="loading" @click="refresh">刷新</i-button>
      <users-edit @data-change="refresh">
        <i-button type="primary" icon="md-add">添加</i-button>
      </users-edit>
    </div>
    <i-page-table :columns="columns" :data="data" :loading="loading" row-key="id" border
                  @page-change="pageChange" :pageTotal="page.total" :page-current="page.current" :page-size="page.size">
      <template v-slot:formatTime="{ row, column }">
        {{ dayjs.unix(row[column.key]).format('YYYY-MM-DD HH:mm') }}
      </template>
      <template v-slot:action="{ row, index }">
        <users-edit :id="row.id" @data-change="refresh">
          <i-button type="primary" size="small">编辑</i-button>
        </users-edit>
        <poptip confirm transfer placement="top-end" title="确认删除?" @on-ok="tableDelete(index, row.id)">
          <i-button type="error" size="small" :loading="row.__loadingDelete">删除</i-button>
        </poptip>
      </template>
    </i-page-table>
  </d2-container>
</template>

<script>
  import iButton from '@ivu/button'
  import Poptip from '@ivu/poptip'
  import iPageTable from '@/components/common/i-page-table'
  import UsersEdit from './users-edit'
  import { deleteUser, getRolesSelect, getUsers } from '@api/admin/admin'
  import dayjs from 'dayjs'
  import { ADMIN_USERS_GENRE, toLabelValue } from '@/store/constant'

  export default {
    name: 'UsersIndex',
    components: {
      iButton,
      iPageTable,
      Poptip,
      UsersEdit
    },
    data () {
      return {
        dayjs,
        loading: false,
        columns: [
          { title: 'id', key: 'id', width: 80 },
          { title: '类型',
            key: 'genre_desc',
            width: 120,
            filters: toLabelValue(ADMIN_USERS_GENRE),
            filterMultiple: false,
            filterRemote: this.filterRemote,
          },
          { title: '角色',
            key: 'role_name',
            width: 120,
            filters: getRolesSelect(),
            filterMultiple: false,
            filterRemote: this.filterRemote,
          },
          { title: '账号', key: 'username' },
          { title: '昵称', key: 'nickname' },
          { title: '邮箱', key: 'email' },
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
          role_id: 0,
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
        getUsers(this.page.current, this.page.size, this.where).then(({ data, count }) => {
          this.data = data.map(d => {
            d.__loadingDelete = false
            return d
          })
          this.page.total = data.count
        }).finally(() => {
          this.loading = false
        })
      },
      searchSubmit () {
        this.page.current = 1
        this.refresh()
      },
      filterRemote (values, key) {
        switch (key) {
          case 'genre_desc':
            this.where.genre = values[0]
            break
          case 'role_name':
            this.where.role_id = values[0]
            break
          default:
            break
        }
        this.searchSubmit()
      },
      tableDelete (index, id) {
        let row = this.data[index]
        row.__loadingDelete = true
        deleteUser(id).finally(() => {
          row.__loadingDelete = false
          this.refresh()
        })
      },
    },
    mounted () {
      this.refresh()
    },
    comments: {
    },
    watch: {
    },
  }
</script>

<style scoped>

</style>
