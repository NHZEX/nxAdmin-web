// 基本
import db from '@/store/modules/d2admin/modules/db'
import ua from '@/store/modules/d2admin/modules/ua'
import config from '@/store/modules/d2admin/modules/config'
import releases from '@/store/modules/d2admin/modules/releases'
import log from '@/store/modules/d2admin/modules/log'
// 界面
import search from '@/store/modules/d2admin/modules/search'
import page from '@/store/modules/d2admin/modules/page'
import menu from '@/store/modules/d2admin/modules/menu'
import fullscreen from '@/store/modules/d2admin/modules/fullscreen'
import transition from '@/store/modules/d2admin/modules/transition'
import color from '@/store/modules/d2admin/modules/color'
import theme from '@/store/modules/d2admin/modules/theme'
import size from '@/store/modules/d2admin/modules/size'
import gray from '@/store/modules/d2admin/modules/gray'
// 用户
import account from '@/store/modules/d2admin/modules/account'
import user from '@/store/modules/d2admin/modules/user'

export default {
  namespaced: true,
  modules: {
    db,
    ua,
    config,
    releases,
    log,
    fullscreen,
    transition,
    color,
    theme,
    size,
    gray,
    search,
    page,
    menu,
    account,
    user,
  }
}
