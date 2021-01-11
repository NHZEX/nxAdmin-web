import Vue from 'vue'

import d2Container from './d2-container'

// 注意 有些组件使用异步加载会有影响
Vue.component('d2-container', d2Container)
Vue.component('d2-icon', () => import('./d2-icon'))
Vue.component('d2-icon-svg', () => import('./d2-icon-svg/index.vue'))
Vue.component('d2-scrollbar', () => import('./d2-scrollbar'))
// 自定义组件
Vue.component('nx-tag', () => import('./nx-tag'))
Vue.component('nx-input-number', () => import('./nx-input-number'))
Vue.component('nx-description', () => import('./nx-description'))
Vue.component('nx-description-item', () => import('./nx-description-item'))
