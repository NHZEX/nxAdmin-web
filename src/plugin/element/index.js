import locale from 'element-ui/lib/locale'
import InfiniteScroll from 'element-ui/lib/infinite-scroll'
import Loading from 'element-ui/lib/loading'
import MessageBox from 'element-ui/lib/message-box'
import Notification from 'element-ui/lib/notification'
import Message from 'element-ui/lib/message'
import 'element-ui/lib/theme-chalk/index.css'

import {
  Autocomplete,
  Badge,
  Button,
  ButtonGroup,
  Card,
  ColorPicker,
  Dialog,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Form,
  FormItem,
  Input,
  Menu,
  MenuItem,
  Popover,
  Submenu,
  Switch,
  Table,
  TableColumn,
  TabPane,
  Tabs,
  Tag,
  Tooltip,
  Tree,
} from 'element-ui'

const components = [
  Dialog,
  Popover,
  ColorPicker,
  Tooltip,
  Badge,
  Card,
  Autocomplete,
  Menu,
  MenuItem,
  Submenu,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Tree,
  Table,
  TableColumn,
  Tabs,
  TabPane,
  Tag,
  Form,
  FormItem,
  Input,
  Switch,
]

const install = function (Vue, opts = {}) {
  locale.use(opts.locale)
  locale.i18n(opts.i18n)

  components.forEach(component => {
    Vue.component(component.name, component)
  })

  Vue.use(InfiniteScroll)
  Vue.use(Loading.directive)

  Vue.prototype.$ELEMENT = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  }

  Vue.prototype.$loading = Loading.service
  Vue.prototype.$msgbox = MessageBox
  Vue.prototype.$alert = MessageBox.alert
  Vue.prototype.$confirm = MessageBox.confirm
  Vue.prototype.$prompt = MessageBox.prompt
  Vue.prototype.$notify = Notification
  Vue.prototype.$message = Message
}

export default {
  locale: locale.use,
  i18n: locale.i18n,
  install,
}
