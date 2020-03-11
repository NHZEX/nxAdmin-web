import layoutHeaderAside from '@/layout/header-aside'

const _import = require('@/libs/util.import')

export default {
  path: '/admin',
  // redirect: { name: 'AdminUsers' },
  component: layoutHeaderAside,
  children: [
    {
      path: 'users',
      name: 'AdminUsers',
      component: _import('admin/users-index'),
      meta: {
        title: '系统用户',
        cache: true,
        auth: 'user',
      },
    }, {
      path: 'roles',
      name: 'RolesIndex',
      component: _import('admin/roles-index'),
      meta: {
        title: '角色管理',
        cache: true,
        auth: 'role',
      },
    },
    {
      path: 'permission',
      name: 'AdminPermission',
      component: _import('admin/permission'),
      meta: {
        title: '权限管理',
        cache: true,
        auth: 'permission',
      },
    },
  ],
}
