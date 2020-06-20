import md from 'node-forge/lib/md.all'
import util from 'node-forge/lib/util'
import random from 'node-forge/lib/random'

/**
 * @param {String} algo md5, sha1 sha256 sha384 sha512
 * @param {String} data
 * @param {Boolean} rawOutput
 * @return {String}
 */
export function hash (algo, data, rawOutput = false) {
  // import forgeUtil from 'node-forge/lib/util'
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
