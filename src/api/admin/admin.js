import request from '@/plugin/axios'
import { promiseResolveFalse } from '@/libs/util.common'

export const users = new (class {
  get (page, limit, where = {}) {
    return request.get('/admin/users', {
      params: {
        page,
        limit,
        ...where,
      },
    })
  }

  read (id) {
    if (id) {
      return request.get(`/admin/users/${id}`)
    } else {
      return promiseResolveFalse()
    }
  }

  save (id, data) {
    if (id) {
      return request.put(`/admin/users/${id}`, data)
    } else {
      return request.post('/admin/users', data)
    }
  }

  delete (id) {
    return request.delete(`/admin/users/${id}`)
  }
})()

export const roles = new (class {
  get (page, limit, where) {
    return request.get('/admin/roles', {
      params: {
        page,
        limit,
        ...where,
      },
    })
  }

  select (genre) {
    return request.get('/admin/roles/select', {
      params: {
        genre,
      }
    })
  }

  read (id) {
    if (id) {
      return request.get(`/admin/roles/${id}`)
    } else {
      return promiseResolveFalse()
    }
  }

  save (id, data) {
    if (id) {
      return request.put(`/admin/roles/${id}`, data)
    } else {
      return request.post('/admin/roles', data)
    }
  }

  delete (id) {
    return request.delete(`/admin/roles/${id}`)
  }
})()

export const permission = new (class {
  get () {
    return request.get('/admin/permission')
  }

  read (id) {
    if (id) {
      return request.get(`/admin/permission/${id}`)
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
    return request.put(`/admin/permission/${id}`, result)
  }

  scan () {
    return request.get('/admin/permission/scan')
  }
})()
