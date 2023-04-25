<script>
import Vue from "vue";
import axios from "axios";
import CountryProgressLineGraphChart from "./country-progress-line-graph-chart.vue";
import indicatorFilter from "../../indicatorFilter/indicator-filter.vue";
import { EventBus } from "../../common/event-bus";
import { EVENTS } from "../../../constants";
import common from "../../../common/common";

export default Vue.extend({
  name: "CountryProgressLineGraphContainer",
  components: {
    CountryProgressLineGraphChart,
    indicatorFilter,
  },
  data() {
    return {
      category: window.appProperties.getCategoryFilter() - 1,
      yearOnYearData: {},
      years: [],
      selectedRegion: {},
    };
  },
  props: {
    locale: { type: String, required: true },
    countryName: { type: String, required: true },
  },
  mounted() {
    common.showLoading();
    Promise.all([
      this.getPublishedYearsPromise(),
      this.getYearOnYearDataPromise(this.$route.params.countryCode),
    ])
      .then(([publishedYearsResponse, yearOnYearDataResponse]) => {
        this.getPublishedYearSuccessCallback(publishedYearsResponse);
        this.getYearOnYearDataSuccessCallback(yearOnYearDataResponse);
      })
      .finally(() => {
        common.hideLoading();
      });
    EventBus.$on(EVENTS.INDICATOR_FILTERED, () => {
      this.category = window.appProperties.getCategoryFilter() - 1;
    });
    EventBus.$on(EVENTS.REGION_FILTERED, () => {
      this.selectedRegion = window.appProperties.getRegion();
      this.getYearOnYearData(this.$route.params.countryCode);
    });
  },
  methods: {
    getPublishedYearSuccessCallback({ data: { years } }) {
      this.years = years.reverse();
      const lastElement = Number(this.years[this.years.length - 1]);
      this.years.push(String(lastElement + 1));
      this.years.unshift("");
    },
    getPublishedYearsPromise() {
      return axios.get("/api/bff/distinct_year");
    },
    getYearOnYearDataSuccessCallback({ data }) {
      this.yearOnYearData = data;
    },

    getYearOnYearData(countryCode) {
      this.getYearOnYearDataPromise(countryCode).then((response) => {
        this.getYearOnYearDataSuccessCallback(response);
      });
    },

    getYearOnYearDataPromise(countryCode) {
      return axios.get(`/api/countries/${countryCode}/year_on_year`, {
        params: {
          regionId: this.selectedRegion.region_id,
        },
      });
    },
  },
});
</script>

<template>
  <div class="container">
    <div class="indicator-filter-container">
      <indicatorFilter
        title="countryProfile.countryProgressLineChart.indicatorGroupingDescription"
      />
    </div>
    <CountryProgressLineGraphChart
      v-if="Object.keys(yearOnYearData).length"
      :yearOnYearData="yearOnYearData.yearOnYearData"
      :currentYear="yearOnYearData.currentYear"
      :defaultYear="yearOnYearData.defaultYear"
      :locale="locale"
      :categoryFilter="category"
      :xAxisLabels="years"
      :countryName="countryName"
      :regionName="selectedRegion.regionName"
    />
  </div>
</template>

<style scoped lang="scss">
@import "../../../assets/stylesheets/rtl-support";

.container {
  height: 100%;
  .indicator-filter-container {
    @include padding-left(16px);
    padding-top: 2px;
  }
}
</style>
