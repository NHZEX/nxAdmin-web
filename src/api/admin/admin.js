import require from '@/plugin/axios'
import { promiseResolveFalse } from '@/libs/util.common'

export function getUsers (page, limit, where = {}) {
  return require.get('/api/admin/users', {
    params: {
      page,
      limit,
      ...where,
    },
  })
}

export function getUser (id) {
  if (id) {
    return require.get(`/api/admin/users/${id}`)
  } else {
    return promiseResolveFalse()
  }
}

export function saveUser (id, data) {
  if (id) {
    return require.put(`/api/admin/users/${id}`, data)
  } else {
    return require.post('/api/admin/users', data)
  }
}

export function deleteUser (id) {
  return require.delete(`/api/admin/users/${id}`)
}

export function getRoles (page, limit, where) {
  return require.get('/api/admin/roles', {
    params: {
      page,
      limit,
      ...where,
    },
  })
}

export function getRolesSelect () {
  return require.get('/api/admin/roles/select')
}

export function getRole (id) {
  if (id) {
    return require.get(`/api/admin/roles/${id}`)
  } else {
    return promiseResolveFalse()
  }
}

export function saveRole (id, data) {
  if (id) {
    return require.put(`/api/admin/roles/${id}`, data)
  } else {
    return require.post('/api/admin/roles', data)
  }
}

export function deleteRole (id) {
  return require.delete(`/api/admin/roles/${id}`)
}

export function getPermissions () {
  return require.get('/api/admin/permission')
}

export function getPermission (id) {
  if (id) {
    return require.get(`/api/admin/permission/${id}`)
  } else {
    return promiseResolveFalse()
  }
}

export function savePermission (id, data) {
  return require.put(`/api/admin/permission/${id}`, data)
}

export function scanPermission () {
  return require.get('/api/admin/permission/scan')
}
