<script>
import Vue from "vue";

export default Vue.extend({
  name: "Header",

  data() {
    return {
      countries: {},
      developmentIndicators: [],
      healthIndicators: {},
    };
  },
});
</script>

<template>
  <div class="header">
    <div class="header-width">
      <div class="header-elements">
        <div class="left-aligned-headers">
          <a href="http://www.digitalhealthindex.org" target="_blank"
            ><span class="logo-name hd-element"
              >Global Digital Health Index</span
            ></a
          >
          <router-link :to="{ path: '/map' }" class="hd-element xs-length"
            ><span>{{ $t("headers.worldMap") }}</span></router-link
          >
          <router-link
            :to="{ path: '/indicators_info' }"
            class="hd-element xl-length"
            ><span>{{ $t("headers.indicators") }}</span></router-link
          >
          <router-link
            :to="{ path: '/methodology' }"
            class="hd-element xl-length"
            ><span>{{ $t("methodology.text") }}</span></router-link
          >
        </div>

        <div class="right-aligned-headers">
          <router-view name="search"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
