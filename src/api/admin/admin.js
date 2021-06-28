import require from '@/plugin/axios'
import { promiseResolveFalse } from '@/libs/util.common'

class UsersApi {
  get (page, limit, where = {}) {
    return require.get('/admin/users', {
      params: {
        page,
        limit,
        ...where,
      },
    })
  }

  read (id) {
    if (id) {
      return require.get(`/admin/users/${id}`)
    } else {
      return promiseResolveFalse()
    }
  }

  save (id, data) {
    if (id) {
      return require.put(`/admin/users/${id}`, data)
    } else {
      return require.post('/admin/users', data)
    }
  }

  delete (id) {
    return require.delete(`/admin/users/${id}`)
  }
}

class RolesApi {
  get (page, limit, where) {
    return require.get('/admin/roles', {
      params: {
        page,
        limit,
        ...where,
      },
    })
  }

  select (genre) {
    return require.get('/admin/roles/select', {
      params: {
        genre,
      }
    })
  }

  read (id) {
    if (id) {
      return require.get(`/admin/roles/${id}`)
    } else {
      return promiseResolveFalse()
    }
  }

  save (id, data) {
    if (id) {
      return require.put(`/admin/roles/${id}`, data)
    } else {
      return require.post('/admin/roles', data)
    }
  }

  delete (id) {
    return require.delete(`/admin/roles/${id}`)
  }
}

class PermissionApi {
  get () {
    return require.get('/admin/permission')
  }

  read (id) {
    if (id) {
      return require.get(`/admin/permission/${id}`)
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
    return require.put(`/admin/permission/${id}`, result)
  }

  scan () {
    return require.get('/admin/permission/scan')
  }
}

export const users = new UsersApi()
export const roles = new RolesApi()
export const permission = new PermissionApi()
