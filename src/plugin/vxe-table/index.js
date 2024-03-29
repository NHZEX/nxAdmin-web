import Vue from 'vue'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

import { formatUnix } from '@/libs/util.common'

// import VXETablePluginElement from 'vxe-table-plugin-element'
// import 'vxe-table-plugin-element/dist/style.css'

VXETable.setup({
  size: 'mini',
  table: {
    border: 'full',
    resizable: true,
    filterConfig: {
      remote: true,
    },
    sortConfig: {
      remote: true,
    },
    showOverflow: 'ellipsis',
    showHeaderOverflow: 'title',
    showFooterOverflow: 'title',
    highlightCurrentRow: true,
    highlightHoverRow: true,
    scrollY: {
      gt: 20,
    },
  },
  grid: {
  },
  pager: {
    pageSize: 20,
    pageSizes: [20, 30, 50, 100, 200, 300],
    align: 'left',
    layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
    perfect: true,
  },
})

VXETable.formats.add('unixTime', ({ cellValue }, format = 'YYYY-MM-DD HH:mm') => {
  return formatUnix(cellValue, format)
})

Vue.use(VXETable)

// VXETable.use(VXETablePluginElement)

// 给 vue 实例挂载全局窗口对象，属性名称随意定义，例如：$XModal
Vue.prototype.$XModal = VXETable.modal
