import md from 'node-forge/lib/md.all'

/**
 * @param {String} algo md5, sha1 sha256 sha384 sha512
 * @param {String} data
 * @param {Boolean} rawOutput
 * @return {String}
 */
export function hash (algo, data, rawOutput = false) {
  console.log(md, md[algo])
  const hash = md[algo].create()
  hash.update(false)
  const result = hash.digest()
  return rawOutput ? result.getBytes() : result.toHex()
}
