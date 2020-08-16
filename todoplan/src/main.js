// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import './assets/font-awesome-4.7.0/css/font-awesome.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import './assets/css/shake_custom.css'
import './assets/css/style.css'

import AlloyFinger from 'alloyfinger'
import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger.vue'
import FastClick from 'fastclick'

import { Progress, Modal, Tooltip } from 'bootstrap-vue/es/components'
import CheckboxRadio from 'vue-checkbox-radio'

import Router from 'vue-router'
import routes from './routes'
import store from './store'
import VueWorker from 'vue-worker'

FastClick.attach(document.body)

Vue.use(Router).use(VueWorker)
Vue.use(AlloyFingerPlugin, { AlloyFinger })
Vue.use(Progress).use(Modal).use(Tooltip)
   .use(CheckboxRadio)

const router = new Router({         // 实例化router构造函数
  routes                            // Define router detail
})

Vue.config.productionTip = false

document.addEventListener('deviceready', function () {
  if (window.cordova.platformId === 'android') {
    window.cordova.StatusBar.backgroundColorByHexString('#757575')
  }
}, false)

new Vue({           // eslint-disable-line no-new
  el: '#app',
  router,           // 5. add router into Vue instance
  store,
  template: '<App/>',
  components: { App }
})
