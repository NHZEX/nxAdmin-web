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

export const ADMIN_USER_GENRE_DICT = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  AGENT: 3,
}

export const ADMIN_USERS_GENRE = {
  [ADMIN_USER_GENRE_DICT.SUPER_ADMIN]: '超级管理员',
  [ADMIN_USER_GENRE_DICT.ADMIN]: '管理员',
  [ADMIN_USER_GENRE_DICT.AGENT]: '代理商',
}

// 推送对象类型
export const ADMIN_ROLE_GENRE_DICT = {
  SYSTEM: 1,
  AGENT: 2,
}

export const ADMIN_USER_ROLE_MAPPING = {
  [ADMIN_USER_GENRE_DICT.SUPER_ADMIN]: ADMIN_ROLE_GENRE_DICT.SYSTEM,
  [ADMIN_USER_GENRE_DICT.ADMIN]: ADMIN_ROLE_GENRE_DICT.SYSTEM,
  [ADMIN_USER_GENRE_DICT.AGENT]: ADMIN_ROLE_GENRE_DICT.AGENT,
}

export const ADMIN_ROLES_GENRE = {
  [ADMIN_ROLE_GENRE_DICT.SYSTEM]: '系统角色',
  [ADMIN_ROLE_GENRE_DICT.AGENT]: '代理角色',
}
