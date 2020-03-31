import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import * as VeeValidate from 'vee-validate';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import mixins from './mixins/createChannel';

Vue.use(VeeValidate);
Vue.use(VueAxios, axios);
Vue.mixin(mixins);

const token = localStorage.getItem('token');
if (token) {
  Vue.prototype.$http.defaults.headers.common.Authorization = `Bearer ${token}`;
}

Vue.axios.defaults.withCredentials = false;
Vue.axios.defaults.baseURL = 'https://fierce-sierra-17373.herokuapp.com/';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
