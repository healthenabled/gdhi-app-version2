<script>
import Vue from "vue";

import httpRequests from "../../common/indicator-http-requests";
import common from "../../common/common";

export default Vue.extend({
  name: "DevelopmentIndicators",
  data() {
    return {
      developmentIndicators: [],
    };
  },
  mounted() {
    this.getDevelopmentIndicatorsFor(this.$route.params.countryCode);
  },
  methods: {
    getDevelopmentIndicatorsFor(countryCode) {
      common.showLoading();
      httpRequests
        .getDevelopmentIndicators(countryCode, false)
        .then((response) => {
          this.developmentIndicators = response;
        });
    },
  },
});
</script>

<template>
  <div class="development-indicators">
    <div
      v-for="(indicatorCategory, index) in developmentIndicators"
      v-bind:key="index"
      class="box category"
    >
      <div class="header-bold no-margin-top">
        {{
          $t(
            "worldMap.indicatorPanel." +
              Object.keys(indicatorCategory)[0].toLowerCase() +
              ".text"
          )
        }}
      </div>
      <div
        v-for="(indicators, index) in indicatorCategory"
        v-bind:key="index"
        class="row"
      >
        <div
          v-for="(indicator, key) in indicators"
          class="indicator"
          :key="key"
        >
          <div class="highlight-text">{{ indicator }}</div>
          <div class="indicator-category">
            {{
              $t(
                "worldMap.indicatorPanel." +
                  Object.keys(indicatorCategory)[0].toLowerCase() +
                  "." +
                  key
              )
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
