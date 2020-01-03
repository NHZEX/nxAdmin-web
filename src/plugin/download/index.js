import qs from 'qs'

/**
 * 下载文件
 * @param url {String}
 * @param params {String | Object}
 * @param target {String}
 */
function download (url, params = {}, target = '_self') {
  // target: _self 当前页面, 新的页面 _blank
  target = (typeof target !== 'undefined') ? target : '_self'
  if (params) {
    url = url + '?' + qs.stringify(params)
  }
  window.open(url, target)
}

export default download
