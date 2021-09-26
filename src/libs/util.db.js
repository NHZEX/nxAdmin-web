import { Low } from 'lowdb/lib/Low'
import { LocalStorage } from 'lowdb/lib/adapters/LocalStorage'
import util from '@/libs/util'
import { cloneDeep, chain } from 'lodash'

const adapter = new LocalStorage(`d2admin-${process.env.VUE_APP_VERSION}`)
const db = new Low(adapter)

db.data ||= { sys: {}, database: {} }
db.write()

db.chain = chain(db.data)

export default db

/**
 * @description 检查路径是否存在 不存在的话初始化
 * @param {Object} payload dbName {String} 数据库名称
 * @param {Object} payload path {String} 路径
 * @param {Object} payload user {Boolean} 区分用户
 * @param {Object} payload validator {Function} 数据校验钩子 返回 true 表示验证通过
 * @param {Object} payload defaultValue {*} 初始化默认值
 * @returns {String} 可以直接使用的路径
 */
export function pathInit ({
  dbName = 'database',
  path = '',
  user = true,
  validator = () => true,
  defaultValue = ''
}) {
  const uuid = util.cookies.get('uuid') || 'ghost-uuid'
  const currentPath = `${dbName}.${user ? `user.${uuid}` : 'public'}${path ? `.${path}` : ''}`
  const value = db.chain.get(currentPath).value()
  if (!(value !== undefined && validator(value))) {
    db.chain
      .set(currentPath, defaultValue)
      .value()
    db.write()
  }
  return currentPath
}

/**
 * @description 将数据存储到指定位置 | 路径不存在会自动初始化
 * @description 效果类似于取值 dbName.path = value
 * @param {Object} payload dbName {String} 数据库名称
 * @param {Object} payload path {String} 存储路径
 * @param {Object} payload value {*} 需要存储的值
 * @param {Object} payload user {Boolean} 是否区分用户
 */
export function dbSet ({
  dbName = 'database',
  path = '',
  value = '',
  user = false
}) {
  db.chain.set(pathInit({
    dbName,
    path,
    user
  }), value).value()
  db.write()
}

/**
 * @description 获取数据
 * @description 效果类似于取值 dbName.path || defaultValue
 * @param {Object} payload dbName {String} 数据库名称
 * @param {Object} payload path {String} 存储路径
 * @param {Object} payload defaultValue {*} 取值失败的默认值
 * @param {Object} payload user {Boolean} 是否区分用户
 */
export function dbGet ({
  dbName = 'database',
  path = '',
  defaultValue = '',
  user = false
}) {
  return cloneDeep(db.chain.get(pathInit({
    dbName,
    path,
    user,
    defaultValue
  })).value())
}

/**
 * @description 获取存储数据库对象
 * @param {Object} payload user {Boolean} 是否区分用户
 */
export function database ({
  dbName = 'database',
  path = '',
  user = false,
  validator = () => true,
  defaultValue = ''
} = {}) {
  return db.chain.get(pathInit({
    dbName, path, user, validator, defaultValue
  }))
}
