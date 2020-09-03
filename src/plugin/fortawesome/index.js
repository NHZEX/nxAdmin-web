import Vue from 'vue'
import FAIcon from './fa-icon'

// import { fas } from '@fortawesome/free-solid-svg-icons'
// import { far } from '@fortawesome/free-regular-svg-icons'
// import { fab } from '@fortawesome/free-brands-svg-icons'

import { library } from '@fortawesome/fontawesome-svg-core'

// fas
import { faLanguage } from '@fortawesome/free-solid-svg-icons/faLanguage'
import { faFont } from '@fortawesome/free-solid-svg-icons/faFont'
import { faInbox } from '@fortawesome/free-solid-svg-icons/faInbox'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle'
import { faCompressArrowsAlt } from '@fortawesome/free-solid-svg-icons/faCompressArrowsAlt'
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons/faExpandArrowsAlt'
import { faBug } from '@fortawesome/free-solid-svg-icons/faBug'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import { faPowerOff } from '@fortawesome/free-solid-svg-icons/faPowerOff'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faIdCard } from '@fortawesome/free-solid-svg-icons/faIdCard'
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons/faShieldAlt'
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons/faCloudUploadAlt'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faKeyboard } from '@fortawesome/free-solid-svg-icons/faKeyboard'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons/faUserCircle'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons/faSyncAlt'
// far
import { faDotCircle } from '@fortawesome/free-regular-svg-icons/faDotCircle'
import { faCircle } from '@fortawesome/free-regular-svg-icons/faCircle'
import { faGem } from '@fortawesome/free-regular-svg-icons/faGem'
import { faFile } from '@fortawesome/free-regular-svg-icons/faFile'
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye'
import { faCopyright } from '@fortawesome/free-regular-svg-icons/faCopyright'

export function install () {
  // solid
  library.add(faLanguage, faFont, faInbox, faBug, faSearch)
  library.add(faArrowLeft, faArrowRight, faTimes, faTimesCircle, faSyncAlt)
  library.add(faCompressArrowsAlt, faExpandArrowsAlt)
  library.add(faPowerOff, faCloudUploadAlt, faBars)
  library.add(faQuestionCircle, faKeyboard, faUserCircle)
  library.add(faHome, faCog, faUser, faIdCard, faShieldAlt)
  // regular
  library.add(faDotCircle, faCircle, faGem, faFile, faEye, faCopyright)
  // component
  Vue.component('fa-icon', FAIcon)
}

export default {
  install,
}
