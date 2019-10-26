import Vue from 'vue';
import App from './App.vue';
import router from './router';
import muiCss from './less/mui.min.css';
// import muiJS from '@/lib/mui.min';
require('@/lib/mui.min');

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
