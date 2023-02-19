import Vue from "vue";
import Notifications from "vue-notification";
import App from "./App.vue";
import router from "./router";
import {} from "./global.js";
import { i18n } from "./plugins/i18n";
import VueCookies from "vue-cookies";
import { worker } from "./mocks/browser";

Vue.use(VueCookies);
VueCookies.config("7d");

Vue.config.productionTip = false;

Vue.use(Notifications);

if (import.meta.env.MODE === "MOCK") {
  worker.start();
}
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
