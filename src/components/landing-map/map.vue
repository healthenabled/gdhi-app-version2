<script>
import Vue from "vue";

import { EventBus } from "../common/event-bus";
import indicatorPanel from "../indicatorPanel/indicator-panel.vue";
import MapLegend from "../legend/legend.vue";
import axios from "axios";
import worldMap from "./world-map";
import helper from "./map-helper";
import merge from "lodash/merge";
import common from "../../common/common";

export default Vue.extend({
  components: {
    indicatorPanel,
    MapLegend,
  },
  data() {
    return {
      globalHealthIndices: [],
      lastSelectedCountry: "",
      globalHealthIndicators: [],
      categoryValue: "",
      phaseValue: "",
      categories: [],
      phases: [],
      locale: "en",
    };
  },
  created() {
    this.categoryValue = window.appProperties.getCategoryFilter();
    this.phaseValue = window.appProperties.getPhaseFilter();
    this.fetchGlobalIndices();
    this.fetchCategoricalIndicators();
    this.fetchPhases();
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
  },
  updated() {
    if (this.locale !== this.$i18n.locale) {
      this.fetchCategoricalIndicators();
      this.fetchGlobalIndices();
      this.locale = this.$i18n.locale;
    }
  },
  beforeDestroy() {
    EventBus.$off("Map:Searched", this.onSearchTriggered);
  },
  methods: {
    filter: function () {
      window.appProperties.setCategoryFilter({
        categoryId: this.categoryValue,
      });
      window.appProperties.setPhaseFilter({ phaseId: this.phaseValue });
      this.$emit("filtered");
      this.fetchGlobalIndices();
    },

    resetFilters: function () {
      this.categoryValue = "";
      this.phaseValue = "";
      this.filter();
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
    fetchCategoricalIndicators: function () {
      const self = this;
      return axios
        .get(
          "/api/health_indicator_options",
          common.configWithUserLanguageAndNoCacheHeader(this.$i18n.locale)
        )
        .then((categories) => {
          self.categories = categories.data;
        });
    },
    fetchPhases: function () {
      const self = this;
      axios.get("/api/phases").then((response) => {
        self.phases = response.data;
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
    <div class="map-container content-width">
      <div class="loader">
        <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
      </div>
      <indicator-panel></indicator-panel>
      <MapLegend></MapLegend>

      <div class="filter-section">
        <div class="filter-indicator">
          <select
            class="filter-1"
            v-model="categoryValue"
            @change="filter()"
            name="test_select1"
          >
            <option value="">{{ $t("mixed.textOverAll") }}</option>
            <option
              v-for="category in categories"
              v-bind:value="category.categoryId"
            >
              {{ category.categoryName }}
            </option>
          </select>
        </div>
        <div class="phase-indicator">
          <select
            class="filter-2"
            v-model="phaseValue"
            @change="filter()"
            name="test_select2"
          >
            <option value="">{{ $t("mixed.all") }}</option>
            <option v-for="phase in phases" v-bind:value="phase.phaseValue">
              {{ $t("mixed.phase") }} {{ phase.phaseValue }}
            </option>
          </select>
        </div>
      </div>

      <div id="map"></div>
    </div>
  </div>
</template>
