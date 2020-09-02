import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store.js'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  beforeCreate() {
    this.$store.commit('initializeStore')
    this.$store.commit('initializeUsernameStore')
    this.$store.commit('initializeWinsStore')
  },
  render: h => h(App),
}).$mount('#app')
