import qs from 'qs'
import request from '@/plugin/axios'
import { saveAs } from 'file-saver'

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

export function downloadFile (url, params = {}) {
  return request.get(url, {
    params: params,
    responseType: 'blob',
    timeout: 3600 * 1000,
    // onDownloadProgress: (e) => {
    //   console.log(100 * (e.loaded / e.total))
    // }
  }).then(resp => {
    const filename = decodeURI(resp.headers['content-disposition'].match(/filename="(.*)"/)[1])
    saveAs(resp.data, filename)
  })
}

export default download
