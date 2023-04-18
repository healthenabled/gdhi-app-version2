<script>
import Vue from "vue";
import axios from "axios";
import lineGraphChart from "./lineGraphChart.vue";
import indicatorFilter from "../indicatorFilter/indicator-filter.vue";
import { EventBus } from "../common/event-bus";
import { EVENTS } from "../../constants";

export default Vue.extend({
  components: {
    lineGraphChart,
    indicatorFilter,
  },
  props: {},
  data() {
    return {
      category: 0,
      yearOnYearData: {},
      years: [],
    };
  },
  props: {
    locale: { type: String, required: true },
  },
  mounted() {
    this.getPublishedYears();
    this.getYearOnYearData(this.$route.params.countryCode);
    EventBus.$on(EVENTS.INDICATOR_FILTERED, () => {
      this.category = window.appProperties.getCategoryFilter() - 1;
    });
  },
  methods: {
    appendFutureYear(years) {
      let lastElement = years[years.length - 1];
      lastElement = Number(lastElement);
      lastElement++;
      lastElement = lastElement.toString();
      years.push(lastElement);
      years.unshift("");
    },
    getPublishedYears() {
      axios.get("/api/bff/distinct_year").then((response) => {
        this.years = response.data.years;
        this.appendFutureYear(this.years);
      });
    },
    getYearOnYearData(countryCode) {
      axios
        .get(`/api/countries/${countryCode}/year_on_year`)
        .then((response) => {
          this.yearOnYearData = response.data;
        });
    },
  },
});
</script>
<template>
  <div style="height: 100%">
    <indicatorFilter style="height: 10%" />
    <lineGraphChart
      v-if="Object.keys(yearOnYearData).length"
      :yearOnYearData="yearOnYearData.yearOnYearData"
      :currentYear="yearOnYearData.currentYear"
      :defaultYear="yearOnYearData.defaultYear"
      :locale="locale"
      :categoryFilter="category"
      :labels="years"
    />
  </div>
</template>
