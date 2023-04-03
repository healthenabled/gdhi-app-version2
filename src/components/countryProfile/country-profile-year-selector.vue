<script>
import Vue from "vue";
import axios from "axios";
import yearFilter from "../defaultYearSelector/year-filter.vue";
import { EventBus } from "../common/event-bus";
import { EVENTS } from "../../constants";

export default Vue.extend({
  name: "countryProfileYearSelector",
  components: { yearFilter },
  data() {
    return {
      defaultYear: window.appProperties.getDefaultYear(),
      years: [],
      countryCode: this.$route.params.countryCode,
    };
  },

  created() {
    this.fetchDefaultYear();
  },

  mounted() {
    this.fetchPublishedYearsForACountry(this.countryCode);
  },

  methods: {
    fetchDefaultYear: function () {
      axios.get("/api/bff/distinct_year").then(({ data }) => {
        this.defaultYear = data.defaultYear;
        window.appProperties.setDefaultYear({
          defaultYear: data.defaultYear,
        });
      });
    },
    fetchPublishedYearsForACountry(countryCode) {
      axios
        .get(`/api/countries/${countryCode}/published_years`)
        .then((response) => {
          this.years = response.data;
        });
    },
  },
});
</script>

<template>
  <div>
    <div class="year-indicator">
      <div class="header-bold">Select year</div>
      <div class="">
        To view data for a specific year, please select the desired year.
      </div>
      <yearFilter :selectedYear="defaultYear" :years="years" />
    </div>
  </div>
</template>
