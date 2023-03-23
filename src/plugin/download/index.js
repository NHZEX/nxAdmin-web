import qs from 'qs'
import request from '@/plugin/axios'
import { saveAs } from 'file-saver'
// eslint-disable-next-line no-unused-vars
import { AxiosResponse } from 'axios'

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
    params,
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

/**
 * @param {Promise<AxiosResponse>} response
 * @return {Promise<AxiosResponse>}
 */
export function downloadFileEx (response) {
  return response.then(resp => {
    let filename
    if (resp.headers['content-disposition']) {
      filename = decodeURI(resp.headers['content-disposition'].match(/filename="(.*)"/)[1])
    } else {
      filename = 'raw.xlsx'
    }
    saveAs(resp.data, filename)
  })
}

export default download
