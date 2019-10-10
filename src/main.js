import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router/index'
import store from './store'
import './assets/normalize.css'
import axios from './utils/axios'
import '@ckeditor/ckeditor5-build-decoupled-document'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn'
Vue.prototype.$axios = axios
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
