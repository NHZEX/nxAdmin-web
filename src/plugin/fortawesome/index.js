import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import FAIcon from './fa-icon'

export function install () {
  library.add(fas, far, fab)
  Vue.component('fa-icon', FAIcon)
}

export default {
  install,
}
