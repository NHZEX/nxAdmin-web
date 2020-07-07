import Vue from 'vue'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

import dayjs from 'dayjs'

import VXETablePluginIView from 'vxe-table-plugin-iview'
import 'vxe-table-plugin-iview/dist/style.css'

import VXETablePluginVirtualTree from 'vxe-table-plugin-virtual-tree'
import 'vxe-table-plugin-virtual-tree/dist/style.css'

VXETable.setup({
  size: 'small',
  table: {
    border: 'full',
    resizable: true,
    filterConfig: {
      remote: true,
    },
    showOverflow: 'ellipsis',
    showHeaderOverflow: 'title',
    showFooterOverflow: 'title',
    highlightCurrentRow: true,
    highlightHoverRow: true,
  },
  grid: {
  },
  pager: {
    pageSize: 10,
    pageSizes: [10, 20, 30, 50, 100, 200, 300],
    align: 'left',
    layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
    perfect: true,
  },
})

VXETable.formats.add('unixTime', ({ cellValue }, format = 'YYYY-MM-DD HH:mm') => {
  return dayjs.unix(cellValue).format(format)
})

Vue.use(VXETable)

VXETable.use(VXETablePluginVirtualTree)
VXETable.use(VXETablePluginIView)

// 给 vue 实例挂载全局窗口对象，属性名称随意定义，例如：$XModal
Vue.prototype.$XModal = VXETable.modal
