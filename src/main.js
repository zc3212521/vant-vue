// import '@babel/polyfill' // 如某些机型进入页面出现空白，放开此注释
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { baseURL } from '@/base/axios'
import { log } from '@/utils'
import './base/vant-config'

process.env.NODE_ENV === 'mock' && require('./mock/index.js')

Vue.config.productionTip = false

if (process.env.NODE_ENV !== 'production') {
  log('%c 当前接口地址：' + baseURL, 'color: #1a6dd8')
  log('%c 当前运行环境：%c' + process.env.NODE_ENV, 'color: #1a6dd8', 'color: red')
  Vue.config.performance = true
}

window.vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
