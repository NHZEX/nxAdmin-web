import layoutHeaderAside from '@/layout/header-aside'

const _import = require('@/libs/util.import')

export default {
  path: '/admin',
  // redirect: { name: 'AdminUsers' },
  component: layoutHeaderAside,
  children: [
    {
      path: 'user',
      name: 'AdminUser',
      component: _import('admin/user-index'),
      meta: {
        title: '系统用户',
        cache: true,
        auth: 'user',
      },
    }, {
      path: 'role',
      name: 'RoleIndex',
      component: _import('admin/role-index'),
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
