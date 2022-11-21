import axios from 'axios'
import Vue from 'vue'

let poolTimer = null

const CHECK_CYCLE = 2 * 3600 * 1000

function checkUpdated () {
  const location = window.location
  const indexUrl = `${location.protocol}//${location.host}${location.pathname}`
  console.log(indexUrl)
  axios
    .head(indexUrl, {
      params: {
        _t: (new Date()).getTime(),
      },
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
    .then(r => {
      if (r.status >= 400) {
        return
      }
      if (r.headers['content-type'].indexOf('text/html') === -1) {
        return
      }
      const date = r.headers['last-modified'] || r.headers.date
      const etag = r.headers.etag
      if (!etag) {
        return
      }

      const localReleaseDate = localStorage.getItem('D2_APP_RELEASE_DATE')
      const localReleaseEtag = localStorage.getItem('D2_APP_RELEASE_ETAG')

      const updateDate = date ? (new Date(date)).toLocaleString() : '未知'

      try {
        if (localReleaseDate && etag !== localReleaseEtag) {
          updateNotify(updateDate)
        }
      } finally {
        localStorage.setItem('D2_APP_RELEASE_DATE', date)
        localStorage.setItem('D2_APP_RELEASE_ETAG', etag)
      }
    })
}

function resetStorage () {
  localStorage.removeItem('D2_APP_RELEASE_DATE')
  localStorage.removeItem('D2_APP_RELEASE_ETAG')
}

function updateNotify (updateDate) {
  clearTimer()
  const message = `站点已经发布新版本（${updateDate}），<br>`
    + '请点击确认/刷新网页重新加载资源文件，<br>'
    + '请尽快更新，避免发生功能异常（刷新前请注意当前的操作是否都已经保存）！'
  Vue.prototype
    .$confirm(
      message,
      '更新通知',
      {
        confirmButtonText: '立即刷新',
        cancelButtonText: '推迟提醒（2小时）',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      })
    .then(() => {
      setTimeout(() => {
        reload()
      }, 1)
    })
    .catch(() => {
      // 2 小时后再次检查
      setTimeout(() => {
        registerCheck()
      }, CHECK_CYCLE)
    })
}

function reload () {
  window.location.reload()
}

function clearTimer () {
  clearInterval(poolTimer)
  poolTimer = null
}

function registerCheck () {
  if (poolTimer) {
    return
  }
  checkUpdated()
  poolTimer = setInterval(checkUpdated, 5 * 60 * 1000)
}

export default {
  registerCheck,
  resetStorage,
}
