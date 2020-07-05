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

const common = {}

export default common
