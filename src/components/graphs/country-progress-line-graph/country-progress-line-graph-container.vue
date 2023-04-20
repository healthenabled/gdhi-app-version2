<script>
import Vue from "vue";
import axios from "axios";
import CountryProgressLineGraphChart from "./country-progress-line-graph-chart.vue";
import indicatorFilter from "../../indicatorFilter/indicator-filter.vue";
import { EventBus } from "../../common/event-bus";
import { EVENTS } from "../../../constants";

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
      selectedRegionId: null,
      selectedRegionName: "",
    };
  },
  props: {
    locale: { type: String, required: true },
    countryName: { type: String, required: true },
  },
  mounted() {
    this.getPublishedYears();
    this.getYearOnYearData(this.$route.params.countryCode);
    EventBus.$on(EVENTS.INDICATOR_FILTERED, () => {
      this.category = window.appProperties.getCategoryFilter() - 1;
    });
    EventBus.$on(EVENTS.REGION_FILTERED, (selectedRegion) => {
      this.selectedRegionName = selectedRegion.name;
      this.selectedRegionId = selectedRegion.id;
      this.getYearOnYearData(this.$route.params.countryCode);
    });
  },
  methods: {
    getPublishedYears() {
      axios.get("/api/bff/distinct_year").then(({ data: { years } }) => {
        this.years = years.reverse();
        const lastElement = Number(this.years[this.years.length - 1]);
        this.years.push(String(lastElement + 1));
        this.years.unshift("");
      });
    },
    getYearOnYearData(countryCode) {
      axios
        .get(`/api/countries/${countryCode}/year_on_year`, {
          params: {
            regionId: this.selectedRegionId,
          },
        })
        .then(({ data }) => {
          this.yearOnYearData = data;
        });
    },
  },
});
</script>

<template>
  <div class="container">
    <div class="indicator-filter-container">
      <indicatorFilter title="countryProfile.IndicatorGroupingDescription" />
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
