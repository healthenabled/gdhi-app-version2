<script>
import Vue from "vue";
import indicatorFilter from "../../indicatorFilter/indicator-filter.vue";
import { EventBus } from "../../common/event-bus";
import { EVENTS } from "../../../constants";
import axios from "axios";

export default Vue.extend({
  name: "RegionBarGraphContainer",
  data() {
    return {
      category: window.appProperties.getCategoryFilter() - 1,
      regionCountriesData: {},
      selectedYear: "",
    };
  },
  props: {
    defaultYear: { type: String, required: true },
  },
  mounted() {
    EventBus.$on(EVENTS.YEAR_FILTERED, (selectedYear) => {
      this.selectedYear = selectedYear;
      this.getRegionCountriesData();
    });
    EventBus.$on(EVENTS.LATEST_YEAR, (latestYear) => {
      this.selectedYear = latestYear;
      this.getRegionCountriesData();
    });
  },
  methods: {
    getRegionCountriesData() {
      const regionId = this.$route.params.regionId;
      const years = [this.defaultYear, this.selectedYear];
      axios
        .get(`/api/region/${regionId}`, {
          params: {
            list_of_years: years.reduce((f, s) => `${f},${s}`),
          },
        })
        .then(({ data }) => {
          //   console.log(data);
        });
    },
  },
});
</script>

<template>
  <div>Hello</div>
</template>
