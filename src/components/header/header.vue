<script>
import Vue from "vue";
import MapLegend from "../legend/legend.vue";

export default Vue.extend({
  components: {
    MapLegend,
  },
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
        <div class="header-language-selector">
          <router-view name="languageSelect"></router-view>
        </div>
      </div>
    </div>

    <div class="sub-header">
      <div class="sub-header-title-and-description">
        <p class="sub-header-title">
          {{ $t("worldMap.indicatorPanel.indicatorPanelTitle") }}
        </p>
        <p class="sub-header-description">
          {{ $t("worldMap.indicatorPanel.description") }}
        </p>
      </div>
      <div class="sub-header-map-legend">
        <MapLegend />
      </div>
    </div>
  </div>
</template>
