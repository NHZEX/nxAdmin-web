import Vue from 'vue'
import path from 'path-browserify'

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./icons', false, /\.svg$/)
const iconMap = requireAll(req)

Vue.prototype.$IconSvg = iconMap.map(p => path.basename(p).split('.')[0])
