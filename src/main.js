import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
import ElementUI from 'element-ui'
import APIS from './api'

// 导入全局样式
import './style/index.scss'

Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.prototype.$http = APIS

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
