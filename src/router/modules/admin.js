import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

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
      },
    }, {
      path: 'roles',
      name: 'RolesIndex',
      component: _import('admin/roles-index'),
      meta: {
        title: '角色管理',
        cache: true,
      },
    },
  ],
}
