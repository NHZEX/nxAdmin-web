import require from '@/plugin/axios'
import { promiseResolveFalse } from '@/libs/util.common'

class UsersApi {
  get (pageParams, where = {}) {
    return require.get('/api/admin/users', {
      params: {
        ...pageParams,
        ...where,
      },
    })
  }

  read (id) {
    if (id) {
      return require.get(`/api/admin/users/${id}`)
    } else {
      return promiseResolveFalse()
    }
  }

  save (id, data) {
    if (id) {
      return require.put(`/api/admin/users/${id}`, data)
    } else {
      return require.post('/api/admin/users', data)
    }
  }

  delete (id) {
    return require.delete(`/api/admin/users/${id}`)
  }
}

class RolesApi {
  get (page, limit, where) {
    return require.get('/api/admin/roles', {
      params: {
        page,
        limit,
        ...where,
      },
    })
  }

  select (genre) {
    return require.get('/api/admin/roles/select', {
      params: {
        genre,
      }
    })
  }

  read (id) {
    if (id) {
      return require.get(`/api/admin/roles/${id}`)
    } else {
      return promiseResolveFalse()
    }
  }

  save (id, data) {
    if (id) {
      return require.put(`/api/admin/roles/${id}`, data)
    } else {
      return require.post('/api/admin/roles', data)
    }
  }

  delete (id) {
    return require.delete(`/api/admin/roles/${id}`)
  }
}

class PermissionApi {
  get () {
    return require.get('/api/admin/permission')
  }

  read (id) {
    if (id) {
      return require.get(`/api/admin/permission/${id}`)
    } else {
      return promiseResolveFalse()
    }
  }

  save (id, data, batch = false) {
    let result
    if (batch) {
      id = 'root'
      result = {
        batch: batch,
        list: data,
      }
    } else {
      result = data
    }
    return require.put(`/api/admin/permission/${id}`, result)
  }

  scan () {
    return require.get('/api/admin/permission/scan')
  }
}

export const users = new UsersApi()
export const roles = new RolesApi()
export const permission = new PermissionApi()
