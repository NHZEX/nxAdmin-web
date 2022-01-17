import util from '@/libs/util.js'
import store from '@/store/index'
import { frameInRoutes } from '@/router/routes'
import { cloneDeep, isBoolean, isEmpty, isPlainObject } from 'lodash'
import { hasOwnProperty } from '@/libs/util.common'

export const INVALID_SESSION = '401'

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
    try {
      await store.dispatch('d2admin/account/refresh', {
        silent: true,
      })
    } catch (e) {
      return false
    }
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
  if (!permission) {
    return false
  }
  let access = false
  if (Array.isArray(to)) {
    if (some) {
      access = to.some(v => hasOwnProperty(permission, v))
    } else {
      access = to.every(v => hasOwnProperty(permission, v))
    }
  } else if (typeof to === 'string') {
    access = hasOwnProperty(permission, to)
  }
  return access
}

/**
 * @param to {Route}
 * @returns {boolean}
 */
export function canAccessRoute (to) {
  return to.matched.some(r => {
    if (r.meta.auth === true) {
      return true
    }
    if (!r.regex.test(to.path)) {
      return false
    }
    return canAccess(r.meta.auth, true)
  })
}

/**
 * 获取有效的路由节点
 */
export function generateRouteMapping () {
  // todo 未处理参数路由
  const mapping = {}
  const recursive = (tree, root = '') => {
    tree.forEach((value) => {
      if (hasOwnProperty(value, 'children')) {
        let rootPath = root + value.path
        rootPath = rootPath.endsWith('/') ? rootPath : (rootPath + '/')
        recursive(value.children, rootPath)
      }
      let path = value.path
      if (!value.path.startsWith('/')) {
        path = root + path
      }
      mapping[path.toLowerCase()] = value.meta && hasOwnProperty(value.meta, 'auth') ? value.meta.auth : false
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
  const filter = (tree) => {
    const newTree = []
    tree.forEach(value => {
      const item = cloneDeep(value)
      let originalChildrenLength = 0
      if (hasOwnProperty(value, 'children') && Array.isArray(value.children)) {
        originalChildrenLength = item.children.length
        if (originalChildrenLength > 0) {
          item.children = filter(value.children)
        }
      }
      const path = item.path.split('?')[0].toLowerCase()
      if (hasOwnProperty(routeMapping, path)) {
        if (!isBoolean(routeMapping[path]) && !canAccess(routeMapping[path], true)) {
          // 无权限访问
          return
        }
      }
      if (originalChildrenLength > 0 && item.children.length === 0) {
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
const install = function (Vue, options) {
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
            access = binding.value.some(v => hasOwnProperty(permission, v))
          } else {
            access = binding.value.every(v => hasOwnProperty(permission, v))
          }
        } else {
          access = hasOwnProperty(permission, binding.value)
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
