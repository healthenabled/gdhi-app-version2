<script>
import Vue from "vue";
import { EventBus } from "../common/event-bus";
import indicatorPanel from "../indicatorPanel/indicator-panel.vue";
import axios from "axios";
import worldMap from "./world-map";
import helper from "./map-helper";
import { merge } from "lodash";
import common from "../../common/common";
import { EVENTS } from "../../constants";

export default Vue.extend({
  components: {
    indicatorPanel,
  },
  data() {
    return {
      globalHealthIndices: [],
      lastSelectedCountry: "",
      locale: "en",
    };
  },
  name: "LandingMap",
  created() {
    this.fetchGlobalIndices();
  },
  mounted: function () {
    EventBus.$on("Map:Searched", this.onSearchTriggered);
    this.$on("Map:Clicked", ($clickedEl) => {
      if ($clickedEl.type === "GLOBAL") {
        this.resetFilters();
        this.fetchGlobalIndices();
        if (document.querySelector("#search-box input"))
          document.querySelector("#search-box input").value = "";
      } else {
        if (document.querySelector("#search-box input"))
          document.querySelector("#search-box input").value =
            $clickedEl.countryName;
      }
    });
    EventBus.$on(EVENTS.INDICATOR_FILTERED, () => {
      this.fetchGlobalIndices();
    });
    EventBus.$on(EVENTS.PHASE_FILTERED, () => {
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
    EventBus.$off(EVENTS.INDICATOR_FILTERED);
  },
  methods: {
    resetFilters() {
      EventBus.$emit("Reset:Filters");
    },
    fetchGlobalIndices: function () {
      const self = this;
      common.showLoading();
      const windowProperties = window.appProperties;
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
          const globalHealthIndicesWithScores =
            globalHealthIndices.data.countryHealthScores.filter((country) => {
              return window.appProperties.getCategoryFilter()
                ? country.categories[0].phase != -1
                : country.countryPhase != null;
            });
          this.globalHealthIndices = self.mergeColorCodeToHealthIndicators(
            globalHealthIndicesWithScores
          );
          worldMap.drawMap(
            self.globalHealthIndices,
            self.onCountrySelection,
            this.$i18n
          );
          common.hideLoading();
        });
    },
    mergeColorCodeToHealthIndicators: function (globalHealthIndices) {
      const collection = globalHealthIndices;
      collection.forEach((value) => {
        merge(value, {
          colorCode: window.appProperties.getCategoryFilter()
            ? helper.getColorCodeFor(value.categories[0].phase)
            : helper.getColorCodeFor(value["countryPhase"]),
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
      <div id="map" style="max-height: 70vh"></div>
    </div>
  </div>
</template>
