import md from 'node-forge/lib/md.all'
import util from 'node-forge/lib/util'
import random from 'node-forge/lib/random'
import cipher from 'node-forge/lib/cipher'

/**
 * @param {String} algo md5, sha1 sha256 sha384 sha512
 * @param {String} data
 * @param {Boolean} rawOutput
 * @return {String}
 */
export function hash (algo, data, rawOutput = false) {
  // todo forgeUtil.encodeUtf8(data) != (new TextEncoder('utf-8')).encode(data)
  const hash = md[algo].create()
  hash.update(data, 'utf8')
  const result = hash.digest()
  return rawOutput ? result.getBytes() : result.toHex()
}

export function randomBytes (length = 16) {
  return random.getBytesSync(length)
}

export function randomHex (length = 16) {
  return util.bytesToHex(randomBytes(Math.ceil(length / 2)))
}

export function base64_encode (str) {
  return util.encode64(str)
}

export function base64_decode (str) {
  return util.decode64(str)
}

/**
 * @param {String} data
 * @param {String} key
 * @returns {String}
 */
export function aes_gcm_encrypt (data, key) {
  const iv = random.getBytesSync(12)
  const aes = cipher.createCipher('AES-GCM', key)
  aes.start({
    iv: iv,
    additionalData: '', // optional
    tagLength: 16, // optional
  })
  aes.update(util.createBuffer(data))
  aes.finish()
  return iv + aes.output.getBytes() + aes.mode.tag.getBytes()
}

/**
 * @param {String} data
 * @param {String} key
 * @returns {String|Boolean}
 */
export function aes_gcm_decrypt (data, key) {
  const buff = util.createBuffer(data)
  const iv = buff.getBytes(12)
  const ciphertext = buff.getBytes(buff.length() - 16)
  const tag = buff.getBytes(16)

  const aes = cipher.createCipher('AES-GCM', key)
  aes.start({
    iv: iv,
    additionalData: '', // optional
    tagLength: 16, // optional
    tag: tag,
  })
  aes.update(util.createBuffer(ciphertext))
  const pass = aes.finish()
  if (pass) {
    return aes.output.getBytes()
  }
  return false
}
