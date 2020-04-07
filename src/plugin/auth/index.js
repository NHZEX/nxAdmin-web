import util from '@/libs/util.js'
import store from '@/store/index'
import { frameInRoutes } from '@/router/routes'
import { cloneDeep, isBoolean, isEmpty, isPlainObject } from 'lodash'

/**
 * 需要授权验证
 * @param to {Route}
 * @returns {boolean}
 */
export function needAuthorize (to) {
  return to.matched.some(r => !!r.meta.auth)
}

/**
 * 是否已经登录
 * @param tryRemote
 * @return {Promise<boolean>}
 */
export async function isLogin (tryRemote = false) {
  if (tryRemote) {
    // 测试登录状态是否完全无效
    await store.dispatch('d2admin/account/refresh')
  }
  const token = util.cookies.get('token')
  if (!token || token === 'undefined') {
    if (tryRemote) {
      return false
    }
    return isLogin(true)
  } else {
    return true
  }
}

/**
 * @param to {string | Array}
 * @param some {Boolean}
 * @returns {boolean}
 */
export function canAccess (to, some = false) {
  const permission = store.state.d2admin.user.info.permission
  let access = false
  if (Array.isArray(to)) {
    if (some) {
      access = to.some(v => permission.hasOwnProperty(v))
    } else {
      access = to.every(v => permission.hasOwnProperty(v))
    }
  } else if (typeof to === 'string') {
    access = permission.hasOwnProperty(to)
  }
  return access
}

/**
 * @param to {Route}
 * @returns {boolean}
 */
export function canAccessRoute (to) {
  return to.matched.some(r => {
    if (to.path !== r.path) {
      return false
    }
    if (r.meta.auth === true) {
      return true
    }
    return canAccess(r.meta.auth)
  })
}

/**
 * 获取有效的路由节点
 */
export function generateRouteMapping () {
  // todo 未处理参数路由
  let mapping = {}
  let recursive = (tree, root = '') => {
    tree.forEach((value) => {
      if (value.hasOwnProperty('children')) {
        let rootPath = root + value.path
        rootPath = rootPath.endsWith('/') ? rootPath : (rootPath + '/')
        recursive(value.children, rootPath)
      }
      let path = value.path
      if (!value.path.startsWith('/')) {
        path = root + path
      }
      mapping[path] = value.meta && value.meta.hasOwnProperty('auth') ? value.meta.auth : false
    })
  }
  recursive(frameInRoutes)
  store.state.d2admin.user.routeMapping = mapping
}

/**
 * 过滤菜单
 * @param menu {Array}
 * @returns {Array}
 */
export function filterMenu (menu) {
  const permission = store.state.d2admin.user.info.permission
  const routeMapping = store.state.d2admin.user.routeMapping
  if (isEmpty(permission)) {
    return menu
  }

  // 按照权限过滤菜单
  let filter = (tree) => {
    let newTree = []
    tree.forEach(value => {
      let item = cloneDeep(value)
      if (value.hasOwnProperty('children') && Array.isArray(value.children)) {
        item.children = filter(value.children)
      }
      if (routeMapping.hasOwnProperty(item.path)) {
        if (!isBoolean(routeMapping[item.path]) && !permission.hasOwnProperty(routeMapping[item.path])) {
          // 无权限访问
          return
        }
      }
      if (Array.isArray(item.children) && item.children.length === 0) {
        // 空的父节点
        return
      }
      newTree.push(item)
    })
    return newTree
  }
  return filter(menu)
}

/**
 * @param {Vue} Vue
 * @param {Object} options
 */
let install = function (Vue, options) {
  // noinspection JSUnusedGlobalSymbols
  /**
   * 当前令牌能访问
   * @type {function((string|Array), Boolean=): boolean}
   */
  Vue.prototype.$canAccess = canAccess

  // noinspection JSUnusedGlobalSymbols
  Vue.directive('access', {
    inserted (el, binding) {
      const permission = store.state.d2admin.user.info.permission
      let access = false
      if (isPlainObject(permission)) {
        if (Array.isArray(binding.value)) {
          if (binding.modifiers.some) {
            access = binding.value.some(v => permission.hasOwnProperty(v))
          } else {
            access = binding.value.every(v => permission.hasOwnProperty(v))
          }
        } else {
          access = permission.hasOwnProperty(binding.value)
        }
      }

      if (!access) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    },
  })
}

export default {
  install,
}
