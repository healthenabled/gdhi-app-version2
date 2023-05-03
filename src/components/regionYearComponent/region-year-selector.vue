<script>
import Vue from "vue";
import axios from "axios";
import { EventBus } from "../common/event-bus";
import YearFilter from "../defaultYearSelector/year-filter.vue";
import { EVENTS } from "../../constants";

export default Vue.extend({
  components: {
    YearFilter,
  },
  data() {
    return {
      years: [],
      latestYear: "",
      defaultYear: "",
      selectedYear: "",
    };
  },
  mounted() {
    this.getYearsForARegion();
  },
  methods: {
    getYearsForARegion() {
      const regionId = this.$route.params.regionId;
      axios.get(`/api/region/${regionId}/get_years`).then(({ data }) => {
        this.years = data;
        this.latestYear = data[0];
      });
    },
  },
});
</script>

<template>
  <div class="year-indicator">
    <div class="year-text">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="20" height="20" fill="#CED4DA" />
      </svg>
      <div class="text">{{ $t("regionalOverview.selectYear") }}</div>
    </div>
    <YearFilter :selectedYear="latestYear" :years="years" />
  </div>
</template>

<style scoped lang="scss">
@import "region-year-selector";
</style>
