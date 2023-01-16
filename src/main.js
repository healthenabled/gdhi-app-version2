import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import {i18n} from './plugins/i18n';

import "./assets/stylesheets/main.scss";

new Vue({
  router,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
