<script>
import Vue from "vue";

import { EventBus } from "../common/event-bus";
import indicatorPanel from "../indicatorPanel/indicator-panel.vue";
import axios from "axios";
import worldMap from "./world-map";
import helper from "./map-helper";
import { merge } from "lodash";
import common from "../../common/common";

export default Vue.extend({
  components: {
    indicatorPanel,
  },
  data() {
    return {
      globalHealthIndices: [],
      lastSelectedCountry: "",
      globalHealthIndicators: [],
      locale: "en",
    };
  },
  created() {
    this.fetchGlobalIndices();
  },
  mounted: function () {
    EventBus.$on("Map:Searched", this.onSearchTriggered);
    this.$on("Map:Clicked", ($clickedEl) => {
      if ($clickedEl.type === "GLOBAL") {
        this.resetFilters();
        if (document.querySelector("#search-box input"))
          document.querySelector("#search-box input").value = "";
      } else {
        if (document.querySelector("#search-box input"))
          document.querySelector("#search-box input").value =
            $clickedEl.countryName;
      }
    });
    EventBus.$on('Map:filtered', () => {
      this.fetchGlobalIndices();
    });
  },
  updated() {
    if (this.locale !== this.$i18n.locale) {
      this.fetchGlobalIndices();
      this.locale = this.$i18n.locale;
    }
  },
  beforeDestroy() {
    EventBus.$off("Map:Searched", this.onSearchTriggered);
    EventBus.$off("Map:filtered");
  },
  methods: {
    fetchGlobalIndices: function () {
      console.log("Helloworld");
      const self = this;
      common.showLoading();
      const windowProperties = window.appProperties;
      console.log("windowProperties.getCategoryFilter() :" + windowProperties.getCategoryFilter());
      let url =
        "/api/countries_health_indicator_scores?categoryId=" +
        windowProperties.getCategoryFilter() +
        "&phase=" +
        windowProperties.getPhaseFilter();
      return axios
        .get(
          url,
          common.configWithUserLanguageAndNoCacheHeader(this.$i18n.locale)
        )
        .then((globalHealthIndices) => {
          this.globalHealthIndicators =
            globalHealthIndices.data.countryHealthScores;
          this.globalHealthIndices =
            self.mergeColorCodeToHealthIndicators(globalHealthIndices);
          worldMap.drawMap(
            self.globalHealthIndices,
            self.onCountrySelection,
            this.$i18n
          );
          common.hideLoading();
        });
    },
    mergeColorCodeToHealthIndicators: function (globalHealthIndices) {
      const globalHealthIndicesWithScores =
        globalHealthIndices.data.countryHealthScores.filter((country) => {
          return country.countryPhase != null;
        });
      const collection = globalHealthIndicesWithScores;
      collection.forEach((value) => {
        merge(value, {
          colorCode: helper.getColorCodeFor(value["countryPhase"]),
        });
      });
      return collection;
    },
    onCountrySelection(countryCode) {
      this.$emit("Map:Clicked", countryCode);
    },
    onSearchTriggered(countryCode) {
      worldMap.handleSearch(countryCode, this.onCountrySelection);
    },
  },
});
</script>

<template>
  <div class="map-layer">
    <div class="map-container">
      <div class="loader">
        <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
      </div>
      <indicator-panel></indicator-panel>
      <div id="map"></div>
    </div>
  </div>
</template>
