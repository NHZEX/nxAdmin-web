export function randomString (length) {
  let result = ''
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function promiseResolveEmptyObject () {
  return new Promise(resolve => { resolve({}) })
}

export function promiseResolveFalse () {
  return new Promise(resolve => { resolve(false) })
}

const common = {}

export default common
