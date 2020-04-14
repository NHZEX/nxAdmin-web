/**
 * @param {Object} data
 * @param {String} label
 * @param {String} value
 * @return {[]}
 */
export function toLabelValue (data, label = 'label', value = 'value') {
  const result = []
  for (const key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) {
      continue
    }
    const vv = Number(key)
    result.push({
      [label]: data[key],
      [value]: Number.isNaN(vv) ? key : vv,
    })
  }
  return result
}

export const ADMIN_USERS_GENRE = {
  1: '超级管理员',
  2: '管理员',
  3: '代理商',
}

export const ADMIN_ROLES_GENRE = {
  1: '系统角色',
  2: '代理角色',
}
