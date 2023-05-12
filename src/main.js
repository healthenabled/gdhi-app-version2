import Vue from "vue";
import Notifications from "vue-notification";
import App from "./App.vue";
import router from "./router";
// noinspection ES6UnusedImports
import {} from "./global.js";
import { i18n } from "./plugins/i18n";
import VueCookies from "vue-cookies";
import VueGtag from "vue-gtag";

if (import.meta.env.VITE_IS_GOOGLE_ANALYTICS_ENABLED === "true") {
  Vue.use(VueGtag, {
    config: { id: import.meta.env.VITE_GOOGLE_ANALYTICS_ID },
  });
}
Vue.use(VueCookies);
VueCookies.config("7d");

Vue.config.productionTip = false;

Vue.use(Notifications);
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  i18n,
  render: (h) => h(App),
  components: { App, Notifications },
  mounted() {
    if (this.$route.fullPath.length <= 1) {
      this.$router.push("map");
    }
  },
}).$mount("#app");
