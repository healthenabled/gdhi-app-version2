<script>
import Vue from "vue";
import axios from "axios";
import RegionBarGraph from "./region-bar-graph.vue";
import IndicatorFilter from "../../indicatorFilter/indicator-filter.vue";
import { EventBus } from "../../common/event-bus";
import { EVENTS } from "../../../constants";

export default Vue.extend({
  name: "RegionBarGraphContainer",
  data() {
    return {
      category: window.appProperties.getCategoryFilter() - 1,
      regionCountriesData: [],
      countries: [],
      defaultYearCountriesScore: new Map(),
      selectedYearCountriesScore: new Map(),
    };
  },
  props: {
    defaultYear: { type: String, required: true },
    year: { type: String, required: false, default: "" },
    locale: { type: String, required: true },
  },
  mounted() {
    this.getRegionCountriesData();
    EventBus.$on(EVENTS.INDICATOR_FILTERED, () => {
      this.category = window.appProperties.getCategoryFilter() - 1;
    });
  },
  watch: {
    locale() {
      this.getRegionCountriesData();
    },
    year() {
      this.getRegionCountriesData();
    },
  },
  methods: {
    getCountriesNames(regionCountriesData) {
      this.countries = [];
      regionCountriesData.map(({ countryName }) => {
        this.countries.push(countryName);
      });
    },
    getDefaultYearCountriesData(regionCountriesData) {
      this.defaultYearCountriesScore = new Map();
      regionCountriesData.map((country) => {
        let countryName = country.countryName;
        country.countryYearsData.map((countryYearsData) => {
          if (countryYearsData.year === this.defaultYear) {
            this.defaultYearCountriesScore.set(
              countryName,
              countryYearsData.country
            );
          }
        });
      });
    },
    getSelectedYearCountriesData(regionCountriesData) {
      this.selectedYearCountriesScore = new Map();
      regionCountriesData.map((country) => {
        let countryName = country.countryName;
        country.countryYearsData.map((countryYearsData) => {
          if (countryYearsData.year === this.year) {
            console.log(
              "CountryName: " + countryName + "if : " + countryYearsData.year
            );
            this.selectedYearCountriesScore.set(
              countryName,
              countryYearsData.country
            );
          }
        });
      });
    },
    getRegionCountriesData() {
      const regionId = this.$route.params.regionId;
      const years = [this.defaultYear, this.year];
      axios
        .get(`/api/region/${regionId}`, {
          params: {
            list_of_years: years.reduce((f, s) => `${f},${s}`),
          },
          headers: {
            "Cache-Control": "no-cache",
            user_language: this.$i18n.locale,
          },
        })
        .then(({ data: { regionCountriesData } }) => {
          this.getCountriesNames(regionCountriesData);
          this.getDefaultYearCountriesData(regionCountriesData);
          this.getSelectedYearCountriesData(regionCountriesData);
        });
    },
  },
  components: { RegionBarGraph, IndicatorFilter },
});
</script>

<template>
  <div class="box overall-card">
    <IndicatorFilter />
    <RegionBarGraph
      v-if="defaultYearCountriesScore.size || selectedYearCountriesScore.size"
      :labels="countries"
      :defaultYearData="defaultYearCountriesScore"
      :selectedYearData="selectedYearCountriesScore"
      :categoryFilter="category"
    />
  </div>
</template>
