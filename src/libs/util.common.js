import dayjs from 'dayjs'
import request from '@/plugin/axios/index.js'

export function randomString (length) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function promiseResolveObject (object) {
  return new Promise(resolve => { resolve(object) })
}

export function promiseResolveEmptyObject () {
  return promiseResolveObject({})
}

export function promiseResolveFalse () {
  return new Promise(resolve => { resolve(false) })
}

export function hasOwnProperty (object, key) {
  return Object.prototype.hasOwnProperty.call(object, key)
}

/**
 * @param blob
 * @returns {Promise<string>}
 */
export function blobToString (blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = () => {
      reject(reader.error)
    }
    reader.readAsText(blob)
  })
}

/**
 * @param blob
 * @returns {Promise<string>}
 */
export function blobToDataURL (blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = () => {
      reject(reader.error)
    }
    reader.readAsDataURL(blob)
  })
}

/**
 * @param {Number} timestamp
 * @param {String} format
 * @param {String} placeholder
 * @returns {String}
 */
export function formatUnix (timestamp, format = 'YYYY-MM-DD HH:mm', placeholder = '无') {
  if (!timestamp && placeholder) {
    return placeholder
  }
  return dayjs.unix(timestamp).format(format || 'YYYY-MM-DD HH:mm')
}

export function elUploadRequestWarp (url, options, params, fileField = 'file', config = {}) {
  const data = new FormData()
  data.append(fileField, options.file)
  for (const key of Object.keys(params)) {
    if (params[key] !== null && params[key] !== undefined) {
      data.append(key, params[key])
    }
  }
  const resp = request.post(url, data, {
    onUploadProgress: options.onProgress,
    ...config,
  })

  resp
    .then((result) => {
      options.onSuccess(result)
    })
    .catch((e) => {
      console.log(e)
      options.onError(e)
    })

  return {
    abort: () => {
      console.debug('todo upload abort')
    },
    then: () => {
      console.debug('todo upload then')
    },
  }
}

const common = {}

export default common
